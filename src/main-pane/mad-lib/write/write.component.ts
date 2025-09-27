import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WordToolComponent } from '../word-tool/word-tool.component';
import { SuccessComponent } from '../success/success.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { examples } from '../tooltip-object';

@Component({ 
    selector: 'app-write',
    templateUrl: './write.component.html',
    styleUrls: ['./write.component.scss'],
  })

export class WriteComponent implements AfterViewInit{
  @ViewChild('myTextarea') textAreaElement!: ElementRef;
  textarea: HTMLTextAreaElement;
  clickedWord: string = "";
  oldCurrentPosition: number;
  wordToolWidth: '320px';
  mode: string = "Edit";
  previewText = new BehaviorSubject<string>("hello");
  stashOriginalText: string;

    constructor(
        private router: Router,
        public dialog: MatDialog,
    ){
      this.mode = 'Edit';
    }

  ngAfterViewInit(): void {
    
  }

    ngOnInit(){

    }

    handleBack(){
        this.router.navigate(['/madlib']);
    }

    onTextAreaClick(event: MouseEvent) {
      event.preventDefault()
      this.textarea = event.target as HTMLTextAreaElement;
      const cursorPosition: number = this.textarea.selectionStart;
      const textContent: string = this.textarea.value;
  
      this.clickedWord = this.getWordAtPosition(textContent, cursorPosition);
      if(this.clickedWord){
        this.showWordTool(this.clickedWord);
      }
    }
  
    getWordAtPosition(text: string, position: number): string {
      let currentPosition = 0;
      for (const word of text.split(' ')) {
        this.oldCurrentPosition = currentPosition;
        currentPosition += word.length + 1; // +1 for the space
        if (currentPosition > position) {
          return word;
        }
      }
      return ''; // Or handle cases where no word is found
    }
  
    showWordTool(word: string): void{
      const dialogRef = this.dialog.open(WordToolComponent, {
        width: this.wordToolWidth,
        data: {
          word: word,
        },
        disableClose: false,
        autoFocus: false,
      });
  
      //subscribe to the variable that tells what the user selected as the word type
      dialogRef.afterClosed().subscribe((result: string) => {
        if(result){ 
          //replace the word in the textarea with the wordtype
          this.textarea.value = this.replaceWordAfterIndex(this.textarea.value, this.oldCurrentPosition, this.clickedWord, '[' + result.toUpperCase() + ']');
        }
      });
    }
  
    replaceWordAfterIndex(text: string, index: number, oldWord: string, newWord:string) {
      const textBefore = text.substring(0, index);
      const textAfter = text.substring(index);
      const replacedTextAfter = textAfter.replace(oldWord, newWord);
      return textBefore + replacedTextAfter;
    }
  
    handleDone(){
      //TODO: create option to make madlib public or private
      var cleanText = this.textarea.value.replaceAll("\"", "'");
      cleanText = cleanText.replace(/(\r\n|\n|\r)/gm, " ");
      cleanText = cleanText.replaceAll("\\", " ");
      this.dialog.open(SuccessComponent, {
        width: this.wordToolWidth,
        data: {
          text: cleanText,
        },
        disableClose: false,
        autoFocus: false,
      });
    }
  
    disableDoneButton(){
      const regex: RegExp = /\[([A-Z]+)\]/;
      if(this.mode == "Edit" && this.textarea?.value.search(regex)>0){
        return false;
      } else {
        return true;
      }
    }
  
    getColorForDone(){
      const regex: RegExp = /\[([A-Z]+)\]/;
      if(this.mode == "Edit" && this.textarea?.value.search(regex)>0){
        return '#bdfac5';
      } else {
        return '#8d8d8d';
      }
    }

    setMode(event: PointerEvent){
      const intmed = event.target as HTMLElement;
      this.mode = intmed.innerText;

      if(intmed.innerText == "Preview"){
        let manipulatedText: string;
        manipulatedText = this.stashOriginalText = this.textAreaElement.nativeElement.value;
        
        while(manipulatedText.includes("[")){

          const hint = manipulatedText.substring(manipulatedText.indexOf("[")+1, manipulatedText.indexOf("]"));
          const replacedWord = manipulatedText.substring(manipulatedText.indexOf("["), manipulatedText.indexOf("]")+1);
          const replacingWord = this.decideExampleText(hint);

          manipulatedText = manipulatedText.replace(replacedWord, '<b>'+replacingWord+'</b>');
        }
        
        this.previewText.next(manipulatedText);
      }

      if(intmed.innerText == "Edit"){
        setTimeout(() => {
          this.textAreaElement.nativeElement.innerHTML = this.stashOriginalText;
        }, 100);
      }
    }

    decideExampleText(hint: string): string{
      hint = hint.replaceAll(" ", "");
      hint = hint.replaceAll("-", "");
      return examples[hint] ? examples[hint] : hint;
    }
}