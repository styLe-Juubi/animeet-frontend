import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnimeService } from 'src/app/services/anime.service';
import { EpisodeService } from 'src/app/services/episode.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public url = wsUrl;
  public sidebar: boolean = false;
  public access_token: string = '';
  @Input() public identity: any;
  @Input() public randomAnimes: any;
  public latestEpisodes: any;
  public latestAnimes: any;

  constructor(
    private readonly _animeService: AnimeService,
    private readonly _episodeService: EpisodeService,
    private readonly _titleService: Title,
  ) { 
    this._titleService.setTitle('Bienvenidx a tu sitio anime — Animeet');
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.getLastNews();
    this.getLastEpisodes();
    this.getLatestAnimes();
  }

  getLastNews() {
    this._animeService.getAnimes( undefined, undefined, 3 ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.randomAnimes = response.data.docs;
    });
  }

  getLastEpisodes() {
    this._episodeService.getEpisodes( undefined, 14 ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.latestEpisodes = response.data.docs;
    });
  }

  getLatestAnimes() {
    this._animeService.getAnimes( undefined, undefined, 14 ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.latestAnimes = response.data.docs;
    })
  }

}
