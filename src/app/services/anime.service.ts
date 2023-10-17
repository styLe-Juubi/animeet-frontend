import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  getAnimes( 
    search: string = '',
    page: number = 1,
    limit: number = 21,
    order: number = -1,
    type: string = '',
    status: string = '',
    tags: string = ''
  ):Observable<any> {
    const format = ( value: string ) => {
      value = ( value === 'all' || !value ) ? '' : value;
      return value;
    }
    
    return this._http.get(`${ url }/anime?page=${ page }&limit=${ limit }&order=${ order }&name=${ search }&type=${ format( type ) }&status=${ format( status ) }&tags=${ format( tags ) }`);
  }

  getAnime( name: string ): Observable<any> {
    return this._http.get(`${ url }/anime/name/${ name }`);
  }

  topFiveAnimes(): Observable<any> {
    return this._http.get(`${ url }/anime/top/five`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  getList( id: string, type: string ): Observable<any> {
    return this._http.get(`${ url }/list/by-anime/${ type }/${ id }`);
  }

  addToList( list: any ): Observable<any> {
    return this._http.post(`${ url }/list`, list, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }

  existAnimeInUserList( type: string, animeId: string ): Observable<any> {
    return this._http.get(`${ url }/list/by-user/exist-in-list/${ type }/${ animeId }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }
}
