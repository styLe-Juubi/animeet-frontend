import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InboxService } from 'src/app/services/inbox.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
const url = environment.wsUrl;

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  @ViewChild('searchConversation') searchConversation!: ElementRef;
  
  public identity!: any;
  public url = url;
  public chat!: any;
  public showMessages: boolean = false;
  public chats!: any;
  public page: number = 1;
  public order: number = -1;
  public totalPages: any;

  public modelChanged: Subject<string> = new Subject<string>();
  public subscription!: Subscription;
  public debounceTime: number = 800;

  constructor(
    private readonly _inboxService: InboxService,
    private readonly _toastrService: ToastrService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _titleService: Title,
  ) { 
    this._titleService.setTitle(`Caja de Mensajes — Animeet`);
  }

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
      this.getMyChats( this.page, 10, this.order );
    });

    this.subscription = this.modelChanged.pipe(
      debounceTime(this.debounceTime),
    ).subscribe(( value ) => {
        this.getByEmmiterOrReceiverUsername( value );
    });
  }

  getMyChats( page: number, limit: number, order: number ): void {
    this._inboxService.myChats( page, limit, order ).subscribe(( response: any ) => {
      if ( response.message ) {
        this._toastrService.info( response.message );
        return;
      }
      this.chats = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    })
  }

  changePage( event: any ) {
    if ( event === 'next' ) {

      if( this.page + 1 > this.totalPages ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this._router.navigate(['/mensajes'], { queryParams: { pagina: this.page + 1, orden: this.order }});
    
    } else if ( event === 'back' ) {

      if( this.page - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this._router.navigate(['/mensajes'], { queryParams: { pagina: this.page - 1, orden: this.order }});
    
    } else if ( event === this.totalPages ) {

      this._router.navigate(['/mensajes'], { queryParams: { pagina: this.totalPages, orden: this.order }});
      
    }

    this.searchConversation.nativeElement.value = "";
  } 

  goProfile( emmiter: any, receiver: any ): void {
    ( emmiter._id === this.identity._id ) && this._router.navigate([`/${ receiver.username }`]);
    ( emmiter._id !== this.identity._id ) && this._router.navigate([`/${ emmiter.username }`]);
  }

  selectChat( chat: any ): void {
    this.chat = chat;
    this.showMessages = false;
    setTimeout(() => {
      this.showMessages = true;
    }, 50 );
  }

  readNotify( chat: any ) {
    if( this.identity !== chat.lastUser ) {
      this._userService.redNotifyChat( chat._id ).subscribe(( response: any ) => {
        if( response.message ) return;
        this.chat.notify = false;
      });
    }
  }

  searchTypping( event: any ): void {
    this.modelChanged.next( event.target.value.trim() );
  }

  getByEmmiterOrReceiverUsername( username: string ): void {
    if ( username.trim() !== '' ) {
      this._userService.getByEmmiterOrReceiverUsername( username ).subscribe(( response: any ) => {
        if ( response.message ) {
          this._toastrService.info( response.message );
          return;
        }
  
        this.chats = response.data;
      });
    } else {
      this.getMyChats( this.page = 1, 10, -1 );
    }
  }

}
