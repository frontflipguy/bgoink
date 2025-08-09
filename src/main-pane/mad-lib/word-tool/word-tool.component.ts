import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-word-tool',
  templateUrl: './word-tool.component.html',
  styleUrls: ['./word-tool.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatRadioModule,
    ReactiveFormsModule,
  ]
})
export class WordToolComponent {

  wordOfInterest: string = "test";
  wordTypeForm = this.fb.group({
    checkboxes: this.fb.control('', Validators.required),
    userInput: this.fb.control(''),
  });
  wordType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly passedData,
    public dialogRef: MatDialogRef<WordToolComponent>,
    private readonly fb: FormBuilder,
  ){
    this.wordOfInterest = this.passedData.word;
  }

  submit(){
    console.log(this.wordTypeForm);
    this.wordType = this.wordTypeForm.value.checkboxes;
    if(this.wordType=='other'){this.wordType = this.wordTypeForm.value.userInput;}
    console.log(this.wordType);
    this.dialogRef.close(this.wordType);
  }

  close(){
    this.dialogRef.close();
  }

  disableSubmitButton(){
    if(this.wordTypeForm.valid){
      return false;
    } else {
      return true;
    }
  }

  getColor(){
    if(this.wordTypeForm.valid){
      return '#bdfac5';
    } else {
      return '#8d8d8d';
    }
  }
}
