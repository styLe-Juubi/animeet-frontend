import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  constructor(
    private readonly _http: HttpClient,
  ) { }

  getEpisodes( page: number = 1, limit: number = 21, order: number = -1 ): Observable<any> {
    return this._http.get(`${ url }/episode?page=${ page }&limit=${ limit }&order=${ order }`);
  }

  getEpisodesByAnime( animeId: string, page: number = 1, limit: number = 25, order: number = -1 ): Observable<any> {
    return this._http.get(`${ url }/episode/by-anime/${ animeId }?page=${ page }&limit=${ limit }&order=${ order }`);
  }

  getEpisode( name: string, number: number ): Observable<any> {
    return this._http.get(`${ url }/episode/${ name }/number/${ number }`);
  }
}
