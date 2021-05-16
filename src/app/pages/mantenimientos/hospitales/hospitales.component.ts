import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';




@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando = true;
  public imgSubs: Subscription;

  private hospitalesTemp: Hospital[] = [];

  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedaService: BusquedasService ) { }

  ngOnInit(): void {

    this.cargarHosipitales();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe( img => this.cargarHosipitales() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  cargarHosipitales(): void {

    this.cargando = true;

    // tslint:disable-next-line: deprecation
    this.hospitalService.cargarHospitales().subscribe(
      hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      }
    );
  }

  guardarCambios( hospital: Hospital ): void {

    // tslint:disable-next-line: deprecation
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre ).subscribe(
      resp => {
        Swal.fire( 'Actualizado', hospital.nombre, 'success' );
      }
    );
  }

  borrarHospital( hospital: Hospital ): void {

    // tslint:disable-next-line: deprecation
    this.hospitalService.borrarHospital( hospital._id ).subscribe(
      resp => {
        this.cargarHosipitales();
        Swal.fire( 'Borrado', hospital.nombre, 'success' );
      }
    );
  }

  async abrirSweetAlert(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if ( value.trim().length > 0 ) {
      // tslint:disable-next-line: deprecation
      this.hospitalService.crearHospital( value ).subscribe(
        resp => {
          this.hospitales.push( resp.hospital );
        }
      );
    }

  }

  abrirModal( hospital: Hospital ): void {
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.hospitales = this.hospitalesTemp;
      return;
    }

    // tslint:disable-next-line: deprecation
    this.busquedaService.buscar( 'hospitales', termino ).subscribe({
      next: resultados => this.hospitales = resultados
    });

  }

}
