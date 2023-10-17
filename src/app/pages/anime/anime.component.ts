import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimeService } from 'src/app/services/anime.service';
import { AuthService } from 'src/app/services/auth.service';
import { EpisodeService } from 'src/app/services/episode.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss']
})
export class AnimeComponent implements OnInit, AfterViewChecked {

  public url = wsUrl;
  public name: any;
  public anime: any;
  public episodes: any;
  public page: number = 1;
  public order: number = -1;

  @ViewChild('episodeList', {static: false}) public episodeList: any;
  public episodeScroll = false;

  public allEpisodes = false;
  public totalEpisodes: any;

  public countLovers: any;
  public loveList: any;
  public waitList: any;
  public watchList: any;

  public animeInLove = false;
  public animeInWait = false;
  public animeInWatch = false;

  public user: boolean = false;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _toastrService: ToastrService,
    private readonly _animeService: AnimeService,
    private readonly _episodeService: EpisodeService,
    private readonly _authService: AuthService,
    private readonly _titleService: Title,
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe( params => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.name = params.name;
      this.getAnime( this.name );
      if( this._authService.getToken() && this._authService.getIdentity() ) this.user = true;
    });

  }

  getAnime( name: string ) {
    const nameWithSpaces = name.split('-').join(' ');
    const nameWithLine = nameWithSpaces.split('+').join('-');
    const nameWithSlash = nameWithLine.split('Slashy').join('/');
    this._titleService.setTitle(`${ nameWithSlash } — Animeet`);

    this._animeService.getAnime( name ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        // this._router.navigate(['/']);
        return;
      }

      this.anime = response.data;
      if( this.anime.tags.length > 5 ) {
        let onlyFiveTags = [];
        for ( let i = 0; i < 7 ; i++ ) {
          if( !this.anime.tags[i] || this.anime.tags[i] === undefined ) break;
          onlyFiveTags.push( this.anime.tags[i] );
        }
        this.anime.tags = onlyFiveTags;
      }

      this.getEpisodes( this.anime._id, this.page, this.order );
      this.getList( this.anime._id, 'love' );
      if( this._authService.getToken() && this._authService.getIdentity ) {
        this.existAnimeInUserList( 'love', this.anime._id );
        this.existAnimeInUserList( 'wait', this.anime._id );
        this.existAnimeInUserList( 'watch', this.anime._id );
      }
    });
  }

  getEpisodes( animeId: string, page: number, order: number ) {
    this._episodeService.getEpisodesByAnime( animeId, page, undefined, order ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.episodes = response.data.docs;
      this.totalEpisodes = response.data.totalDocs;
      if( this.episodes.length === this.totalEpisodes ) this.allEpisodes = true;
    });
  }

  getList( id: string, type: string ) {
    this._animeService.getList( id, type ).subscribe(( response: any ) => {
      if( response.message ) {
        this.loveList = null;
        this.countLovers = 0;
        return;
      }
      this.loveList = response.data.docs;
      this.countLovers = response.data.totalDocs;
    });
  }

  episodesOrder( value: number ) {
    this.episodeScroll = false;
    if( value === -1 && this.order === -1 ) this.order = 1;
    if( value === 1 && this.order === 1 ) this.order = -1;

    let btn = document.querySelector('#episodes-order');
    btn?.setAttribute('disabled', '');
    btn?.classList.add('wait-submit');
    
    this._episodeService.getEpisodesByAnime( 
      this.anime._id, undefined, undefined, this.order
    ).subscribe(( response: any ) => {
      this.episodes = response.data.docs;
      this.page = response.data.page;
      for ( let episode of response.data.docs ) {
        if(( this.order === -1 && ( episode.number === 0 || episode.number === 1 )) || ( this.order === 1 && episode.number === this.totalEpisodes )) {
          this.allEpisodes = true;
        } else {
          this.allEpisodes = false;
        }
      }
    });

    setTimeout(() => {
      btn?.removeAttribute('disabled');
      btn?.classList.remove('wait-submit');
    }, 1000 );
  }

  loadMoreEpisodes() {
    this.page += 1;
    this._episodeService.getEpisodesByAnime( this.anime._id, this.page, undefined, this.order ).subscribe(( response: any ) => {
      if( response.message ) return;
      for ( let episode of response.data.docs ) {
        if(( this.order === -1 && ( episode.number === 0 || episode.number === 1 )) || ( this.order === 1 && episode.number === this.totalEpisodes )) this.allEpisodes = true;
        this.episodes.push( episode );
      }
      this.page = response.data.page;
      this.episodeScroll = true;
    });
  }

  addToList( list: string, animeId: string ) {
    if( !this._authService.getToken() || !this._authService.getIdentity() ) {
      this._toastrService.info('Debes iniciar sesión para poder crear tus listas !');
      return;
    }

    this._animeService.addToList({ anime: animeId, type: list }).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        return;
      } 
      switch ( true ) {
        case response.data.type === 'love':
          this._toastrService.success( 'Agregado exitosamente !', 'Animes Favoritos');
          this.getList( this.anime._id, 'love' );
          this.animeInLove = true;
          return;

        case response.data.type === 'wait':
          this._toastrService.success( 'Agregado exitosamente !', 'Animes en Espera');
          this.getList( this.anime._id, 'love' );
          this.animeInWait = true;
          return;

        case response.data.type === 'watch':
          this._toastrService.success( 'Agregado exitosamente !', 'Animes Vistos');
          this.getList( this.anime._id, 'love' );
          this.animeInWatch = true;
          return;
          
        default:
          return;
      }
    });
  }

  existAnimeInUserList( type: string, animeId: string ) {
    switch (true) {
      case type === 'love':
        this._animeService.existAnimeInUserList( type, animeId ).subscribe(( response: any ) => {
          if( response.message ) {
            this.animeInLove = false;
            return;
          };
          this.animeInLove = true;
        });
        return;

      case type === 'wait':
        this._animeService.existAnimeInUserList( type, animeId ).subscribe(( response: any ) => {
          if( response.message ) {
            this.animeInWait = false;
            return;
          }
          this.animeInWait = true;
        });
        return;
        
      case type === 'watch':
        this._animeService.existAnimeInUserList( type, animeId ).subscribe(( response: any ) => {
          if( response.message ) {
            this.animeInWatch = false;
            return;
          };
          this.animeInWatch = true;
        });
        return;
    
      default:
        return;
    }
  }

  ngAfterViewChecked() {
    if( this.episodeScroll ) {
      this.scrollToBottom( this.episodeList.nativeElement );  
    }
  } 

  scrollToBottom( element: any ) {
    try {
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) { }
    
  }

  
  watchEpisode( anime: string, episodeNumber: number ) {
    let nameLineToPlus = anime.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');

    this._router.navigate([`/ver`], { queryParams : { anime: nameSend, episodio: episodeNumber }});
  }

}
