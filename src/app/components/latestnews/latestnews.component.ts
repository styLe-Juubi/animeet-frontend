import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-latestnews',
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.scss']
})
export class LatestnewsComponent implements OnInit {

  @Input() randomAnimes: any;
  @ViewChild('swiper', { static: false }) swiper?: any;

  public url = wsUrl;

  constructor(
    private readonly _router: Router,
  ) { }

  ngOnInit(): void { }

  watchAnime( name: string ) {
    let nameFixed = name.split('-').join('+');
    let nameSend = nameFixed.split(' ').join('-');
    this._router.navigate([`/anime/${ nameSend }`]);
  }

}
