import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from 'rxjs/operators';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }


  validarToken(): Observable<boolean> {
    const token = localStorage.getItem( 'token' ) || '';

    return this.http.get( `${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(

      tap( ( resp: any ) => localStorage.setItem( 'token', resp.token ) ),
      map( resp => true ),
      catchError( error => of( false ) )

    );

  }

  crearUsuario( formData: RegisterForm ): Observable<any> {

    return this.http.post( `${ base_url }/usuarios`, formData ).pipe(
      tap( resp => {
        localStorage.setItem( 'token', resp.token );
      })
    );

  }

  login( formData: LoginForm ): Observable<any> {

    return this.http.post( `${ base_url }/login`, formData ).pipe(
      tap( resp => localStorage.setItem( 'token', resp.token ) )
    );

  }

  loginGoogle( token ): Observable<any> {

    return this.http.post( `${ base_url }/login/google`, { token } ).pipe(
      tap( resp => {
        localStorage.setItem( 'token', resp.token );
      })
    );

  }
}
