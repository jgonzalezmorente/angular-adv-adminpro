import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  // Doughnut
  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label = ['Label 1', 'Label 2', 'Label 3'];

  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];

  @Input() title = 'Sin título';

  public colors: Color[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];

}
