import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  standalone: true,
})
export class SuccessComponent {

  url;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly passedData,
  ){
    this.url = this.passedData.url;
  }

}
