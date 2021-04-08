import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImagen( file: File ): void {

    this.imagenSubir = file;

    if ( !file ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

  }

  subirImagen(): void {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {
        if ( img ){
          Swal.fire( 'Guardado', 'Imagen de usuario actualizada', 'success' );
          this.modalImagenService.nuevaImagen.emit( img );
        } else {
          Swal.fire( 'Error', 'No se pudo subir la imagen', 'error' );
        }
        this.cerrarModal();
      })
      .catch( err => {
        Swal.fire( 'Error', 'No se pudo subir la imagen', 'error' );
        this.cerrarModal();
        console.log( err );
    } );
  }



}
