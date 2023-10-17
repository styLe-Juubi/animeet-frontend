import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['../signin/signin.component.scss']
})
export class ForgotComponent implements OnInit {

  public formSubmitted = false;
  public forgotForm = this._fb.group({
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
  });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _titleService: Title,
    private readonly _authService: AuthService,
    private readonly _toastrService: ToastrService,
    private readonly _router: Router,
    private readonly _themeService: ThemeService,
    ) {
      this._themeService.setTheme( localStorage.getItem('theme') || 'default' );
      this._titleService.setTitle('Restablecer Password — Animeet');
    }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  forgotPassword() {
    this.formSubmitted = true;
    let button = document.querySelector( '#forgotSubmit' );
    let buttonMovil = document.querySelector( '#forgotSubmitMovil' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');
    buttonMovil?.setAttribute('disabled', '');
    buttonMovil?.classList.add('wait-submit');

    if( this.forgotForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonMovil?.removeAttribute('disabled');
        buttonMovil?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }

    this._authService.recover( this.forgotForm.value ).subscribe( ( response: any ) => {

      if( response.message === 'Se ha enviado un token de recuperación a tu correo electronico !' ) {
        this._toastrService.success( response.message );
        this._router.navigate(['/login']);
        return;
      } else {
        this._toastrService.info( response.message );
        setTimeout(() => {
          button?.removeAttribute('disabled');
          button?.classList.remove('wait-submit');
          buttonMovil?.removeAttribute('disabled');
          buttonMovil?.classList.remove('wait-submit');
        }, 2000 );
        return;
      }

    }, ( err ) => this._toastrService.error('Error al generar el token de restablecimiento !'));
  }

  campoNoValido( campo: string ): boolean {
      
    if( this.forgotForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

}