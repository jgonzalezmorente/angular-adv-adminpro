import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: [ 'Fernando', Validators.required ],
    email: ['test100@gmail.com', [ Validators.required, Validators.email ] ],
    password: ['123456', Validators.required ],
    password2: ['123456', Validators.required ],
    terminos: [true, Validators.required ]
  }, {
    validators: this.passwordsIguales( 'password', 'password2' )
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) { }

  crearUsuario(): void {
    this.formSubmitted = true;
    console.log( this.registerForm.value );


    if ( this.registerForm.invalid ) {
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value ).subscribe( resp => {
      this.router.navigateByUrl('/');
    }, ( err ) => Swal.fire( 'Error', err.error.msg, 'error' ));
  }

  campoNoValido( campo: string ): boolean {
    return ( this.registerForm.get( campo ).invalid && this.formSubmitted );
  }

  get aceptaTerminos(): boolean {
    return !this.registerForm.get( 'terminos' ).value && this.formSubmitted;
  }

  get contrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get( 'password' ).value;
    const pass2 = this.registerForm.get( 'password2' ).value;

    return !( pass1 === pass2 ) && this.formSubmitted;

  }


  passwordsIguales( pass1Name: string, pass2Name: string ): ( control: AbstractControl ) => ValidationErrors {

    return ( control: AbstractControl ): ValidationErrors => {

      const password1 = control.get( pass1Name );
      const password2 = control.get( pass2Name );

      if ( password1?.value === password2?.value ) {
        return null;
      } else {
        const error = {
          noEsIgual: true
        };
        password2.setErrors( error );
        return error;
      }

    };

  }


}
