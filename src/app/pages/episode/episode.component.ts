import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimeService } from 'src/app/services/anime.service';
import { EpisodeService } from 'src/app/services/episode.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss']
})
export class EpisodeComponent implements OnInit {

  public url = wsUrl;
  public animeName: any;
  public episodeNumber: any;
  public episode: any;
  public animes: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
    private readonly _episodeService: EpisodeService,
    private readonly _animeService: AnimeService,
    private readonly _titleService: Title,
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe( params => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.animeName = params['anime'];
      this.episodeNumber = params['episodio'];
      
      this.getEpisode( this.animeName, this.episodeNumber );
    });
  }

  getEpisode( name: string, number: number ) {
    const nameWithSpaces = name.split('-').join(' ');
    const nameWithLine = nameWithSpaces.split('+').join('-');
    const nameWithSlash = nameWithLine.split('Slashy').join('/');
    this._titleService.setTitle(`Episodio: ${number } ${ nameWithSlash } — Animeet`);

    this._episodeService.getEpisode( name, number ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        this._router.navigate(['/']);
        return;
      }
      
      this.episode = response.data;
      this.episode.video = this.episode.video.filter(( option: any ) => option.server.toLowerCase() !== 'gocdn' );
      this.setFirstOptionVideo( this.episode );
      this.getRelatedAnimes( this.episode.anime.tags );
    });
  }

  setFirstOptionVideo( episode: any ) {
    setTimeout(() => {
      let actionsLi = document.querySelectorAll('.back-next button');
      actionsLi.forEach( elem => {
        elem.setAttribute('disabled', '');
        setTimeout(() => {
          elem.removeAttribute('disabled');
        }, 500 );
      });

      let option = document.querySelector(`#${ episode.video[0].server.split(' ').join('-') }`);
      option?.classList.add('active-option');

      let videoFrame = document.querySelector('#video');
      videoFrame?.setAttribute('src', episode.video[0].url );
    });
  }

  showVideo( video: any ) {
    let optionList = document.querySelectorAll('.option');
    optionList.forEach( elem => {
      if ( elem.id === video.server.split(' ').join('-') ) {
        elem.classList.add('active-option');
      } else {
        elem.classList.remove('active-option');
      }
    });

    let videoFrame = document.querySelector('#video');
    videoFrame?.setAttribute('src', video.url );
  }

  getRelatedAnimes( tags: any ) {
    let tagsString = tags.join(',');
    let firstTag = tags[0];
    let limit = 4;

    this._animeService.getAnimes( 
      undefined,
      undefined,
      limit,
      undefined,
      undefined,
      undefined,
      tagsString
    ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.animes = response.data.docs.filter(( anime: any ) => anime._id !== this.episode.anime._id );
      
      switch (true) {
        case this.animes.length === 0:
          this._animeService.getAnimes( undefined, undefined, 3, undefined, undefined, undefined, firstTag )
            .subscribe(( response: any ) => {
              if( response.message ) return;
              this.animes = response.data.docs.filter(( anime: any ) => anime._id !== this.episode.anime._id );
            });
          return;
      
        case this.animes.length === 1:
          this._animeService.getAnimes( undefined, undefined, 2, undefined, undefined, undefined, firstTag )
            .subscribe(( response: any ) => {
              if( response.message ) return;
              let toAdd = [];
              toAdd = response.data.docs.filter(( anime: any ) => anime._id !== this.episode.anime._id );
              for ( let anime of toAdd ) {
                this.animes.push( anime );
              }
            });
          return;
        
          case this.animes.length === 2:
            this._animeService.getAnimes( undefined, undefined, 1, undefined, undefined, undefined, firstTag )
            .subscribe(( response: any ) => {
              if( response.message ) return;
              let toAdd = [];
              toAdd = response.data.docs.filter(( anime: any ) => anime._id !== this.episode.anime._id );
              for ( let anime of toAdd ) {
                this.animes.push( anime );
              }
            });
            return;

        default:
          return;
      }
    });
  }

  nextBack( action: string, name: string ) {
    
    let number: any;
    if( action === 'back' ) number = parseInt( this.episodeNumber ) - 1;
    if( action === 'next' ) number = parseInt( this.episodeNumber ) + 1;
    
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');

    this._episodeService.getEpisode( nameSend, number ).subscribe(( response: any ) => {
      if( response.message && action === 'back' ) {
        this._toastrService.info('Te encuentras en el primer episodio !');
        return;
      }
      if( response.message && action === 'next' ) {
        this._toastrService.info('Te encuentras en el ultimo episodio !');
        return;
      }

      let videoFrame = document.querySelector('#video');
      videoFrame?.removeAttribute('src');
      this._router.navigate([`/ver`], { queryParams : { anime: nameSend, episodio: number }});
    });
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

  switchLight( action: string ) {
    let switchDiv = document.querySelector('#switch-light');
    let btnSwitch = document.querySelector('#btn-switch-light');
    if( action === 'off' ) {
      switchDiv?.classList.add('show');
      btnSwitch?.classList.add('active-option');
    }
    if( action === 'on' ) {
      switchDiv?.classList.add('hide');
      setTimeout(() => {
        btnSwitch?.classList.remove('active-option');
        switchDiv?.classList.remove('show');
        switchDiv?.classList.remove('hide');
      }, 200 );
    }
  }

}
