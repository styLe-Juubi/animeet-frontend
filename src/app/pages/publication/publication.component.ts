import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: [
    './publication.component.scss',
    '../../components/publicationlist/publicationlist.component.scss'
  ]
})
export class PublicationComponent implements OnInit {

  public user: any;
  public userLogged: any;
  public publication: any;
  public url = wsUrl;
  public suggestions: any;

  public followersCount: any;
  public publicationsCount: any;
  public reviewsCount: any;
  public loveCount: any;
  public waitCount: any;
  public watchCount: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _toastrService: ToastrService,
    private readonly _titleService: Title,
  ) { }

  ngOnInit(): void {
    this.userLogged = this._authService.getIdentity();
    this._route.params.subscribe(( params: any ) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this._titleService.setTitle(`Publicación de ${ params.username } — Animeet`);
      this.getUserByUsername( params.username, params.id );
    });
    this.getFiveSuggestions();
  }

  getCounters( id: string ) {
    this._userService.getUserFollowCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.followersCount = response.data.followers;
    });
    this._userService.getUserPublicationCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.publicationsCount = response.data.publications;
      this.reviewsCount = response.data.reviews;
    });
    this._userService.getUserListCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.loveCount = response.data.love;
      this.waitCount = response.data.wait;
      this.watchCount = response.data.watch;
    });
  }

  reloadCountersHandler() {
    this.getCounters( this.user._id );
  }

  getFiveSuggestions() {
    this._userService.findFiveSuggestions().subscribe(( response: any ) => {
      if( response.message ) return;
      this.suggestions = response.data;
    });
  }

  getUserByUsername( username: string, publicationId: string ): void {
    this._userService.findByUsername( username ).subscribe(( response: any ) => {
      if ( response.message ) {
        this._toastrService.info('El usuario no ha sido encontrado !');
        this._router.navigate(['/']);
        return;
      }

      this.user = response.data;
      this.getCounters( this.user._id );
      this.getPublication( publicationId );
    });
  }

  getPublication( id: string ): void {
    this._userService.getPublication( id ).subscribe(( response: any ) => {
      if ( response.message ) {
        this._toastrService.info('La publicación no ha sido encontrada !');
        this._router.navigate(['/']);
        return;
      }

      this.publication = response.data;
    })
  }

  deletePublication( id: string ) {
    this._userService.deletePublication( id ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        return;
      }
      
      this._toastrService.success('Publicacion eliminada correctamente !');
      this._router.navigate(['/']);
    });
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

  openImage( filename: string ) {
    let modal = document.querySelector('#modal-publication-image');
    let image = document.querySelector('#publication-image');

    modal?.classList.add('show-modal');
    image?.setAttribute('src', `${ this.url }/publication/image/${ filename }`);
    image?.setAttribute('alt', filename );
  }

  closeImage() {
    let modal = document.querySelector('#modal-publication-image');
    modal?.classList.remove('show-modal');
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    this.closeImage();
    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    this.closeImage();
    
  }

}
