import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-episodelist',
  templateUrl: './episodelist.component.html',
  styleUrls: ['./episodelist.component.scss']
})
export class EpisodelistComponent implements OnInit {

  public url = environment.wsUrl;
  @Input() episodes: any;

  constructor(
    private readonly _router: Router,
  ) { }

  ngOnInit(): void {
  }

  watchEpisode( anime: string, episodeNumber: number ) {
    let nameLineToPlus = anime.split('-').join('+');
    let nameSlashtoLine = nameLineToPlus.split('/').join('Slashy');
    let nameSend = nameSlashtoLine.split(' ').join('-');

    this._router.navigate([`/ver`], { queryParams : { anime: nameSend, episodio: episodeNumber }});
  }

}
