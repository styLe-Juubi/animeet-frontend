import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class AllianceService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
  ) { }

  getAlliances( page: number = 1, limit: number = 10, order: number = -1, name: string = '' ):Observable<any> {
    return this._http.get(`${ url }/alliance?page=${ page }&limit=${ limit }&order=${ order }&name=${ name }`);
  }

  create( alliance: any ):Observable<any> {
    const formData = new FormData();
    formData.append( 'image', alliance.image );
    formData.append( 'coverImage', alliance.coverImage );
    formData.append( 'name', alliance.name );
    formData.append( 'description', alliance.description );
    formData.append( 'url', alliance.url );

    return this._http.post(`${ url }/alliance`, formData, {
      headers: {
        'Authorization': `Bearer ${ this._authService.getToken() }`
      }
    });
  }
}