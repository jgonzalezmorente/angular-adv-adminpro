import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem( 'email' ) || '', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService ) { }


  ngOnInit(): void {
    this.renderButton();
  }


  login(): void {

    this.usuarioService.login( this.loginForm.value ).subscribe(
      resp => {
        if ( this.loginForm.get('remember').value ) {
          localStorage.setItem( 'email', this.loginForm.get( 'email' ).value );
        } else {
          localStorage.removeItem( 'email' );
        }

        // Navegar al Dashboard
        this.router.navigateByUrl('/');

      },
      err => Swal.fire( 'Error', err.error.msg, 'error' ));
  }


  renderButton(): void  {
    gapi.signin2.render( 'my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });

    this.startApp();
  }

  startApp(): void {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '1082796497580-v5qmqehc6c8v8367sc47faf59fdbbcbp.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });

      this.attachSignin( document.getElementById( 'my-signin2' ) );

    });

  }

  attachSignin( element ): void {

    this.auth2.attachClickHandler(element, {},
        ( googleUser ) => {
          const id_token = googleUser.getAuthResponse().id_token;

          this.usuarioService.loginGoogle( id_token ).subscribe({
            next: resp => this.router.navigateByUrl('/'),
            error: console.log,
            complete: console.log
          });

        }, ( error ) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
