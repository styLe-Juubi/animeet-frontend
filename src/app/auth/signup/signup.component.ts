import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/models/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss']
})
export class SignupComponent implements OnInit {

  public formSubmitted = false;
  public userForm = this._fb.group({
    username: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    surname: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(40) ] ],
    password: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(30) ]],
    password2: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(30) ]]
  });

  constructor(
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _titleService: Title,
    private readonly _toastrService: ToastrService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _themeService: ThemeService,
  ) {
    this._themeService.setTheme( localStorage.getItem('theme') || 'default' );
    this._titleService.setTitle('Registrarse — Animeet');
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  signUp() {
    this.formSubmitted = true;
    let button = document.querySelector( '#userSubmit' );
    let buttonMovil = document.querySelector( '#userSubmitMovil' );
    button?.setAttribute('disabled', '');
    button?.classList.add('wait-submit');
    buttonMovil?.setAttribute('disabled', '');
    buttonMovil?.classList.add('wait-submit');

    if( this.userForm.invalid ) {
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonMovil?.removeAttribute('disabled');
        buttonMovil?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }
    if( this.userForm.get('password')?.value !== this.userForm.get('password2')?.value ) {
      this._toastrService.info('Las contraseñas son incorrectas !');
      setTimeout(() => {
        button?.removeAttribute('disabled');
        button?.classList.remove('wait-submit');
        buttonMovil?.removeAttribute('disabled');
        buttonMovil?.classList.remove('wait-submit');
      }, 2000 );
      return;
    }
    const user: IUser = {
      name: this.userForm.get('name')?.value,
      surname: this.userForm.get('surname')?.value,
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
    };

    this._authService.signup( user ).subscribe( ( response: any ) => {

      if( response.message ) {
        this._toastrService.info( response.message );
        setTimeout(() => {
          button?.removeAttribute('disabled');
          button?.classList.remove('wait-submit');
          buttonMovil?.removeAttribute('disabled');
          buttonMovil?.classList.remove('wait-submit');
        }, 2000 );
        return;
      }

      this._toastrService.success('Bienvenid@ a la mejor comunidad anime !');
      this._userService.myProfile().subscribe( ( response: any ) => {
        this._authService.setIdentity( response.data );
        this._router.navigate(['/']);
      });
      
    }, ( err ) => this._toastrService.error('Error al crear el nuevo usuario !', 'Error'));


  }

  campoNoValido( campo: string ): boolean {
      
    if( this.userForm.get( campo )?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }   

  }

}
