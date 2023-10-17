import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-commentlist',
  templateUrl: './commentlist.component.html',
  styleUrls: ['./commentlist.component.scss']
})
export class CommentlistComponent implements OnChanges, OnDestroy {
  
  public url = wsUrl;
  @Input() type: any;
  @Input() anime: any;
  @Input() episode: any;
  @Input() publication: any;
  @Input() chat: any;
  @Input() inbox!: boolean;
  public comments: any = [];
  public pageComments: number = 1;
  public totalComments: any;
  public orderComments: number = -1;
  public allComments = false;
  public commentsSubscribe: Subscription[] = [];

  public formSubmitted = false;
  public commentForm = this._fb.group({
    content: [ null, [ Validators.maxLength(5000) ] ],
    file: [null],
  });
  public filePreview: any;

  @ViewChild('commentList', {static: false}) public commentList: any;
  @ViewChild('chatWindow', {static: false}) public chatWindow: any;
  public commentScroll = false;
  public user: any;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _toastrService: ToastrService,
    private readonly _commentService: CommentService,
    private readonly _websocketService: WebsocketService,
    private readonly _commonService: CommonService,
  ) { }

  ngOnChanges(): void {
    if( this._authService.getToken() && this._authService.getIdentity() ) {
      this.user = this._authService.getIdentity();
    };
    switch (true) {
      case this.type === 'anime':
        this.getComments( this.type, this.anime._id, this.pageComments, this.orderComments );
        let commentsAnime = this._websocketService.listenComments( this.type, this.anime._id ).subscribe(( response: any ) => {
          if( response && response.action === 'create' ) {
            if ( this.comments && this.comments.length > 0 ) {
              this.totalComments += 1;
              this.comments.unshift( response.data );
            } else {
              this.comments = [response.data];
              this.allComments = true;
              this.totalComments = 1;
            }
          }

          if( response && response.action === 'delete' ) {
            this.totalComments -= 1;
            this.comments = this.comments.filter(( comment: any ) => comment._id !== response.data._id );

            if( this.comments.length === 0 && this.totalComments > 0 ) this.loadMoreComments( 1 );
            if( this.comments.length === 0 && this.totalComments < 1 ) this.comments = null;

            if( this.comments && this.comments.length === this.totalComments ) {
              this.allComments = true;
            } else {
              this.allComments = false;
            }
          }
        });
        this.commentsSubscribe.push( commentsAnime );
        break;

      case this.type === 'episode':
        this.getComments( this.type, this.episode._id, this.pageComments, this.orderComments );
        let commentsEpisode = this._websocketService.listenComments( this.type, this.episode._id ).subscribe(( response: any ) => {
          if( response && response.action === 'create' ) {
            if ( this.comments && this.comments.length > 0 ) {
              this.totalComments += 1;
              this.comments.unshift( response.data );
            } else {
              this.comments = [response.data];
              this.allComments = true;
              this.totalComments = 1;
            }
          }

          if( response && response.action === 'delete' ) {
            this.totalComments -= 1;
            this.comments = this.comments.filter(( comment: any ) => comment._id !== response.data._id );

            if( this.comments.length === 0 && this.totalComments > 0 ) this.loadMoreComments( 1 );
            if( this.comments.length === 0 && this.totalComments < 1 ) this.comments = null;

            if( this.comments && this.comments.length === this.totalComments ) {
              this.allComments = true;
            } else {
              this.allComments = false;
            }
          }
        });
        this.commentsSubscribe.push( commentsEpisode );
        break;

      case this.type === 'publication':
        this.getComments( this.type, this.publication._id, this.pageComments, this.orderComments );
        let commentsPublication = this._websocketService.listenComments( this.type, this.publication._id ).subscribe(( response: any ) => {

          if( response && response.action === 'create' ) {
            if ( this.comments && this.comments.length > 0 ) {
              this.totalComments += 1;
              this.comments.unshift( response.data );
            } else {
              this.comments = [response.data];
              this.allComments = true;
              this.totalComments = 1;
            }
          }

          if( response && response.action === 'delete' ) {
            this.totalComments -= 1;
            this.comments = this.comments.filter(( comment: any ) => comment._id !== response.data._id );

            if( this.comments.length === 0 && this.totalComments > 0 ) this.loadMoreComments( 1 );
            if( this.comments.length === 0 && this.totalComments < 1 ) this.comments = null;

            if( this.comments && this.comments.length === this.totalComments ) {
              this.allComments = true;
            } else {
              this.allComments = false;
            }
          }
        });
        this.commentsSubscribe.push( commentsPublication );
        break;

      case this.type === 'chat':
        this.getComments( this.type, this.chat._id, this.pageComments, this.orderComments );
        let commentsChat = this._websocketService.listenComments( this.type, this.chat._id ).subscribe(( response: any ) => {
          if( response && response.action === 'create' ) {
            this.chat = response.data.chat;
            if ( this.comments && this.comments.length > 0 ) {
              this.totalComments += 1;
              this.comments.push( response.data );
            } else {
              this.comments = [response.data];
              this.allComments = true;
              this.totalComments = 1;
            }
          }

          if( response && response.action === 'delete' ) {
            this.totalComments -= 1;
            this.comments = this.comments.filter(( comment: any ) => comment._id !== response.data._id );

            if( this.comments.length === 0 && this.totalComments > 0 ) this.loadMoreComments( 1 );
            if( this.comments.length === 0 && this.totalComments < 1 ) this.comments = null;

            if( this.comments && this.comments.length === this.totalComments ) {
              this.allComments = true;
            } else {
              this.allComments = false;
            }
          }
          
          this.commentScroll = true;
        });
        this.commentsSubscribe.push( commentsChat );
        break;
    
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.commentsSubscribe.forEach((s) => s.unsubscribe());
    this._commonService.changeImage('default data');
  }

  getComments( type: string, id: string, page: number = 1, order: number = 1) {
    this._commentService.getComments( type, id, page, order ).subscribe(( response: any ) => {
      if( response.message ) {
        this.comments = null;
        return;
      }
      if ( this.type && this.type === 'chat' ) {
        for ( let comment of response.data.docs ) {
          this.comments.unshift( comment );
        }
        this.commentScroll = true;
      } else {
        this.comments = response.data.docs;
      }
      this.pageComments = response.data.page;
      this.totalComments = response.data.totalDocs;

      if( this.comments.length === this.totalComments ) {
        this.allComments = true;
      } else {
        this.allComments = false;
      }
    });
  }


  loadMoreComments( page: number = 0 ) {
    if( page === 0 ) {
      this.pageComments += 1;
    } else {
      this.pageComments = page;
    }
    
    switch (true) {
      case this.type === 'anime':
        this._commentService.getComments( 'anime', this.anime._id, this.pageComments, this.orderComments  ).subscribe(( response: any ) => {
          if( response.message ) return;
          for ( let comment of response.data.docs ) {
            this.comments.push( comment );
            if( this.comments.length === this.totalComments ) this.allComments = true;
          }
          this.pageComments = response.data.page;
          this.commentScroll = true;
        });
        break;

      case this.type === 'episode':
        this._commentService.getComments( 'episode', this.episode._id, this.pageComments, this.orderComments  ).subscribe(( response: any ) => {
          if( response.message ) return;
          for ( let comment of response.data.docs ) {
            this.comments.push( comment );
            if( this.comments.length === this.totalComments ) this.allComments = true;
          }
          this.pageComments = response.data.page;
          this.commentScroll = true;
        });
        break;

      case this.type === 'publication':
        this._commentService.getComments( 'publication', this.publication._id, this.pageComments, this.orderComments  ).subscribe(( response: any ) => {
          if( response.message ) return;
          for ( let comment of response.data.docs ) {
            this.comments.push( comment );
            if( this.comments.length === this.totalComments ) this.allComments = true;
          }
          this.pageComments = response.data.page;
          this.commentScroll = false;
        });
        break;

      case this.type === 'chat':
        this.commentScroll = false;
        this._commentService.getComments( 'chat', this.chat._id, this.pageComments, this.orderComments  ).subscribe(( response: any ) => {
          if( response.message ) return;
          for ( let comment of response.data.docs ) {
            this.comments.unshift( comment );
            if( this.comments.length === this.totalComments ) this.allComments = true;
          }
          this.pageComments = response.data.page;
        });
        break;
    
      default:
        break;
    }
    
  }

  setNoScroll() {
    this.commentScroll = false;
  }

  createComment() {
    this.formSubmitted = true;
    let button = document.querySelector( '#commentSubmit' );
    let buttonChat = document.querySelector( '#commentSubmit-chat' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');
    buttonChat?.setAttribute('disabled', '');
    buttonChat?.classList.add('wait-submit');

    if(( this.commentForm.controls['content'].value === '' || this.commentForm.controls['content'].value === null )
        && 
      ( this.commentForm.controls['file'].value === '' || this.commentForm.controls['file'].value === null )) {
      this.commentForm.controls['content'].setErrors({'incorrect': true});
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonChat?.removeAttribute('disabled');
        buttonChat?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }
    let newComment = {};
    switch (true) {
      case this.type === 'anime':
        newComment = {
          type: this.type,
          content: this.commentForm.controls['content'].value,
          anime: this.anime._id,
          file: this.commentForm.controls['file'].value
        }
        break;

      case this.type === 'episode':
        newComment = {
          type: this.type,
          content: this.commentForm.controls['content'].value,
          episode: this.episode._id,
          file: this.commentForm.controls['file'].value
        }
        break;

      case this.type === 'publication':
        newComment = {
          type: this.type,
          content: this.commentForm.controls['content'].value,
          publication: this.publication._id,
          file: this.commentForm.controls['file'].value
        }
        break;

      case this.type === 'chat':
        newComment = {
          type: this.type,
          content: this.commentForm.controls['content'].value,
          chat: this.chat._id,
          file: this.commentForm.controls['file'].value
        }
        break;
    
      default:
        break;
    }
    this._commentService.createComment( newComment ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
      }
      
      this.commentForm.reset();
      this.commentForm.controls['content'].setErrors(null);
      this.removePreview();
      if ( this.chat && this.chat.lastUser !== this.user._id ){
        this.readNotify( this.chat );
      } 

      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonChat?.removeAttribute('disabled');
        buttonChat?.classList.remove('wait-submit');
      }, 2000 );
    })

  }
  
  readNotify( chat: any ) {
    this._userService.redNotifyChat( chat._id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.chat.notify = false;
    });
  }

  uploadFile() {
    let upload: any;

    if( this.type && this.type === 'anime' ) upload = document.querySelector(`#upload-file-${ this.anime._id }`);
    if( this.type && this.type === 'episode' ) upload = document.querySelector(`#upload-file-${ this.episode._id }`);
    if( this.type && this.type === 'publication' ) upload = document.querySelector(`#upload-file-${ this.publication._id }`);
    if( this.type && this.type === 'chat' ) upload = document.querySelector(`#upload-file-${ this.chat._id }`);
    
    upload?.click();
  }

  uploadFileMovil() {
    let upload: any;
    if( this.type && this.type === 'chat' ) upload = document.querySelector(`#upload-file-movil-${ this.chat._id }`);
    upload?.click();
  }

  setImage( event: any ) {
    this.commentForm.controls['file'].setValue(event.target.files[0]);
  }

  deleteComment( id: string ) {
    this._commentService.deleteComment( id ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.warning( response.message );
        return;
      }
    }, ( err ) => this._toastrService.warning( err.error.error.message ));
  }

  ngAfterViewChecked() {        
    if( this.commentScroll ) {
      this.scrollToBottom();  
    }
  } 

  scrollToBottom(): void {
    try {
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  campoNoValido( campo: string ): boolean {
      
    if( this.commentForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

  openImage( filename: string ) {
    // let modal = document.querySelector('#modal-comment-image');
    // let image = document.querySelector('#comment-image');

    // modal?.classList.add('show-modal');
    // image?.setAttribute('src', `${ this.url }/comment/get/image/${ filename }`);
    // image?.setAttribute('alt', filename );
    this._commonService.changeImage( `comment/get/image/${ filename }` );
  }

  readURL(event: any ): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.filePreview = reader.result;
        reader.readAsDataURL(file);

        let imagePrev: any;
        if( this.type && this.type === 'anime' ) imagePrev = document.querySelector(`#image-preview-${ this.anime._id }`);
        if( this.type && this.type === 'episode' ) imagePrev = document.querySelector(`#image-preview-${ this.episode._id }`);
        if( this.type && this.type === 'publication' ) imagePrev = document.querySelector(`#image-preview-${ this.publication._id }`);
        if( this.type && this.type === 'chat' ) imagePrev = document.querySelector(`#image-preview-${ this.chat._id }`);

        imagePrev?.classList.add('show-preview');
    }
  }

  removePreview() {
    this.filePreview = null;
    let imagePrev: any;
    if( this.type && this.type === 'anime' ) imagePrev = document.querySelector(`#image-preview-${ this.anime._id }`);
    if( this.type && this.type === 'episode' ) imagePrev = document.querySelector(`#image-preview-${ this.episode._id }`);
    if( this.type && this.type === 'publication' ) imagePrev = document.querySelector(`#image-preview-${ this.publication._id }`);
    if( this.type && this.type === 'chat' ) imagePrev = document.querySelector(`#image-preview-${ this.chat._id }`);
    imagePrev?.classList.remove('show-preview');

    this.commentForm.controls['file'].setValue( null );
  }

}
