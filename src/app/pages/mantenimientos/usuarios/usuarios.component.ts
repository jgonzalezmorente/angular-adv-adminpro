import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';




@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;
  public desde = 0;
  public cargando = true;


  constructor( private usuarioService: UsuarioService,
               private busquedaService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe( img => this.cargarUsuarios() );
  }


  cargarUsuarios(): void {

    this.cargando = true;

    // tslint:disable-next-line: deprecation
    this.usuarioService.cargarUsuarios( this.desde ).subscribe({
      next: ( { total, usuarios } ) => {

        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

      }
    });
  }

  cambiarPagina( valor: number ): void {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }


  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    // tslint:disable-next-line: deprecation
    this.busquedaService.buscar( 'usuarios', termino ).subscribe({
      next: resultados => this.usuarios = resultados
    });

  }

  eliminarUsuario( usuario: Usuario ): void {

    if ( usuario.uid === this.usuarioService.uid ) {
      Swal.fire( 'Error', 'No puede borrarse a sí mismo', 'error' );
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario',
      text: `Está a punto de borar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        // tslint:disable-next-line: deprecation
        this.usuarioService.eliminarUsuario( usuario ).subscribe({
          next: resp => {
            Swal.fire(
              'Usuario borrado',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            );
            this.cargarUsuarios();
          }
        });
      }
    });

  }

  cambiarRole( usuario: Usuario ): void {
    // tslint:disable-next-line: deprecation
    this.usuarioService.guardarUsuario( usuario ).subscribe({
      next: console.log
    });
  }


  abrirModal( usuario: Usuario ): void {

    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );

  }



}
