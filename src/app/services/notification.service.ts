import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  myNotifications( page: number = 1, limit: number = 10, order: number = -1 ): Observable<any> {
    return this._http.get(`${ url }/notification/my-notifications?page=${ page }&limit=${ limit }&order=${ order }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  readNotification( id: string ): Observable<any> {
    return this._http.get(`${ url }/notification/read-notification/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  myNotificationsUnreadCount( id: string ): Observable<any> {
    return this._http.get(`${ url }/notification/my-notifications/unread`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }
}
