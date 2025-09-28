import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class SuccessComponent {

  name: string;
  hints: string[] = [];
  text: string;
  part = "part1";
  response;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly passedData,
    public dialogRef: MatDialogRef<SuccessComponent>,
    private http: HttpClient,
  ){
    this.text = this.passedData.text;
  }
  //TODO: make it so when you are done saving and getting your url it refreshes the site
  save(name: string){
    this.name = name;
    this.part = "part2";

    while(this.text.includes("[")){

      const hint = this.text.substring(this.text.indexOf("[")+1, this.text.indexOf("]"));
      this.hints.push(hint);

      const replacedWord = this.text.substring(this.text.indexOf("["), this.text.indexOf("]")+1);
      this.text = this.text.replace(replacedWord, "FLAGOINK");
    }

    this.response = this.http.get('https://bgoink.com/database',{params: {name: this.name, hints: this.hints, text: this.text}}); 
    //https://bgoink.com/database //http://localhost:8080/database //TODO: make a dev build thingy that automatically switches these out

    this.response.subscribe((stuff) => {
      console.log(stuff);
    });
  }

  close(){
    this.dialogRef.close();
  }

}
