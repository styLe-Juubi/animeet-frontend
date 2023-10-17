import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  getComments( type: string, id: string, page: number = 1, order: number = -1 ): Observable<any> {
    return this._http.get(`${ url }/comment/${ type }/${ id }?page=${ page }&order=${ order }`);
  }

  createComment( comment: any ): Observable<any> {
    const formData = new FormData();
    formData.append('file', comment.file);
    formData.append('content', comment.content );
    formData.append('type', comment.type );
    if( comment.type === 'anime' ) formData.append('anime', comment.anime );
    if( comment.type === 'episode' ) formData.append('episode', comment.episode );
    if( comment.type === 'publication' ) formData.append('publication', comment.publication );
    if( comment.type === 'chat' ) formData.append('chat', comment.chat );
    
    return this._http.post(`${ url }/comment`, formData, {
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
