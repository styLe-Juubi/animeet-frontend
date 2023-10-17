import { Component, Input, OnChanges, OnDestroy, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit, OnChanges, OnDestroy {

  @Input() identity: any;
  public componentDestroyed$ = new Subject();
  public url = wsUrl;
  public chats: any = [];
  public userChatting: any;
  public actuallyChat: any;
  public showComments = false;

  constructor(
    private readonly _websocketService: WebsocketService,
    private readonly _commonService: CommonService,
    private readonly _toastrService: ToastrService,
    private readonly _userService: UserService,
  ) { }

  ngOnInit(): void {
    this._commonService.data$.pipe( takeUntil( this.componentDestroyed$ )).subscribe( res => {
      this.sendMessage( res );
    });
    this.chats = [];
    this.getMyChats();

    this._websocketService.listenChats( this.identity._id ).subscribe(( response: any ) => {
      this.chats = this.chats.filter(( chat: any ) => chat._id !== response._id );
      this.chats.unshift( response );
    });
  }

  ngOnChanges(): void {
    
  }

  ngOnDestroy(): void {
    this.chats = [];
    this.componentDestroyed$.next(1);
  }

  sendMessage( id: string ) {
    if( id !== 'default data' ) {
      this._userService.createChat( id ).subscribe(( response: any ) => {
        if( response.message ) {
          this._userService.findChat( id ).subscribe(( res: any ) => {
            if( res.message ) return;
            this.chats = this.chats.filter(( chat: any ) => chat._id !== res.data._id );
            this.chats.unshift( res.data );
            this.openChat( res.data );
          });
          return;
        }
        this.chats.unshift( response.data );
        this.openChat( response.data );
      });
    }
  }

  getMyChats() {
    if( this.identity && this.identity !== null && this.identity !== undefined && this.identity !== '' ) {
      this._userService.getMyChats().subscribe(( response: any ) => {
        if( response.message ) {
          this.chats = [];
          return;
        }
        this.chats = response.data.docs;
      });
    } else {
      return;
    }
  }

  openChat( chat: any ) {
    let windowChat = document.querySelector('#chat-window');
    let windowChatMovil = document.querySelector('#chat-window-movil');
    this.actuallyChat = chat;
    this.showComments = false;
    setTimeout(() => {
      if (( this.identity._id !== chat.emmiter._id ) && ( this.userChatting !== chat.emmiter )) {
        this.userChatting = chat.emmiter;
        this.showComments = true;
      } else if (( this.identity._id !== chat.emmiter._id ) && ( this.userChatting === chat.emmiter )) {
        windowChat?.classList.add('hide-chat');
        windowChatMovil?.classList.add('hide-chat');
        setTimeout(() => {
          this.userChatting = null;
          this.showComments = false;
        }, 250 );
      }
  
      if (( this.identity._id !== chat.receiver._id ) && ( this.userChatting !== chat.receiver )) {
        this.userChatting = chat.receiver;
        this.showComments = true;
      } else if (( this.identity._id !== chat.receiver._id ) && ( this.userChatting === chat.receiver )){
        windowChat?.classList.add('hide-chat');
        windowChatMovil?.classList.add('hide-chat');
        setTimeout(() => {
          this.userChatting = null;
          this.showComments = false;
        }, 250 );
      }
    }, 100 );
  }

  hideChat() {
    let windowChat = document.querySelector('#chat-window');
    let windowChatMovil = document.querySelector('#chat-window-movil');
    windowChat?.classList.add('hide-chat');
    windowChatMovil?.classList.add('hide-chat');
      setTimeout(() => {
        this.userChatting = null;
        this.showComments = false;
      }, 250 );
  }

  readNotify( chat: any ) {
    if( this.identity !== chat.lastUser ) {
      this._userService.redNotifyChat( chat._id ).subscribe(( response: any ) => {
        if( response.message ) return;
        this.actuallyChat.notify = false;
      });
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    
    this.hideChat();
    
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    
    this.hideChat();
    
  }

}
