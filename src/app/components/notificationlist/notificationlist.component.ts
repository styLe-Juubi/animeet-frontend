import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimateService } from 'src/app/services/animate.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styleUrls: ['./notificationlist.component.scss']
})
export class NotificationlistComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() show: boolean = false;
  @Input() movil: boolean = false;
  @Output() showEvent = new EventEmitter<boolean>();
  @Output() getCounters = new EventEmitter<boolean>();
  @ViewChild('notificationList') notificationList!: ElementRef;

  public url = wsUrl;
  public message!: string;
  public notifications: any = [];
  public page: number = 1;
  public nextPage: boolean = false;

  constructor(
    private readonly _animateService: AnimateService,
    private readonly _notificationService: NotificationService,
    private readonly _router: Router,
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    if ( this.movil ) {
      this.myNotifications();
      this.notificationList.nativeElement.classList.add("notification-list-movil");
    }
  }

  ngOnChanges(): void {
    if ( !this.movil ) {
      if ( this.show && this.notificationList.nativeElement ) {
        this.myNotifications();
        this._animateService.toggleAnimation( this.notificationList.nativeElement, 'show', 'transform', 'scaleY(0)', 'scaleY(1)', 300 );
      }
      if ( !this.show && this.notificationList ) {
        this._animateService.toggleAnimation( this.notificationList.nativeElement, 'hide', 'transform', 'scaleY(0)', 'scaleY(1)', 300 );
        this.ngOnDestroy();
      } 
    } else {
      if ( this.show && this.notificationList ) {
        this.myNotifications();
      }
      if ( !this.show && this.notificationList ) {
        this.ngOnDestroy();
      } 
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.page = 1;
      this.notifications = [];
    }, 300 );
  }

  myNotifications( page: number = this.page ): void { 
    this._notificationService.myNotifications( page ).subscribe(( response: any ) => {
      if ( response.message ) {
        this.message = response.message;
        return;
      };
      
      response.data.docs.map(( item: any ) => {
        this.notifications.push( item );
      })
      
      if ( response.data.nextPage ) {
        this.nextPage = true;
      } else {
        this.nextPage = false;
      }
    });
  }

  readNotification( id: string ): void {
    this._notificationService.readNotification( id ).subscribe(( response: any ) => {
      if ( response.message ) return;
      
      this.notifications.map(( item: any ) => {
        if ( item._id === response.data._id ) {
          item.read = true;
        }
      });
      this.getCounters.emit( true );
    });
  }
  
  loadMore(): void {
    this.page = this.page + 1;
    this.myNotifications();
  }

  goTo( notification: any ): void {
    if ( notification.type === 'follow' ) {
      this._router.navigate([`/${ notification.emmiter.username }`]);
    }
    if ( notification.type === 'reaction' || notification.type === 'comment' ) {
      this._router.navigate([`/${ notification.receiver.username }/publicacion/${ notification.publication._id }`]);
    }

    if ( this.movil ) {
      this.showEvent.emit( false );
    }
  }

}
