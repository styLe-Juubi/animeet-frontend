import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public user: any;
  public type: string = 'todos';
  public url = wsUrl;
  public suggestions: any;

  public followersCount: any;
  public publicationsCount: any;
  public reviewsCount: any;
  public loveCount: any;
  public waitCount: any;
  public watchCount: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _titleService: Title,
  ) { 
    this._titleService.setTitle(`Inicio de Perfil — Animeet`);
  }

  ngOnInit(): void {
    this.user = this._authService.getIdentity();
    this.getCounters( this.user._id );
    this.getFiveSuggestions();
  }

  changeType( type: string, id: string ) {
    let btns = document.querySelectorAll('ul.publication-options li');
    btns.forEach( elem => {
      if( elem.id === id ) {
        elem.classList.add('active-type-option');
      } else {
        elem.classList.remove('active-type-option');
      }
    });
    this.type = type;
  }

  getCounters( id: string ) {
    this._userService.getUserFollowCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.followersCount = response.data.followers;
    });
    this._userService.getUserPublicationCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.publicationsCount = response.data.publications;
      this.reviewsCount = response.data.reviews;
    });
    this._userService.getUserListCounters( id ).subscribe(( response: any ) => {
      if( response.message ) return;
      this.loveCount = response.data.love;
      this.waitCount = response.data.wait;
      this.watchCount = response.data.watch;
    });
  }

  reloadCountersHandler() {
    this.getCounters( this.user._id );
  }

  getFiveSuggestions() {
    this._userService.findFiveSuggestions().subscribe(( response: any ) => {
      if( response.message ) return;
      this.suggestions = response.data;
    });
  }

}
