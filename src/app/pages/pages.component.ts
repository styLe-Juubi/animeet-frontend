import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnimateService } from '../services/animate.service';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { WebsocketService } from '../services/websocket.service';
import { CommonService } from '../services/common.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public identity: any;
  public url = wsUrl;
  public sidebar: boolean = false;
  public sideUsers: boolean = false;
  public showText: boolean = false;
  public showTextUsers: boolean = false;
  public showSettings: boolean = false;
  public access_token: string = '';
  public randomAnimes: any;
  public latestEpisodes: any;
  public latestAnimes: any;

  public allConnections: number = 0;
  public usersOnline: any;
  public chats: any = [];
  public userChatting: any;
  public actuallyChat: any;
  public showComments = false;

  public formSubmitted: boolean = false;
  public userForm = this._fb.group({
    username: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    surname: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    country: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(30) ]],
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
    description: ['', [ Validators.required, Validators.maxLength(10000) ]],
  });

  public screenWidth: any;  
  public screenHeight: any;

  constructor(
    private readonly _titleService: Title,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _toastrService: ToastrService,
    private readonly _animateService: AnimateService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _websocketService: WebsocketService,
    private readonly _commonService: CommonService,
  ) {
    this._titleService.setTitle('Bienvenidx a tu sitio anime — Animeet');
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(( params: any ) => {
      if ( params && params.code ) {
        this.verifyEmail( params.code );
      }
    });
    this.access_token = this._authService.getToken() || '';
    this.identity = this._authService.getIdentity() || '';
    this.getMyProfile();
    this._commonService.changeData('default data');
    this._commonService.image$.subscribe( res => {
      if( res === 'default data') return;
      this.openImageHandler( 'comment', res );
    });
    this._commonService.imageProfile$.subscribe( res => {
      if( res === 'default data') return;
      this.openImageHandler( 'user', res );
    });
    this._websocketService.listenUsersOnline().subscribe(( response: any ) => {
      this.usersOnline = response;
    });
    this._websocketService.listenAllConnections().subscribe(( response: any ) => {
      this.allConnections = response;
    });
    this._websocketService.listenChats( this.identity._id ).subscribe(( response: any ) => {
      this.chats = this.chats.filter(( chat: any ) => chat._id !== response._id );
      this.chats.unshift( response );
    });

    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;  
  }

  getMyProfile(): void {
    if ( this.identity ) {
      this._userService.myProfile().subscribe(( response: any ) => {
        if ( !response.message ) {
          this.identity = response.data;
          this._websocketService.userOnline( this.identity );
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('identity');
          this._websocketService.userOffline( this.identity );
          this.identity = null;
        }
      });
    }
  }

  @HostListener('window:resize', ['$event']) onResize( event: any ) {  
    this.screenWidth = window.innerWidth;  
    this.screenHeight = window.innerHeight;  
  }  

  openSidebar( sidebar: boolean ) {
    this.sidebar = sidebar;
    let sidebarMenu = document.querySelector('#page-left');

    switch ( true ) {
      case sidebar:
        this._animateService.sidebarAnimate( sidebarMenu, 'show' );
        return;
      
      case !sidebar:
        this._animateService.sidebarAnimate( sidebarMenu, 'hide' );
        return;

      default:
        return;
    }
  }

  openSideUsers( sidebarUsers: boolean ) {
    this.sideUsers = sidebarUsers;
    let sidebarMenu = document.querySelector('#page-right');

    switch ( true ) {
      case sidebarUsers:
        this._animateService.sideUsersAnimate( sidebarMenu, 'show' );
        return;
      
      case !sidebarUsers:
        this._animateService.sideUsersAnimate( sidebarMenu, 'hide' );
        return;

      default:
        return;
    }
  }

  logoutHandler( event: any ) {
    if( event ) {
      this._websocketService.userOffline( this.identity );
      localStorage.removeItem('access_token');
      localStorage.removeItem('identity');
      this.identity = null;
      this.userChatting = null;
      this.actuallyChat = null;
      this.showComments = false;
      this._commonService.changeData('default data');
    }
  }

  openUserListHandler( event: any ) {
    this.openSideUsers( !this.sideUsers );
  }

  closeSidebarHandler( event: any ) {
    if( event ) {
      this.openSidebar( false );
    }
  }

  closeSideUsersHandler( event: any ) {
    if( event ) {
      this.openSideUsers( false );
    }
  }

  openImageHandler( type: string, filename: string ) {
    let modal = document.querySelector('#modal-comment-image');
    let image = document.querySelector('#comment-image');

    modal?.classList.add('show-modal');
    if( type === 'comment' ) image?.setAttribute('src', `${ this.url }/${ filename }`);
    if( type === 'user' ) image?.setAttribute('src', `${ this.url }/user/image/${ filename }`);
    image?.setAttribute('alt', filename );
  }

  closeImage() {
    let div = document.querySelector('#modal-comment-image');
    div?.classList.add('hide-chat');
    setTimeout(() => {
      div?.classList.remove('hide-chat');
      div?.classList.remove('show-modal');
      this.showSettings = false;
    }, 100 );
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    this.closeImage();
    this.closeSettings();
    if ( this.sidebar ) {
      this.openSidebar( false );
    }
    if( this.sideUsers ) {
      this.openSideUsers( false );
    }
    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    this.closeImage();
    this.closeSettings();
    if ( this.sidebar ) {
      this.openSidebar( false );
    }
    if( this.sideUsers ) {
      this.openSideUsers( false );
    }
    
  }

  openSettingsHandler( event: any ) {
    if( event ) {
      this.showSettings = true;
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

  openSidebarHandler( value: boolean ): void {
    this.openSidebar( value );
  }

  /////////////////////////// USER SETTINGS //////////////////////////
  closeSettings() {
    let div = document.querySelector('#modal-settings');
    div?.classList.add('hide-chat');
    setTimeout(() => {
      div?.classList.remove('hide-chat');
      this.showSettings = false;
    }, 100 );
  }

  openTypeFile( type: string ) {
    let upload: any;

    if( type === 'coverImage' ) upload = document.querySelector(`#upload-file-coverImage-pc`);
    if( type === 'image' ) upload = document.querySelector(`#upload-file-image-pc`);
    
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

      this.redirectTo(`/${ this.identity.username }`);
      this._toastrService.success( 'Informacion actualizada correctamente !' );
      
      button?.removeAttribute('disabled');
      button?.classList.remove('wait-submit');
      this.closeSettings();
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

  verifyEmail( code: string ): void {
    this._authService.verifyEmail( code ).subscribe(( response: any ) => {
      if ( response.message === 'El correo ha sido verificado correctamente !') {
        this._toastrService.success( response.message );
        return;
      } else {
        this._toastrService.info( response.message );
        return;
      }
    })
  }

}
