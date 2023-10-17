import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { Error404Component } from './error404/error404.component';
import { AnimesComponent } from './animes/animes.component';
import { AnimeComponent } from './anime/anime.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { EpisodeComponent } from './episode/episode.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { RankingComponent } from './ranking/ranking.component';
import { PublicationComponent } from './publication/publication.component';
import { InboxComponent } from './inbox/inbox.component';
import { AllianceComponent } from './alliance/alliance.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    Error404Component,
    AnimesComponent,
    AnimeComponent,
    EpisodesComponent,
    EpisodeComponent,
    ProfileComponent,
    FeedComponent,
    RankingComponent,
    PublicationComponent,
    InboxComponent,
    AllianceComponent,
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    Error404Component,
    AnimesComponent,
    AnimeComponent,
    EpisodesComponent,
    EpisodeComponent,
    PublicationComponent,
    AllianceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
