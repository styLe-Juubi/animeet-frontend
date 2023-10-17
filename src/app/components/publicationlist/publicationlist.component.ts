import { Component, HostListener, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimeService } from 'src/app/services/anime.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-publicationlist',
  templateUrl: './publicationlist.component.html',
  styleUrls: ['./publicationlist.component.scss']
})
export class PublicationlistComponent implements OnChanges {

  public userLogged: any;
  @Input() user: any;
  @Input() type: any;
  @Input() feed: boolean = false;
  @Output() reloadCounters: EventEmitter<boolean> = new EventEmitter();
  public page: any;
  public url = wsUrl;
  public publications: any;
  public order: number = -1;
  public totalPages: any;

  public showAnimes = false;
  public selectedAnime: any;
  public filePreview: any;
  public review = false;
  public formSubmitted = false;
  public publicationForm = this._fb.group({
    content: [ null, [ Validators.maxLength(20000) ] ],
    file: [null],
    type: ['publication', [ Validators.required ]],
    anime: [null]
  });

  public search: any;
  public animes: any;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _animeService: AnimeService,
    private readonly _commonService: CommonService,
  ) { }

  ngOnChanges(): void {
    this.userLogged = this._authService.getIdentity();

    if( !this.feed ) {
      this.getUserPublications( this.user._id, 1, this.order, this.type );
    } else {
      this.getUserFeed( 1, this.order, this.type );
    }
    
  }

  createPublication() {
    let btn = document.querySelector('#btn-publication-submit');
    btn?.setAttribute('disabled', '');
    btn?.classList.add('wait-submit');

    /* Publication ifs */
    if( this.publicationForm.controls['content'].value === null && this.publicationForm.controls['type'].value === 'publication' && this.publicationForm.controls['file'].value === null ) {

      this._toastrService.info('Debes ingresar texto en el contenido de la Publicacion !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    } else if ( (this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.trim() === '') && this.publicationForm.controls['type'].value === 'publication' && this.publicationForm.controls['file'].value === null ) {
      
      this._toastrService.info('Debes ingresar texto en el contenido de la Publicacion !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    } else if ( (this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.trim() === '') && this.publicationForm.controls['type'].value === 'publication' && this.publicationForm.controls['file'].value !== null ) {
      
      this.publicationForm.controls['content'].setValue( null );

    } else if ( (this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.trim() === '') && this.publicationForm.controls['type'].value === 'review' ) {
      
      this._toastrService.info('Debes ingresar texto en el contenido de la Reseña !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    }

    /* Review ifs */
    if( ( this.publicationForm.controls['content'].value === null || (this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.trim() === ''))
      && this.publicationForm.controls['type'].value === 'review' 
      && (this.publicationForm.controls['anime'].value === null || this.publicationForm.controls['anime'].value.trim() === '' ) 
    ) { 

      this._toastrService.info('Debes ingresar texto en el contenido de la Reseña !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    } else if (
      (this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.trim() !== '') 
      && this.publicationForm.controls['type'].value === 'review' 
      && (this.publicationForm.controls['anime'].value === null || this.publicationForm.controls['anime'].value.trim() === '' )
    ) {

      this._toastrService.info('Debes seleccionar un anime para la Reseña !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    } else if (
      (this.publicationForm.controls['content'].value === null || this.publicationForm.controls['content'].value.trim() === '') 
      && this.publicationForm.controls['type'].value === 'review' 
      && (this.publicationForm.controls['anime'].value !== null || this.publicationForm.controls['anime'].value.trim() !== '' )
    ) {

      this._toastrService.info('Debes ingresar texto en el contenido de la Reseña !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;

    }

    if ( this.publicationForm.controls['content'].value !== null && this.publicationForm.controls['content'].value.length > 45000 ) {
      this._toastrService.info('La cantidad maxima de caracteres es de 45,000 !');
      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
      return;
    }

    const publicationToSend = {
      ...( this.publicationForm.controls['content'].value !== null && { content: this.publicationForm.controls['content'].value }),
      ...( this.publicationForm.controls['type'].value !== null && { type: this.publicationForm.controls['type'].value }),
      ...( this.publicationForm.controls['file'].value !== null && { file: this.publicationForm.controls['file'].value }),
      ...( this.publicationForm.controls['anime'].value !== null && { anime: this.publicationForm.controls['anime'].value }),
   }

    this._userService.createPublication( publicationToSend ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        setTimeout(() => {
          btn?.removeAttribute('disabled');
          btn?.classList.remove('wait-submit');
        }, 1000 );
        return;
      }

      this._toastrService.success('Publicacion creada correctamente !');
      this.publicationForm.reset();
      this.publicationForm.controls['type'].setValue('publication');
      this.selectedAnime = null;
      this.removePreview();
      this.review = false;
      this.reloadCountersAction();

      if( !this.feed ) {
        this.getUserPublications( this.user._id, 1, this.order, this.type );
      } else {
        this.getUserFeed( 1, this.order, this.type );
      }

      setTimeout(() => {
        btn?.removeAttribute('disabled');
        btn?.classList.remove('wait-submit');
      }, 1000 );
    });
  }

  setTypePublication( value: boolean ) {
    this.review = value;
    if( this.review ) {
      this.publicationForm.controls['type'].setValue('review');
      this.removePreview();
    } else {
      this.publicationForm.controls['type'].setValue('publication');
      this.publicationForm.controls['anime'].setValue( null );
      this.selectedAnime = null;
    }
  }

  uploadFile() {
    let upload = document.getElementById("publication-upload-file");
    upload?.click();
  }

  setImage( event: any ) {
    this.publicationForm.controls['file'].setValue( event.target.files[0] );
  }

  readURL(event: any ): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.filePreview = reader.result;

        reader.readAsDataURL(file);
        let imagePrev = document.querySelector('#publication-image-preview');
        imagePrev?.classList.add('show-preview');
    }
  }

  removePreview() {
    this.filePreview = null;
    let imagePrev = document.querySelector('#image-preview');
    imagePrev?.classList.remove('show-preview');

    this.publicationForm.controls['file'].setValue( null );
  }

  showAnimeList( value: boolean ) {
    this.showAnimes = value;
  }

  searchFastF( event: any ) { 
    this.search = event.target.value.trim();
    if( this.search == '' ) {
      return;
    }
    this._animeService.getAnimes( this.search, undefined, 15 ).subscribe( ( response: any ) => {
      if( response.message ) {
        this.animes = null;
      } else {
        this.animes = response.data.docs;
      }
    });
  }

  setAnimeToReview( id: string, name: string ) {
    this.selectedAnime = name;
    this.publicationForm.controls['anime'].setValue( id );
  }

  deletePublication( id: string ) {
    this._userService.deletePublication( id ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        return;
      }
      
      this._toastrService.success('Publicacion eliminada correctamente !');
      this.reloadCountersAction();
      if( !this.feed ) {
        this.getUserPublications( this.user._id, this.page, this.order, this.type );
      } else {
        this.getUserFeed( this.page, this.order, this.type );
      }
      
    });
  }

  getUserPublications( id: string, page: number, order: number, type: string ) {
    this._userService.findUserPublications( id, page, order, type ).subscribe(( response: any ) => {
      if( response.message ) {
        this.publications = null;
        return;
      };
      this.publications = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    });
  }

  getUserFeed( page: number, order: number, type: string ) {
    this._userService.findUserFeed( page, order, type ).subscribe(( response: any ) => {
      if( response.message ) {
        this.publications = null;
        return;
      };
      this.publications = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    });
  }

  loadMorePublications( id: string, page: number, order: number, type: string, value: boolean ) {
    if( !value ) {
      this._userService.findUserPublications( id, page, order, type ).subscribe(( response: any ) => {
        if( response.message ) {
          this._toastrService.info( response.message );
          return;
        };
        for ( let publication of response.data.docs ) {
          this.publications.push( publication );
        }
        this.page = response.data.page;
        this.totalPages = response.data.totalPages;
      });
    } else {
      this._userService.findUserFeed( page, order, type ).subscribe(( response: any ) => {
        if( response.message ) {
          this._toastrService.info( response.message );
          return;
        };
        for ( let publication of response.data.docs ) {
          this.publications.push( publication );
        }
        this.page = response.data.page;
        this.totalPages = response.data.totalPages;
      });
    }
  }

  publicationOrder( value: number ) {
    if( value === -1 && this.order === -1 ) this.order = 1;
    if( value === 1 && this.order === 1 ) this.order = -1;

    let btn = document.querySelector('#publications-order');
    btn?.setAttribute('disabled', '');
    btn?.classList.add('wait-submit');
    
    if( !this.feed ) {
      this.getUserPublications( this.user._id, 1, this.order, this.type );
    } else {
      this.getUserFeed( 1, this.order, this.type );
    }

    setTimeout(() => {
      btn?.removeAttribute('disabled');
      btn?.classList.remove('wait-submit');
    }, 1000 );
  }

  openImage( filename: string ) {
    this._commonService.changeImage( `publication/image/${ filename }` );
  }

  closeImage() {
    let modal = document.querySelector('#modal-publication-image');
    modal?.classList.remove('show-modal');
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    this.closeImage();
    this.showAnimes = false;
    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    this.closeImage();
    
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

  reloadCountersAction() {
    this.reloadCounters.emit( true );
  }

  openPublication( username: string, publicationId: string ): void {
    this._router.navigate([`/${ username }/publicacion/${ publicationId }`]);
  }
}
