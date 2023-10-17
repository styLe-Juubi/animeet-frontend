import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})
export class AnimesComponent implements OnInit {

  @Input() animes: any;
  @Input() page: any;
  @Input() totalPages: any;

  public search: any = undefined;
  public type: any = undefined;
  public status: any = undefined;
  public order: any = undefined;
  public tags: any = undefined;

  public formSubmited = false;
  public filterForm = this._fb.group({
    tags: new FormArray([]),
    type: '',
    status: '',
    order: '-1'
  });

  public tagsArray: any = [
    { description: 'Acción', value: 'acción' },
    { description: "Artes Marciales", value: 'artes marciales' },
    { description: "Aventuras", value: 'aventuras' },
    { description: 'Carreras', value: 'carreras' },
    { description: "Ciencia Ficción", value: 'ciencia ficción' },
    { description: "Comedia", value: 'comedia' },
    { description: "Demencia", value: 'demencia' },
    { description: 'Demonios', value: 'demonios' },
    { description: "Deportes", value: 'deportes' },
    { description: "Drama", value: 'drama' },

    { description: 'Ecchi', value: 'ecchi' },
    { description: "Escolares", value: 'escolares' },
    { description: "Espacial", value: 'espacial' },
    { description: 'Fantasía', value: 'fantasía' },
    { description: "Harem", value: 'harem' },
    { description: "Historico", value: 'historico' },
    { description: "Infantil", value: 'infantil' },
    { description: 'Josei', value: 'josei' },
    { description: "Juegos", value: 'juegos' },
    { description: "Magia", value: 'magia' },

    { description: 'Mecha', value: 'mecha' },
    { description: "Militar", value: 'militar' },
    { description: "Misterio", value: 'misterio' },
    { description: 'Música', value: 'música' },
    { description: "Parodia", value: 'parodia' },
    { description: "Policía", value: 'policía' },
    { description: "Psicológico", value: 'psicológico' },
    { description: 'Recuentos de la vida', value: 'recuentos de la vida' },
    { description: "Romance", value: 'romance' },
    { description: "Samurai", value: 'samurai' },

    { description: 'Seinen', value: 'seinen' },
    { description: "Shoujo", value: 'shoujo' },
    { description: "Shounen", value: 'shounen' },
    { description: 'Sobrenatural', value: 'sobrenatural' },
    { description: "Superpoderes", value: 'superpoderes' },
    { description: "Suspenso", value: 'suspenso' },
    { description: "Terror", value: 'terror' },
    { description: 'Vampiros', value: 'vampiros' },
    { description: "Yaoi", value: 'yaoi' },
    { description: "Yuri", value: 'yuri' },
  ];
  
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _toastrService: ToastrService,
    private readonly _animeService: AnimeService,
    private readonly _titleService: Title,
  ) {
    this._titleService.setTitle('Directorio Anime — Animeet');
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
      this.search = params['busqueda'];
      this.order = params['orden'];
      this.type = params['tipo'];
      this.filterForm.controls['type'].setValue( this.type );
      this.status = params['estatus'];
      this.tags = params['etiquetas'];
      this.getAnimes( this.search, this.page, undefined, this.order, this.type, this.status, this.tags );
    });
    
  }

  getAnimes( 
    search: string = '',
    page: number = 1,
    limit: number = 21,
    order: number = -1,
    type: string = '',
    status: string = '',
    tags: string = ''
  ) {
    this._animeService.getAnimes( search, page, limit, order, type, status, tags ).subscribe(( response: any ) => {
      if( response.message ) {
        this.animes = null;
        this._toastrService.info( response.message );
        return;
      }
      this.animes = response.data.docs;
      this.page = response.data.page;
      this.totalPages = response.data.totalPages;
    })
  }

  openCloseFilters( id: string ) {
    let filtersDiv = document.querySelectorAll('.list-filters');
    filtersDiv?.forEach( elem => {
      if( elem.id === id && elem.classList.contains('active') ) {
        elem.classList.add('unactive');
        setTimeout(() => {
          elem.classList.remove('active');
          elem.classList.remove('unactive');
        }, 300 );
      }
      if( elem.id !== id ) {
        elem.classList.add('unactive');
        setTimeout(() => {
          elem.classList.remove('active');
          elem.classList.remove('unactive');
        }, 300 );
      } else {
        elem.classList.add('active');
      }
    });
  }

  filterAnimes() {
    this.formSubmited = true;
    let btnFilter = document.querySelector('#filter-submit');
    btnFilter?.setAttribute('disabled', '');
    btnFilter?.classList.add('wait-submit');

    this.status = this.filterForm.controls['status'].value;
    this.type = this.filterForm.controls['type'].value;
    this.order = this.filterForm.controls['order'].value;

    if ( this.filterForm.controls['tags'].value.length === 0 ) {
      this.tags = 'all';
    } else {
      this.tags = this.filterForm.controls['tags'].value.join(',')
    }
    

    let genreDiv = document.querySelector( '#genre-filters' );
    let typeDiv = document.querySelector( '#type-filters' );
    let statusDiv = document.querySelector( '#status-filters' );
    let orderDiv = document.querySelector( '#order-filters' );

    if( genreDiv?.classList.contains('active') ) {
      genreDiv.classList.add('unactive');
      setTimeout(() => {
        genreDiv?.classList.remove('active');
        genreDiv?.classList.remove('unactive');
      }, 300 );
    }

    if( typeDiv?.classList.contains('active') ) {
      typeDiv.classList.add('unactive');
      setTimeout(() => {
        typeDiv?.classList.remove('active');
        typeDiv?.classList.remove('unactive');
      }, 300 );
    }

    if( statusDiv?.classList.contains('active') ) {
      statusDiv.classList.add('unactive');
      setTimeout(() => {
        statusDiv?.classList.remove('active');
        statusDiv?.classList.remove('unactive');
      }, 300 );
    }

    if( orderDiv?.classList.contains('active') ) {
      orderDiv.classList.add('unactive');
      setTimeout(() => {
        orderDiv?.classList.remove('active');
        orderDiv?.classList.remove('unactive');
      }, 300 );
    }

    this._router.navigate(['/animes'], { queryParams: { busqueda: this.search, tipo: this.type, estatus: this.status, orden: this.order, etiquetas: this.tags }});

    setTimeout(() => {
      btnFilter?.removeAttribute('disabled');
      btnFilter?.classList.remove('wait-submit');
    }, 2000 ); 
  }

  onCheckChange( event: any ) {
    const formArray: FormArray = this.filterForm.get('tags') as FormArray;
    if( event.target.checked ){
      formArray.push(new FormControl(event.target.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: any) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  changePage( event: any ) {
    if ( event === 'next' ) {

      if( this.page + 1 > this.totalPages ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this._router.navigate(['/animes'], { queryParams: { pagina: this.page + 1, busqueda: this.search, orden: this.order, tipo: this.type, estatus: this.status, etiquetas: this.tags }});
    
    } else if ( event === 'back' ) {

      if( this.page - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this._router.navigate(['/animes'], { queryParams: { pagina: this.page - 1, busqueda: this.search, orden: this.order, tipo: this.type, estatus: this.status, etiquetas: this.tags }});
    
    } else if ( event === this.totalPages ) {

      this._router.navigate(['/animes'], { queryParams: { pagina: this.totalPages, busqueda: this.search, orden: this.order, tipo: this.type, estatus: this.status, etiquetas: this.tags }});
      
    }
  }

}
