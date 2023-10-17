import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['../signin/signin.component.scss']
})
export class NewpasswordComponent implements OnInit {

  public formSubmitted = false;
  public token!: string;
  public forgotForm = this._fb.group({
    password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(40) ] ],
    password2: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(40) ] ],
  });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _toastrService: ToastrService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _userService: UserService,
    private readonly _themeService: ThemeService,
    private readonly _titleService: Title,
  ) {
    this._themeService.setTheme( localStorage.getItem('theme') || 'default' );
    this._titleService.setTitle('Crear Nueva Password — Animeet');
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(( params: any ) => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      if ( params && !params.token ) {
        this._toastrService.info('Token de recuperacion invalido !');
        this._router.navigate(['/login']);
        return;
      }

      this.token = params.token;
    });
  }

  newPassword() {
    this.formSubmitted = true;
    let button = document.querySelector( '#forgotSubmit' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');

    let buttonPC = document.querySelector( '#forgotSubmitPC' );
    buttonPC?.setAttribute('disabled', '');
    buttonPC?.classList.add('wait-submit');

    if( this.forgotForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');

        buttonPC?.removeAttribute('disabled');
        buttonPC?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }

    this._authService.newPassword({ token: this.token, password: this.forgotForm.controls['password'].value }).subscribe( ( response: any ) => {

      if( response.message ) {

        this._toastrService.info( response.message );
        setTimeout(() => {
          button?.removeAttribute('disabled');
          button?.classList.remove('wait-submit');
  
          buttonPC?.removeAttribute('disabled');
          buttonPC?.classList.remove('wait-submit');
        }, 2000 );
        return;

      }

      this._toastrService.success('Bienvenid@ a la mejor comunidad anime !');
      this._userService.myProfile().subscribe( ( response: any ) => {
        this._authService.setIdentity( response.data );
        this._router.navigate(['/']);
      });
    }, ( err ) => this._toastrService.error('Error al generar el token de restablecimiento !'));
  }

  campoNoValido( campo: string ): boolean {
      
    if( this.forgotForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

  passwordMatch(): boolean {
      
    if(( this.forgotForm.controls['password'].value !== this.forgotForm.controls['password2'].value ) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

}
