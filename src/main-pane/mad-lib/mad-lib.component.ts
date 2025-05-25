import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { WordToolComponent } from './word-tool/word-tool.component';
import { SuccessComponent } from './success/success.component';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-mad-lib',
  templateUrl: './mad-lib.component.html',
  styleUrls: ['./mad-lib.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MadLibComponent implements OnInit {
  display = 'options';
  fillOut = true;
  hints = ["adjective","noun","adjective"];
  madlibForm = this.fb.group({});
  madlibTemplate = "the FLAGOINK brown FLAGOINK jumped over the FLAGOINK dog";
  clickedWord: string = "";
  paramValue = null;
  wordTypeArray = [];
  textarea;
  xmlData;

  constructor(
    private readonly fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
  ){}

  ngOnInit(){
    const urlParams = new URLSearchParams(window.location.search);
    this.paramValue = urlParams.get('value');
  }

  prepareToPlay(){
    this.getXmlData('/assets/madlibs.xml').subscribe(data => {
      
      let array = this.xmlData.MAIN.ITEM;
      let myItem = array.find(item => item.NAME == 'dad');
      console.log(myItem);
      this.hints = myItem.HINTS.split(',');
      this.madlibTemplate = myItem.LIB;
      this.handlePlay();
    });
  }

  handlePlay(){
    this.display = 'play';
    this.hints.forEach((hint, index) => {
      console.log(hint);
      this.madlibForm.addControl("word"+index, this.fb.control(""));
    });
  }

  getXmlData(url: string) {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(xml => {
          xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
              // Handle the error
              console.error('Error parsing XML:', err);
              return;
            }
            console.log('Parsed JSON:', result);
            this.xmlData = result;
            return result;
          });

        })
      );
  }

  handleWrite(){
    this.display = 'write';
  }

  handleBack(){
    this.display = 'options';
    this.fillOut = true;
  }

  handleSubmit(){
    this.fillOut = false;
    this.hints.forEach((hint, index) => {
      const replacingWord: string = this.madlibForm.get("word"+index).value;
      this.madlibTemplate = this.madlibTemplate.replace("FLAGOINK", replacingWord);
      console.log(this.madlibTemplate);
    })
  }

  onTextAreaClick(event: MouseEvent) {
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
      currentPosition += word.length + 1; // +1 for the space
      if (currentPosition > position) {
        return word;
      }
    }
    return ''; // Or handle cases where no word is found
  }

  showWordTool(word): void{
    const dialogRef = this.dialog.open(WordToolComponent, {
      width: '50vw',
      data: {
        word: word,
      },
      disableClose: false,
      autoFocus: false,
    });

    //subscribe to the variable that tells what the user selected as the word type
    dialogRef.afterClosed().subscribe((result: string) => {
      if(result){ 
        this.wordTypeArray.push(result);
        console.log(this.wordTypeArray);
        //replace the word in the textarea with the wordtype
        //TODO: to make sure it replaces the right one, make it search how many there are, and if there's two
        this.textarea.value = this.textarea.value.replace(this.clickedWord, '[' + result.toUpperCase() + ']');
      }
    });
  }

  handleDone(){
    //create a url
    const url="https://bgoink.com?value=111222333"
    this.dialog.open(SuccessComponent, {
      width: '50vw',
      data: {
        url: url,
      },
      disableClose: false,
      autoFocus: false,
    });
  }
}
