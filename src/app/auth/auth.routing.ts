import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { CantGuard } from '../guards/cant.guard';
import { NewpasswordComponent } from './newpassword/newpassword.component';

const routes: Routes = [
    { path: 'auth/login', component: SigninComponent, canActivate: [ CantGuard ] },
    { path: 'auth/registro', component: SignupComponent, canActivate: [ CantGuard ] },
    { path: 'auth/recuperar-password', component: ForgotComponent, canActivate: [ CantGuard ] },
    { path: 'auth/recuperacion-de-cuenta', component: NewpasswordComponent, canActivate: [ CantGuard ] },
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
export class AuthRoutingModule {}