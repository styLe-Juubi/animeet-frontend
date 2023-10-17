import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public formSubmitted = false;
  public loginForm = this._fb.group({
    username: ['', [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
    password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(30) ]],
  });

  constructor(
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _titleService:Title,
    private readonly _toastrService: ToastrService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _themeService: ThemeService,
  ) {
    this._themeService.setTheme( localStorage.getItem('theme') || 'default' );
    this._titleService.setTitle('Iniciar Sesion — Animeet');
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  signIn() {
    this.formSubmitted = true;
    let button = document.querySelector( '#loginSubmit' );
    let buttonMovil = document.querySelector( '#loginSubmitMovil' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');
    buttonMovil?.setAttribute('disabled', '');
    buttonMovil?.classList.add('wait-submit');

    if( this.loginForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonMovil?.removeAttribute('disabled');
        buttonMovil?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }

    this._authService.signin( this.loginForm.value ).subscribe( ( response: any ) => {

      this._toastrService.success('Bienvenid@ a la mejor comunidad anime !');
      this._userService.myProfile().subscribe( ( response: any ) => {
        this._authService.setIdentity( response.data );
        this._router.navigate(['/']);
      });
      
    }, ( err ) => {
      this._toastrService.info( err.error.error.message, 'Advertencia' );
        setTimeout(() => {
          button?.removeAttribute('disabled');
          button?.classList.remove('wait-submit');
          buttonMovil?.removeAttribute('disabled');
          buttonMovil?.classList.remove('wait-submit');
        }, 2000 );
        return;
    });

  }

  campoNoValido( campo: string ): boolean {
      
    if( this.loginForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

}
