import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';


const base_url = environment.base_url;

declare const gapi: any;



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;


  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {

      this.googleInit();

  }

  get token(): string {
    return localStorage.getItem( 'token' ) || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get headers(): any {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }



  googleInit(): Promise<any> {

    return new Promise<any>( resolve => {

      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1082796497580-v5qmqehc6c8v8367sc47faf59fdbbcbp.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve( this.auth2 );

      });

    });
  }

  guardarLocalStorage( token: string, menu: any ): void {

    localStorage.setItem( 'token', token );
    localStorage.setItem( 'menu', JSON.stringify( menu ) );

  }


  logout(): void {
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'menu' );

    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl( '/login' );
      });
    });

  }


  validarToken(): Observable<boolean> {

    return this.http.get( `${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(

      map( ( resp: any ) => {

        const { role, google, nombre, email, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );

        this.guardarLocalStorage( resp.token, resp.menu );

        return true;

      }),
      catchError( error => of( false ) )

    );

  }

  crearUsuario( formData: RegisterForm ): Observable<any> {

    return this.http.post( `${ base_url }/usuarios`, formData ).pipe(
      tap( resp => this.guardarLocalStorage( resp.token, resp.menu )
      )
    );

  }


  actualizarPerfil( data: { email: string, nombre: string, role: string } ): Observable<any> {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, this.headers );

  }

  login( formData: LoginForm ): Observable<any> {

    return this.http.post( `${ base_url }/login`, formData ).pipe(
      tap( resp => this.guardarLocalStorage( resp.token, resp.menu ) )
    );

  }

  loginGoogle( token ): Observable<any> {

    return this.http.post( `${ base_url }/login/google`, { token } ).pipe(
      tap( resp => {
        localStorage.setItem( 'token', resp.token );
      })
    );

  }

  cargarUsuarios( desde: number = 0 ): Observable<CargarUsuario> {

    const url = `${ base_url }/usuarios?desde=${ desde }`;

    return this.http.get<CargarUsuario>( url, this.headers ).pipe(

      map( (resp: any) => {
        const usuarios = resp.usuarios.map( user => new Usuario(
          user.nombre,
          user.email,
          '',
          user.img,
          user.google,
          user.role,
          user.uid ));

        return {
          total: resp.total,
          usuarios
        };

      })
    );

  }

  eliminarUsuario( usuario: Usuario ): Observable<any> {

    // usuarios/6001e5fbda756849081b4dd0
    const url = `${ base_url }/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.headers );

  }


  guardarUsuario( usuario ): Observable<any> {

    return this.http.put( `${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );

  }
}
