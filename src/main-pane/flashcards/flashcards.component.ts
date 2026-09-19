import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-flashcards',
    templateUrl: './flashcards.component.html',
    styleUrls: ['./flashcards.component.scss'],
    standalone: false
})

export class FlashcardsComponent {
  @ViewChild('mathInput') myInputField!: ElementRef;
  mathStuff = new FormControl('', Validators.required);
  answer = new FormControl('', Validators.required);
  showActionArea = false;
  question = '';
  symbol: string[] = ['+','-','×','÷','^','=','/','(',')'];
  stuffToAppend = "";
  equation = false;

  start(){
    console.log(this.mathStuff.value);
    this.equation = false;
    this.showActionArea = true;
    this.parseMath(this.mathStuff.value);
  }

  insert(selectedSymbol: string){
    this.mathStuff.patchValue(this.mathStuff.value + selectedSymbol);
    this.myInputField.nativeElement.focus();
  }

  check(){
    //console.log(this.answer.value);
    this.parseMath(this.mathStuff.value);
  }

  parseMath(input: string){

      const inputArray: string[] = [...input]; //...makes me want a bagel

      inputArray.forEach((char, index) => {
 
        if(!isNaN(+char)&&char!==" "){ //if it's a number
          const digit = Math.ceil(Math.random()*9).toString();
          inputArray[index]=digit;
     
        } if(/^[a-zA-Z\p{L}]$/u.test(char)){ //if it's a letter
          this.stuffToAppend = ". " + char; //make it display something like "x = ___" since this implies we'll be solving for a variable
        } if(char === "="){ //if it's an equals sign
          this.equation = true;
        }
      });

    const resultStringJoin: string = inputArray.join('');
    console.log(resultStringJoin);
    const number = input.match(/\d+(\.\d+)?/g);
    console.log(number);

    this.question = resultStringJoin
    if(this.equation){
      this.question = resultStringJoin + this.stuffToAppend;
    } 
  }

}