import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando = true;
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedaService: BusquedasService ) { }

  ngOnInit(): void {

    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe( img => this.cargarMedicos() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(): void {

    this.cargando = true;
    // tslint:disable-next-line: deprecation
    this.medicoService.cargarMedicos().subscribe(
      medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
        console.log(medicos);
      }
    );
  }

  buscar( termino: string ): void {

    if ( termino.length === 0 ) {
      this.medicos = this.medicosTemp;
      return;
    }

    // tslint:disable-next-line: deprecation
    this.busquedaService.buscar( 'medicos', termino ).subscribe({
      next: resultados => this.medicos = resultados
    });

  }

  abrirModal( medico: Medico ): void {
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico ): void {
    Swal.fire({
      title: '¿Borrar médico',
      text: `Está a punto de borar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if ( result.isConfirmed ) {

        this.medicoService.borrarMedico( medico._id ).subscribe({
          next: resp => {
            Swal.fire(
              'Médico borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );
            this.cargarMedicos();
          }
        });
      }
    });
  }

}
