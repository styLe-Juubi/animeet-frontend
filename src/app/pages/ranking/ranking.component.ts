import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnimeService } from 'src/app/services/anime.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  public url = wsUrl;
  public topFiveUsers: any = [];
  public topFiveAnimes: any = [];
  public page: number = 1;
  public search: string = '';
  public users: any = [];
  public totalUsers: any;
  public totalPages: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
    private readonly _userService: UserService,
    private readonly _animeService: AnimeService,
    private readonly _titleService: Title,
  ) { 
    this._titleService.setTitle(`Ranking — Animeet`);
  }

  ngOnInit(): void {
    this.getTopFiveUsers();
    this.getTopFiveAnimes();
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
      this.findRelationalUsers( this.search, this.page );
    });
  }

  getTopFiveUsers() {
    this._userService.topFiveUsers().subscribe(( response: any ) => {
      if( response.message ) return;
      for ( let user of response.data ) {
        let counters = this.getCounters( user._id );
        this.topFiveUsers.push({ ...user, counters });
      }
    });
  }

  getTopFiveAnimes() {
    this._animeService.topFiveAnimes().subscribe(( response: any ) => {
      if( response.message ) return;
      this.topFiveAnimes = response.data;
    });
  }

  getCounters( id: string ) {
    let counters: any = {};
    this._userService.getUserPublicationCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      counters.publicationsCount = response.data.publications;
      counters.reviewsCount = response.data.reviews;
    });
    this._userService.getUserListCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      counters.loveCount = response.data.love;
      counters.waitCount = response.data.wait;
      counters.watchCount = response.data.watch;
    });
    return counters;
  }

  findRelationalUsers( search: string, page: number = 1) {
    this._userService.findRelationalUsers( search, page, 9 ).subscribe(( response: any ) => {
      if( response.message ) {
        this._toastrService.info( response.message );
        this.users = [];
        return;
      }
      this.users = response.data.docs;
      this.page = response.data.page;
      this.totalUsers = response.data.totalDocs;
      this.totalPages = response.data.totalPages;
    });
  }

  
  changePage( event: any ) {
    if ( event === 'next' ) {

      if( this.page + 1 > this.totalPages ) {
        this._toastrService.info('Te encuentras en la ultima Pagina !');
        return;
      }
      this._router.navigate(['/usuarios'], { queryParams: { busqueda: this.search, pagina: this.page + 1 }});
    
    } else if ( event === 'back' ) {

      if( this.page - 1 < 1 ) {
        this._toastrService.info('Te encuentras en la primer Pagina !');
        return;
      }
      this._router.navigate(['/usuarios'], { queryParams: { busqueda: this.search, pagina: this.page - 1 }});
    
    } else if ( event === this.totalPages ) {

      this._router.navigate(['/usuarios'], { queryParams: { busqueda: this.search, pagina: this.totalPages }});
      
    }
  }

  watchAnime( name: string ) {
    let nameLineToPlus = name.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

}
