import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  myProfile(): Observable<any> {
    return this._http.get(`${ url }/user/my/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    })
  }

  uploadUserImage( type: string, file: File ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file );
    return this._http.patch(`${ url }/user/upload/${ type }`, formData, {
      headers: {
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  updateProfile( arr: any ): Observable<any> {
    return this._http.patch(`${ url }/user/${ this._authService.getIdentity()._id }`, arr, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findByUsername( username: string ): Observable<any> {
    return this._http.get(`${ url }/user/profile/${ username }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findFiveSuggestions(): Observable<any> {
    return this._http.get(`${ url }/user/suggestions/five`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findRelationalUsers( 
    search: string = 'all',
    page: number = 1, 
    limit: number = 15,
    order: number = -1,
  ):Observable<any> {
    return this._http.get(`${ url }/user/relational/users?search=${ search }&page=${ page }&limit=${ limit }&order=${ order }`);
  }

  findUserLists( id: string, type: string, page: number = 1 ): Observable<any> {
    return this._http.get(`${ url }/list/by-user/${ type }/${ id }?page=${ page }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  topFiveUsers(): Observable<any> {
    return this._http.get(`${ url }/user/top/five`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deleteFromUserList( id: string ): Observable<any> {
    return this._http.delete(`${ url }/list/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findUserPublications( id: string, page: number = 1, order: number = -1, type: string = 'todos' ): Observable<any> {
    return this._http.get(`${ url }/publication/by-user/${ id }?page=${ page }&order=${ order }&type=${ type }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findUserFeed( page: number = 1, order: number = -1, type: string = 'todos' ): Observable<any> {
    return this._http.get(`${ url }/publication/home/my-feed?page=${ page }&order=${ order }&type=${ type }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  deletePublication( id: string ): Observable<any> {
    return this._http.delete(`${ url }/publication/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  createPublication( publication: any ): Observable<any> {
    const formData = new FormData();
    if( publication.file ) formData.append('file', publication.file);
    if( publication.content ) formData.append('content', publication.content );
    if( publication.type ) formData.append('type', publication.type );
    if( publication.type === 'review' ) formData.append('anime', publication.anime );
    
    return this._http.post(`${ url }/publication`, formData, {
      headers: {
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    })
  }

  getPublication( id: string ): Observable<any> {
    return this._http.get(`${ url }/publication/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  getUserListCounters( id: string ): Observable<any> {
    return this._http.get(`${ url }/list/list-counters/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  getUserPublicationCounters( id: string ): Observable<any> {
    return this._http.get(`${ url }/publication/publication-counters/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  getUserFollowCounters( id: string ): Observable<any> {
    return this._http.get(`${ url }/follow/follow-counters/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  followUser( id: string ): Observable<any> {
    return this._http.post(`${ url }/follow/${ id }`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  unfollowUser( id: string ): Observable<any> {
    return this._http.delete(`${ url }/follow/unfollow/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  alreadyFollow( id: string ): Observable<any> {
    return this._http.get(`${ url }/follow/already-follow/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  myFollowers( page: number = 1 ): Observable<any> {
    return this._http.get(`${ url }/follow/my-followers?page=${ page }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  myFollowing( page: number = 1 ): Observable<any> {
    return this._http.get(`${ url }/follow/my-following?page=${ page }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  createChat( id: string ): Observable<any> {
    return this._http.post(`${ url }/chat/`, { receiver: id }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  getMyChats(): Observable<any> {
    return this._http.get(`${ url }/chat/inbox/my-chats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  findChat( id: string ): Observable<any> {
    return this._http.get(`${ url }/chat/find-by/emmiter-receiver/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  getByEmmiterOrReceiverUsername( username: string ): Observable<any> {
    return this._http.get(`${ url }/chat/find-by/emmiter-receiver-username/${ username }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    }).pipe(
      map(( response: any ) => {
        if ( response.message ) return response;

        response.data.map(( chat: any ) => {
          chat.emmiter = chat.emmiter[0];
          chat.receiver = chat.receiver[0];
          chat.lastComment = chat.lastComment[0];
        });
        return response;
      })
    );
  }

  getNotificationCounterChats(): Observable<any> {
    return this._http.get(`${ url }/chat/counter/notification-chats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  redNotifyChat( id: string ): Observable<any> {
    return this._http.patch(`${ url }/chat/${ id }`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

}
