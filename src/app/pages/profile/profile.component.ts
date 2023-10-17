import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public url = wsUrl;
  public username: string = '';
  public user: any;
  public userLogged: any;

  public following: boolean = false;
  public followersCount: any;
  public followingCount: any;
  public publicationCount: any;
  public reviewCount: any;
  public loveCount: any;
  public waitCount: any;
  public watchCount: any;

  public loveList: any;
  public waitList: any;
  public watchList: any;

  public totalPagesList: any;
  public pageList: number = 1;
  public type: string = 'todos';

  public followList: any = [];
  public typeList: string = '';
  public followPage: number = 1;
  public totalFollows: any;
  public totalPagesFollow: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _commonService: CommonService,
    private readonly _titleService: Title,
  ) { }

  ngOnInit(): void {
    this.userLogged = this._authService.getIdentity();
    this._route.params.subscribe( params => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      
      this.username = params['username'];
      this._titleService.setTitle(`${ this.username } — Animeet`);
      this.getUser( this.username );
    });
  }

  getUser( username: string ) {
    this._userService.findByUsername( username ).subscribe(( response: any ) => {
      if ( response.message ) {
        this._toastrService.info( response.message );
        this._router.navigate(['/']);
        return;
      }

      this.user = response.data;
      this.getUserCounters( this.user._id );
      this.alreadyFollow( this.user._id );
      this.getUserLists( this.user._id, 'love' );
      this.showList('btn-love', 'love-list', 'love');
    }, ( err ) => {
      if ( err.error.error.statusCode === 401 ) {
        this._toastrService.info('Tu sesión ha caducado, favor de iniciar sesión !');
        localStorage.removeItem('access_token');
        localStorage.removeItem('identity');
        this._router.navigate(['/auth/login']);
      }
    });
  }

  getUserLists( id: string, type: string, page: number = 1 ) {
    if( type === 'love' ) {
      this._userService.findUserLists( id, type, page ).subscribe(( response: any ) => {
        if( response.message ) {
          this.loveList = null;
          return;
        };
        this.loveList = response.data.docs;
        this.totalPagesList = response.data.totalPages;
        this.pageList = response.data.page;
      });
    }
    if( type === 'wait' ) {
      this._userService.findUserLists( id, type, page ).subscribe(( response: any ) => {
       if( response.message ) {
          this.waitList = null;
          return;
        };
        this.waitList = response.data.docs;
        this.totalPagesList = response.data.totalPages;
        this.pageList = response.data.page;
      });
    }
    if( type === 'watch' ) {
      this._userService.findUserLists( id, type, page ).subscribe(( response: any ) => {
       if( response.message ) {
          this.watchList = null;
          return;
        };
        this.watchList = response.data.docs;
        this.totalPagesList = response.data.totalPages;
        this.pageList = response.data.page;
      });
    }
  }

  getUserCounters( id: string ) {
    this._userService.getUserFollowCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.followersCount = response.data.followers;
      this.followingCount = response.data.following;
    });

    this._userService.getUserPublicationCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.publicationCount = response.data.publications;
      this.reviewCount = response.data.reviews;
    });
    this._userService.getUserListCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.loveCount = response.data.love;
      this.waitCount = response.data.wait;
      this.watchCount = response.data.watch;
    });
  }

  openFollowList( type: string, page: number = 1 ) {
    if ( this.userLogged._id !== this.user._id ) {
      this._toastrService.info('Actualmente no puedes acceder a esta información del usuario !');
      return;
    }
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

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    let div = document.querySelector('#follow-list-profile');
    div?.classList.add('hide-list');
    setTimeout(() => { 
      this.typeList = '';
      this.followList = [];
      this.followPage = 1;
      this.totalPagesFollow = null;
      this.totalFollows = null;
    }, 150 );

  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    let div = document.querySelector('#follow-list-profile');
    div?.classList.add('hide-list');
    setTimeout(() => { 
      this.typeList = '';
      this.followList = [];
      this.followPage = 1;
      this.totalPagesFollow = null;
      this.totalFollows = null;
    }, 150 );
    
  }

  closeFollowList() {
    let div = document.querySelector('#follow-list-profile');
    div?.classList.add('hide-list');
    setTimeout(() => { 
      this.typeList = '';
      this.followList = [];
      this.followPage = 1;
      this.totalPagesFollow = null;
      this.totalFollows = null;
    }, 150 );
  }

  changePageFollow( event: any ) {
    if ( event === 'next' ) {

      if( this.followPage + 1 > this.totalPagesFollow ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this.openFollowList( this.typeList, this.followPage + 1 );
    
    } else if ( event === 'back' ) {

      if( this.followPage - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this.openFollowList( this.typeList, this.followPage - 1 );
    
    } else if ( event === this.totalPagesFollow ) {

      this.openFollowList( this.typeList, this.totalPagesFollow );
      
    }
  }

  listNextBackPage( action: string, list: string, lastPage: number, optionList: HTMLElement ) {
    if( action === 'back' && this.pageList <= 1 ) {
      this._toastrService.info('Te encuentras en la primer pagina !');
      return;
    } 
    switch (true) {
      case action === 'next' && list === 'love' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;

      case action === 'next' && list === 'wait' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;

      case action === 'next' && list === 'watch' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;

        
      case action === 'last' && list === 'love' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;
  
      case action === 'last' && list === 'wait' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;
  
      case action === 'last' && list === 'watch' && this.pageList >= lastPage :
        this._toastrService.info('Te encuentras en la ultima pagina !');
        return;

      default:
        break;
    }
    if( action === 'back' ) this.pageList = this.pageList - 1;
    if( action === 'next' ) this.pageList = this.pageList + 1;
    if( action === 'last' ) this.pageList = lastPage;

    const y = optionList.getBoundingClientRect().top + window.pageYOffset + -59;
    window.scrollTo({ top: y, behavior: 'smooth' });

    this.getUserLists( this.user._id, list, this.pageList );
  }

  showList( btnId: string, listId: string, type: string ) {
    this.pageList = 1;
    this.getUserLists( this.user._id, type, this.pageList );

    let btns = document.querySelectorAll('ul.option-list li');
    btns.forEach( elem => {
      if( elem.id === btnId ) {
        elem.classList.add('active-list');
      } else {
        elem.classList.remove('active-list');
      }
    });

    let lists = document.querySelectorAll('ul.list');
    lists.forEach( elem => {
      if( elem.id === listId ) {
        elem.classList.add('show-list');
      } else {
        elem.classList.remove('show-list');
      }
    });
  }

  deleteFromList( id: string, type: string ) {
    this._userService.deleteFromUserList( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.getUserLists( this.user._id, type, this.pageList );
      this.getUserCounters( this.user._id );
    })
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

  followUser( id: string ) {
    this._userService.followUser( id ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        return;
      }
      this._toastrService.success(`Siguiendo a ${ this.user.username }`);
      this.following = true;
      this.getUserCounters( this.user._id );
    });
  }

  unfollowUser( id: string ) {
    this._userService.unfollowUser( id ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        return;
      }
      this._toastrService.success(`Ya no sigues a ${ this.user.username }`);
      this.following = false;
      this.getUserCounters( this.user._id );
    });
  }

  alreadyFollow( id: string ) {
    this._userService.alreadyFollow( id ).subscribe(( response: any ) => {
      if ( response.message ) {
        this.following = false;
        return;
      };
      this.following = true;
    });
  }
  ////////////////////////////////// MESSAGES ////////////////////////////////////

  sendMessage( username: string ) {
    this._commonService.changeData( username );
  }

  ////////////////////////////////// PUBLICATIONS /////////////////////////////////

  changeType( type: string, id: string ) {
    let btns = document.querySelectorAll('ul.publication-options li');
    btns.forEach( elem => {
      if( elem.id === id ) {
        elem.classList.add('active-type-option');
      } else {
        elem.classList.remove('active-type-option');
      }
    });
    this.type = type;
  }

  reloadCountersHandler() {
    this.getUserCounters( this.user._id );
  }

  openImage( filename: string ) {
    this._commonService.changeImageProfile( filename );
  }
}
