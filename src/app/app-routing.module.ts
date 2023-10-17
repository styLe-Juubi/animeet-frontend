import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { Error404Component } from './pages/error404/error404.component';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [{
  path: '**',
  component: Error404Component
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


