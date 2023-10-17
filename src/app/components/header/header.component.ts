import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimateService } from 'src/app/services/animate.service';
import { AnimeService } from 'src/app/services/anime.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public url = wsUrl;
  @Input() identity: any = null;
  @Input() usersOnline: number = 0;
  @Input() allConnections: number = 0;
  @Output() showUsers: EventEmitter<boolean> = new EventEmitter();
  @Output() sendLogout: EventEmitter<boolean> = new EventEmitter();
  @Output() openSettings: EventEmitter<boolean> = new EventEmitter();
  @Output() openSidebarAction: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('notificationCounterDiv') notificationCounterDiv!: ElementRef;
  @ViewChild('chatNotificationCounterDiv') chatNotificationCounterDiv!: ElementRef;

  public showSearchAnimes: boolean = true;
  public showMenu: boolean = false;
  public showMore: boolean = false;
  public showNotifications: boolean = false;
  public showNotificationsMovil: boolean = false;
  public showThemelist: boolean = false;
  public animes: any = [];
  public users: any = [];
  public searchFast: any;
  public alreadySearch: boolean = false;
  public searchForm = this._fb.group({
    search: ['', [ Validators.required ] ]
  });

  public formSubmitted: boolean = false;
  public userForm = this._fb.group({
    username: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    surname: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    country: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(30) ]],
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
    description: ['', [ Validators.required, Validators.maxLength(10000) ]],
  });

  public followList: any = [];
  public typeList: string = '';
  public followPage: number = 1;
  public totalFollows: any;
  public totalPagesFollow: any;
  public notificationsCounter: number = 0;
  public chatsCounter: number = 0;

  public screenWidth: any;  
  public screenHeight: any;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _animateService: AnimateService,
    private readonly _animeService: AnimeService,
    private readonly _toastrService: ToastrService,
    private readonly _userService: UserService,
    private readonly _websocketService: WebsocketService,
    private readonly _notificationService: NotificationService,
    private readonly _themeService: ThemeService,
  ) {

    this._themeService.setTheme( localStorage.getItem('theme') || 'default' );

  }

  ngOnInit(): void {
    if ( this.identity ) {
      this.myNotificationsUnreadCount( this.identity._id );
      this.getNotificationsChatsCounter();
      this._websocketService.listenNotifications( this.identity._id ).subscribe(( response: any ) => {
        this.notificationsCounter = response;
        this.notificationCounterDiv.nativeElement.classList.add("animate__animated", "animate__tada");
        setTimeout(() => {
          this.notificationCounterDiv.nativeElement.classList.remove("animate__animated", "animate__tada");
        }, 800 );
      });
      this._websocketService.listenCounterChats( this.identity._id ).subscribe(( response: any ) => {
        this.chatsCounter = response;
        this.chatNotificationCounterDiv.nativeElement.classList.add("animate__animated", "animate__tada");
        setTimeout(() => {
          this.chatNotificationCounterDiv.nativeElement.classList.remove("animate__animated", "animate__tada");
        }, 800 );
      });
    }
    

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;  
  }

  @HostListener('window:resize', ['$event']) onResize( event: any ) {  
    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;  
  }  

  logout() {
    this.sendLogout.emit( true );
  }

  searchFastF( event: any ) { 
    this.searchFast = event.target.value.trim();
    if( this.searchFast == '' ) {
      return;
    }
    this._animeService.getAnimes( this.searchFast, undefined, 15 ).subscribe( ( response: any ) => {
      if( response.message ) {
        this.animes = null;
        this.showMore = false;
        this.alreadySearch = true;
      } else {
        this.animes = response.data.docs;
        this.showMore = true;
      }
    });
  }

  searchFastUsersF( event: any ) { 
    this.searchFast = event.target.value.trim();
    if( this.searchFast == '' ) {
      return;
    }
    this._userService.findRelationalUsers( this.searchFast, 1, 15 ).subscribe( ( response: any ) => {
      if( response.message ) {
        this.users = null;
        this.showMore = false;
        this.alreadySearch = true;
      } else {
        this.users = response.data.docs;
      }
    });
  }

  search() {
    if( this.searchForm.controls['search'].value == '' ) {
      this._toastrService.info('Debes ingresar datos en el buscador !');
      return;
    }
    let search = this.searchForm.controls['search'].value;
    this._router.navigate(['/animes'], { queryParams: { busqueda: search }});
  }

  searchUsers() {
    if( this.searchForm.controls['search'].value == '' ) {
      this._toastrService.info('Debes ingresar datos en el buscador !');
      return;
    }
    let search = this.searchForm.controls['search'].value;
    this._router.navigate(['/usuarios'], { queryParams: { busqueda: search }});
  }

  searchMovil() {
    if( this.searchForm.controls['search'].value == '' ) {
      this._toastrService.info('Debes ingresar datos en el buscador !');
      return;
    }
    this.openMenuMovil( false );
    let search = this.searchForm.controls['search'].value;
    this._router.navigate(['/animes'], { queryParams: { busqueda: search }});
  }

  showSearchUsers( value: boolean ) {
    this.showSearchAnimes = value;
  }

  showMoreAnimes() {
    this._router.navigate(['/animes'], { queryParams: { busqueda: this.searchFast }});
    this.closeList();
  }

  showMoreUsers() {
    this._router.navigate(['/animes'], { queryParams: { busqueda: this.searchFast }});
    this.closeList();
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.closeList();
    this.openNotifications( false );
    this.openThemes( false );
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeList();
    this.openNotifications( false );
    this.openThemes( false );
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

  showList() {
    let div = document.querySelector('#search-list');
    div?.classList.add('show-search-list');
  }

  closeList() {
    let div = document.querySelector('#search-list');
    div?.classList.remove('show-search-list');
  }

  openMenuMovil( value: boolean ) {
    let divMenu = document.querySelector('#menu-movil');
    this.showMenu = value;
    if( this.showMenu ) {
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
  }

  openUserList() {
    this.showUsers.emit( true );
  }

  openMessenger( value: boolean ) {
    let divMenu = document.querySelector('#messenger-movil');
    if( value ) {
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
  }

  openNotificationsMovil( value: boolean ): void {
    this.showNotificationsMovil = value;
    let divMenu = document.querySelector('#notifications-movil');
    if(  this.showNotificationsMovil ) {
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
  }

  openSettingsOptions() {
    this.openSettings.emit( true );
  }

  openNotifications( value: boolean ) {
    this.showNotifications = value;
  }

  openThemes( value: boolean ) {
    this.showThemelist = value;
  }

  openThemesMovil( value: boolean ): void {
    this.showThemelist = value;
    let divMenu = document.querySelector('#themes-movil');
    if(  this.showThemelist ) {
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
  }

  showNotificationsHandler( value: boolean ): void {
    this.openNotifications( value );
    this.openNotificationsMovil( value );
    this.openMenuMovil( value );
  }

  getCounterNotificationHandler( value: boolean ): void {
    ( value ) && this.myNotificationsUnreadCount( this.identity._id );
  }

  openSettingsMovil( value: boolean ) {
    let divMenu = document.querySelector('#user-settings-movil');
    if( value ) {
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
    this.userForm = this._fb.group({
      username: [ this.identity.username || null, [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
      name: [ this.identity.name || null, [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
      surname: [ this.identity.surname || null, [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
      country: [ this.identity.country || null, [ Validators.required, Validators.minLength(1), Validators.maxLength(30) ]],
      email: [ this.identity.email || null, [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
      description: [ this.identity.description || null, [ Validators.maxLength(10000) ]],
    });
  }

  openTypeFile( type: string ) {
    let upload: any;

    if( type === 'coverImage' ) upload = document.querySelector(`#upload-file-coverImage`);
    if( type === 'image' ) upload = document.querySelector(`#upload-file-image`);
    
    upload?.click();
  }

  uploadUserFile( event: any, type: string ) {
    let btns = document.querySelectorAll('.toDisable');
    btns.forEach( elem => {
      elem.setAttribute('disabled', '');
      setTimeout(() => { elem.removeAttribute('disabled') }, 800 );
    });
    this._userService.uploadUserImage( type, event.target.files[0] ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message ); 
        return;
      }
      this.identity = response.data;
      localStorage.setItem('identity', JSON.stringify( response.data ));
      this._websocketService.userOffline( this.identity );
      this._websocketService.userOnline( this.identity );

      this.redirectTo(`/${ this.identity.username }`);
      this._toastrService.success( 'Imagen actualizada correctamente !' );
    });
  }

  changeAvatar( image: string ) {
    let btns = document.querySelectorAll('.toDisable');
    btns.forEach( elem => {
      elem.setAttribute('disabled', '');
      setTimeout(() => { elem.removeAttribute('disabled') }, 800 );
    });
    this._userService.updateProfile({ image }).subscribe(( response: any ) => {
      if( response.message ) return;
      this.identity = response.data;
      localStorage.setItem('identity', JSON.stringify( response.data ));
      this._websocketService.userOffline( this.identity );
      this._websocketService.userOnline( this.identity );

      this.redirectTo(`/${ this.identity.username }`);
      this._toastrService.success( 'Imagen actualizada correctamente !' );
    });
  }

  updateUser() {
    this.formSubmitted = true;
    let button = document.querySelector( '#userSubmitPage' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');

    if( this.userForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
      }, 1500 );
      return;
    }

    this._userService.updateProfile( this.userForm.value ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        setTimeout(() => {
          button?.removeAttribute('disabled');
          button?.classList.remove('wait-submit');
          this.formSubmitted = false;
        }, 1500 );
        return;
      };
      this.identity = response.data;
      localStorage.setItem('identity', JSON.stringify( response.data ));
      this._websocketService.userOffline( this.identity );
      this._websocketService.userOnline( this.identity );

      this._toastrService.success( 'Informacion actualizada correctamente !' );
      this.redirectTo(`/${ this.identity.username }`);

      button?.removeAttribute('disabled');
      button?.classList.remove('wait-submit');
      this.formSubmitted = false;
    });
  }

  redirectTo(uri:string){
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this._router.navigate([uri]));
 }

  campoNoValido( campo: string ): boolean {
      
    if( this.userForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  openFollowList( value: boolean, type: string = '' ) {
    let divMenu = document.querySelector('#follow-list-movil');
    if( value ) {
      this.getFollowList( type );
      this._animateService.menuMovilAnimate( divMenu, 'show' );
    } else {
      this._animateService.menuMovilAnimate( divMenu, 'hide' );
    }
  }

  getFollowList( type: string, page: number = 1 ) {
    this.typeList = type;
    
    if( type === 'seguidores' ) {
      this._userService.myFollowers( page ).subscribe(( response: any ) => {
        if( response.message ) {
          this._toastrService.info( response.message );
          return;
        }
        this.followList = response.data.docs;
        this.followPage = response.data.page;
        this.totalPagesFollow = response.data.totalPages;
        this.totalFollows = response.data.totalDocs;
      });
    } else if ( type === 'seguidos' ) {
      this._userService.myFollowing( page ).subscribe(( response: any ) => {
        if( response.message ) {
          this._toastrService.info( response.message );
          return;
        }
        this.followList = [];
        for ( let item of response.data.docs ) {
          this.followList.push({
            _id: item._id,
            user: item.followed
          });
        }
        this.followPage = response.data.page;
        this.totalPagesFollow = response.data.totalPages;
        this.totalFollows = response.data.totalDocs;
      });
    }
  } 

  changePageFollow( event: any ) {
    if ( event === 'next' ) {

      if( this.followPage + 1 > this.totalPagesFollow ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this.getFollowList( this.typeList, this.followPage + 1 );
    
    } else if ( event === 'back' ) {

      if( this.followPage - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this.getFollowList( this.typeList, this.followPage - 1 );
    
    } else if ( event === this.totalPagesFollow ) {

      this.getFollowList( this.typeList, this.totalPagesFollow );
      
    }
  }

  myNotificationsUnreadCount( id: string ): void {
    this._notificationService.myNotificationsUnreadCount( id ).subscribe(( response: any ) => {
      if ( response.message ) {
        this.notificationsCounter = 0;
        return;
      }
      this.notificationsCounter = response.data;
    });
  }

  openSidebar(): void {
    this.openSidebarAction.emit( true );
  }

  getNotificationsChatsCounter(): void {
    this._userService.getNotificationCounterChats().subscribe(( response: any ) => {
      if ( response.message ) {
        this.chatsCounter = 0;
        return;
      }
      this.chatsCounter = response.data;
    });
  }

  goTo( url: string ): void {
    window.open( url, '_blank');
  }
}
