import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HeaderComponent } from './header/header.component';
import { LatestnewsComponent } from './latestnews/latestnews.component';
import { AnimelistComponent } from './animelist/animelist.component';
import { EpisodelistComponent } from './episodelist/episodelist.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CommentlistComponent } from './commentlist/commentlist.component';
import { PublicationlistComponent } from './publicationlist/publicationlist.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ReactionlistComponent } from './reactionlist/reactionlist.component';
import { NotificationlistComponent } from './notificationlist/notificationlist.component';
import { ThemelistComponent } from './themelist/themelist.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    LatestnewsComponent,
    AnimelistComponent,
    EpisodelistComponent,
    PaginationComponent,
    NotfoundComponent,
    CommentlistComponent,
    PublicationlistComponent,
    UserlistComponent,
    ChatlistComponent,
    ReactionlistComponent,
    NotificationlistComponent,
    ThemelistComponent,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    LatestnewsComponent,
    AnimelistComponent,
    EpisodelistComponent,
    PaginationComponent,
    NotfoundComponent,
    CommentlistComponent,
    PublicationlistComponent,
    UserlistComponent,
    ChatlistComponent,
    ReactionlistComponent,
    NotificationlistComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class ComponentsModule { }
