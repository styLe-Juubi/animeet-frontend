import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  getCountReactions( type: string, id: string, page: number = 1, order: number = -1 ): Observable<any> {
    return this._http.get(`${ url }/comment/${ type }/${ id }?page=${ page }&order=${ order }`);
  }

  createReaction( reaction: any ): Observable<any> {
    return this._http.post(`${ url }/reaction`, reaction, {
      headers: {
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    })
  }

  getReactionsIn( type: string, id: string ): Observable<any> {
    return this._http.get(`${ url }/reaction/${ type }/${ id }`, {
      headers: {
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    })
  }

  deleteComment( id: string ): Observable<any> {
    return this._http.delete(`${ url }/comment/${ id }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    })
  }
}
