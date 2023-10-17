import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from '../models/interfaces/user.interface';

const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly _http: HttpClient,
  ) { }
  
  getToken() {
    return localStorage.getItem('access_token') || '';
  }

  setIdentity( user: any ) {
    localStorage.setItem( 'identity', JSON.stringify( user ));
    return;
  }

  getIdentity() {
    if( localStorage.getItem('identity') ) {
      const identity = JSON.parse( localStorage.getItem('identity') || '' );
      return identity;
    }
    return null;
  }

  signup( user: IUser  ):Observable<any> {
    return this._http.post(`${ url }/auth/signup`, user )
    .pipe( 
      tap( ( response: any ) => {
        if( !response.message ) {
          localStorage.setItem('access_token', response.data.access_token );
        }
      })
    );
  }

  signin( user: any  ):Observable<any> {
    return this._http.post(`${ url }/auth/signin`, user )
    .pipe( 
      tap( ( response: any ) => {
        if( !response.message ) {
          localStorage.setItem('access_token', response.data.access_token );
        }
      })
    );
  }

  recover( email: string  ):Observable<any> {
    return this._http.post(`${ url }/auth/user/recover`, email );
  }

  newPassword( data: any  ):Observable<any> {
    return this._http.post(`${ url }/auth/user/new-password`, data )
    .pipe( 
      tap( ( response: any ) => {
        if( !response.message ) {
          localStorage.setItem('access_token', response.data.access_token );
        }
      })
    );
  }

  verifyEmail( uuid: string  ):Observable<any> {
    return this._http.get(`${ url }/auth/user/email-verification/${ uuid }`);
  }
}
