import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }


  ngOnInit(): void {
    this.renderButton();
  }


  login(): void {

    // tslint:disable-next-line: deprecation
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

  async startApp(): Promise<void> {

    this.auth2 = await this.usuarioService.googleInit();
    this.attachSignin( document.getElementById( 'my-signin2' ) );

  }

  attachSignin( element ): void {

    this.auth2.attachClickHandler(element, {},
        ( googleUser ) => {
          const id_token = googleUser.getAuthResponse().id_token;

          // tslint:disable-next-line: deprecation
          this.usuarioService.loginGoogle( id_token ).subscribe(
            resp => this.ngZone.run( () => this.router.navigateByUrl('/') ),
          );

        }, ( error ) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
