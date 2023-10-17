import { Component, OnInit, HostListener } from '@angular/core';
import { AllianceService } from 'src/app/services/alliance.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-alliance',
  templateUrl: './alliance.component.html',
  styleUrls: ['./alliance.component.scss']
})
export class AllianceComponent implements OnInit {

  public url = wsUrl;
  public alliances: any;
  public identity: any;
  public showCreateAlliance: boolean = false;
  public formSubmitted: boolean = false;

  public page: number = 1;
  public order: number = -1;
  public limit: number = 10;
  public totalPages!: number;

  public allianceForm = this._fb.group({
    name: ['', [ Validators.required ]],
    description: ['', [ Validators.required ]],
    url: ['', [ Validators.required ]],
    image: ['', [ Validators.required ]],
    coverImage: ['', [ Validators.required ]],
  });

  constructor(
    private readonly _allianceService: AllianceService,
    private readonly _toastrService: ToastrService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _authService: AuthService,
    private readonly _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.identity = this._authService.getIdentity();
    this._route.queryParams.subscribe( params => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      let page = params['pagina'];
      if( !page ) {
        this.page = 1;
      } else {
        this.page = page;
      }

      this.order = params['orden'];
      this.getAlliances( this.page, this.limit, this.order );
    });
  }

  getAlliances( page: number, limit: number, order: number ): void {
    this._allianceService.getAlliances( page, limit, order ).subscribe(( response: any ) => {
      if ( response.message ) {
        this._toastrService.info( response.message );
        return;
      }

      this.alliances = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    });
  }

  goTo( url: string ): void {
    window.open( url, '_blank' );
  }

  openNewAlliance( value: boolean ): void {
    this.showCreateAlliance = value;
  }

  createAlliance() {
    this.formSubmitted = true;
    let button = document.querySelector( '#allianceSubmit' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');

    if( this.allianceForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
      }, 2000 );
      this._toastrService.info('Todos los campos y las dos imagenes son requeridas !');
      return;
    }

    this._allianceService.create( this.allianceForm.value ).subscribe(( response: any ) => {
      if ( response.message ) {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        this._toastrService.info( response.message );
        return;
      }

      this._toastrService.success('Alianza creada correctamente !');
      this.getAlliances( this.page, this.limit, this.order );
      button?.removeAttribute('disabled');
      button?.classList.remove('wait-submit');
      this.closeAllianceModal();
      return;
    });

  }

  setAllianceImage( type: string ): void {
    if ( type === 'coverImage' ) {
      let input = document.createElement('input');
      input.type = 'file';

      input.onchange = (e: any) => {
        let file = e.target?.files[0] || ''; 
        console.log( file );
        this.allianceForm.controls['coverImage'].setValue( file );

        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ( readerEvent: any ) => {
          let content = readerEvent.target.result; 
          document.querySelector('#alliance-coverImage')?.setAttribute( 'src', content );
        }
      }

      input.click();
    }

    if ( type === 'image' ) {
      let input = document.createElement('input');
      input.type = 'file';

      input.onchange = (e: any) => {
        let file = e.target?.files[0] || ''; 
        console.log( file );
        this.allianceForm.controls['image'].setValue( file );

        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ( readerEvent: any ) => {
          let content = readerEvent.target.result; 
          document.querySelector('#alliance-image')?.setAttribute( 'src', content );
        }
      }

      input.click();
    }
    
  }

  campoNoValido( campo: string ): boolean {
      
    if( this.allianceForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

  changePage( event: any ): void {
    if ( event === 'next' ) {

      if( this.page + 1 > this.totalPages ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this._router.navigate(['/alianzas'], { queryParams: { pagina: this.page + 1, orden: this.order }});
    
    } else if ( event === 'back' ) {

      if( this.page - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this._router.navigate(['/alianzas'], { queryParams: { pagina: this.page - 1, orden: this.order }});
    
    } else if ( event === this.totalPages ) {

      this._router.navigate(['/alianzas'], { queryParams: { pagina: this.totalPages, orden: this.order }});
      
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    this.closeAllianceModal();
    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    this.closeAllianceModal();
    
  }

  closeAllianceModal() {
    let div = document.querySelector('#alliance-modal');
    div?.classList.add('hide-chat');
    setTimeout(() => {
      div?.classList.remove('hide-chat');
      this.showCreateAlliance = false;
    }, 100 );
  }

}
