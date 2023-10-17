import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EpisodeService } from 'src/app/services/episode.service';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {

  public page: number = 1;
  public totalPages: any;
  public order: any;
  @Input() episodes: any;
  public filterForm = this._fb.group({
    order: '-1'
  });

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _toastrService: ToastrService,
    private readonly _episodeService: EpisodeService,
    private readonly _titleService: Title,
  ) { 
    this._titleService.setTitle('Ultimos Episodios — Animeet');
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe( params => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      let page = params['pagina'];
      if( !page ) {
        this.page = 1;
      } else {
        this.page = page;
      }
      this.order = params['orden'];
      this.getEpisodes( this.page, undefined, this.order );
    });
  }

  getEpisodes( page: number = 1, limit: number = 21, order: number = -1 ) {
    this._episodeService.getEpisodes( page, limit, order ).subscribe(( response: any ) => {
      if( response.message ) {
        this.episodes = null;
        this._toastrService.info( response.message );
        return;
      }
      this.episodes = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    });
  }

  openCloseFilters( id: string ) {
    let filterDiv = document.querySelector( '#'+ id );
    if( filterDiv?.classList.contains('active') ) {

      filterDiv.classList.add('unactive');
      setTimeout(() => {
        filterDiv?.classList.remove('active');
        filterDiv?.classList.remove('unactive');
      }, 300 );

    } else {
      filterDiv?.classList.add('active');
    }
  }

  filterAnimes() {
    let btnFilter = document.querySelector('#filter-submit');
    btnFilter?.setAttribute('disabled', '');
    btnFilter?.classList.add('wait-submit');

    this.order = this.filterForm.controls['order'].value;

    let orderDiv = document.querySelector( '#order-filters' );

    if( orderDiv?.classList.contains('active') ) {
      orderDiv.classList.add('unactive');
      setTimeout(() => {
        orderDiv?.classList.remove('active');
        orderDiv?.classList.remove('unactive');
      }, 300 );
    }

    this._router.navigate(['/episodios'], { queryParams: { orden: this.order }});

    setTimeout(() => {
      btnFilter?.removeAttribute('disabled');
      btnFilter?.classList.remove('wait-submit');
    }, 2000 ); 
  }

  changePage( event: any ) {
    if ( event === 'next' ) {

      if( this.page + 1 > this.totalPages ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this._router.navigate(['/episodios'], { queryParams: { pagina: this.page + 1, orden: this.order }});
    
    } else if ( event === 'back' ) {

      if( this.page - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this._router.navigate(['/episodios'], { queryParams: { pagina: this.page - 1, orden: this.order }});
    
    } else if ( event === this.totalPages ) {

      this._router.navigate(['/episodios'], { queryParams: { pagina: this.totalPages, orden: this.order }});
      
    }
  }

}
