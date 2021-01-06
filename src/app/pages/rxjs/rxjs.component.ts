import { Component, OnDestroy } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {


    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor ),
    //   err => console.warn('Error:', err),
    //   () => console.log('Obs. terminado')


    // );

    this.intervalSubs = this.retornaIntervalo()
      .subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {

    return interval(100)
    .pipe(
      // take(10),
      map( valor => valor + 1 ),
      filter( valor => valor % 2 === 0 ),
    );

  }

  retornaObservable(): Observable<number> {

    let i = -1;

    return new Observable<number>( observer => {

      console.log('Inicializando i a -1');

      const intervalo = setInterval( () => {

        i++;
        observer.next(i);

        if ( i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }

        if ( i === 2) {
          observer.error('i llegó al valor de 2');
        }


      }, 1000);

    });

  }

}
