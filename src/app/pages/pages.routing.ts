import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AnimesComponent } from './animes/animes.component';
import { EpisodesComponent } from './episodes/episodes.component';
import { AnimeComponent } from './anime/anime.component';
import { EpisodeComponent } from './episode/episode.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { FeedComponent } from './feed/feed.component';
import { RankingComponent } from './ranking/ranking.component';
import { PublicationComponent } from './publication/publication.component';
import { InboxComponent } from './inbox/inbox.component';
import { AllianceComponent } from './alliance/alliance.component';

const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent,
        children: [
            /* Everything about Anime */
          { path: '', component: HomeComponent },
          { path: 'anime/:name', component: AnimeComponent },
          { path: 'busqueda', component: AnimesComponent },
          { path: 'animes', component: AnimesComponent },
          { path: 'episodios', component: EpisodesComponent },
          { path: 'ver', component: EpisodeComponent },

          /* Everything about social */
          { path: 'feed', component: FeedComponent, canActivate: [ AuthGuard ] },
          { path: 'usuarios', component: RankingComponent },
          { path: 'mensajes', component: InboxComponent, canActivate: [ AuthGuard ] },
          { path: 'alianzas', component: AllianceComponent },
          { path: ':username', component: ProfileComponent, canActivate: [ AuthGuard ] },
          { path: ':username/publicacion/:id', component: PublicationComponent, canActivate: [ AuthGuard ] },
        ]
    }

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}