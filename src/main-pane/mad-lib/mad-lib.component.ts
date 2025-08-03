import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { WordToolComponent } from './word-tool/word-tool.component';
import { SuccessComponent } from './success/success.component';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { madLib } from './mad-lib-object';


@Component({
  selector: 'app-mad-lib',
  templateUrl: './mad-lib.component.html',
  styleUrls: ['./mad-lib.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MadLibComponent implements OnInit {
  display = 'options';
  fillOut = "one";
  hints: string[] = [];
  madlibForm = this.fb.group({});
  madlibTemplate = "";
  clickedWord: string = "";
  paramValue = null;
  textarea;
  madlibList;
  madlibNames = [];
  oldCurrentPosition: number;
  initialView = true;
  opacity = 1;
  hide = false;

  constructor(
    private readonly fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    const urlParams = new URLSearchParams(window.location.search);
    this.paramValue = urlParams.get('value');

    this.getJSONData('/assets/madlibs.txt');
  }

  prepareToPlay(){
    this.display = 'madlibSelect';

    if(this.madlibNames.length == 0){
      this.madlibNames = Object.keys(this.madlibList);
    }
  }

  handlePlay(selection){
    //wipe form
    this.madlibForm = this.fb.group({});

    this.display = 'play';
    
    let myItem: madLib = this.madlibList[selection];

    this.madlibTemplate = myItem.text;

    this.hints = myItem.hints.split(',');

    this.hints.forEach((hint, index) => {
      this.madlibForm.addControl("word"+index, this.fb.control(""));
    });
  }

  getJSONData(url: string) {
    this.http.get(url, { responseType: 'text' })
      .subscribe(json => {
          const modified = "{" + json + "}";
          const result = JSON.parse(modified);
          this.madlibList = result;

          //this feels weird to have this here, but it needs to only run after the
          //json response has been received
          if(this.paramValue){
            this.handlePlay(this.paramValue);
            this.display = 'play';
          }
        });
  }

  handleWrite(){
    this.display = 'write';
  }

  handleBack(){
    this.display = 'options';
    this.fillOut = "one";
    this.initialView = true;
    if(this.paramValue){
      this.paramValue = null;
      //set the url back to base url
      this.router.navigate([], {
        queryParams: null,
        replaceUrl: true,
        relativeTo: this.route
      });
    }
  }

  handleSubmit(){
    this.hints.forEach((hint, index) => {
      const replacingWord: string = this.madlibForm.get("word"+index).value;
      this.madlibTemplate = this.madlibTemplate.replace("FLAGOINK", '<b>'+replacingWord+'</b>');
    })

    this.fillOut = "two";
    this.hide = false;
    this.opacity = 1;

    setTimeout(() => {
      this.opacity = 0;
    }, 100);

    setTimeout(() => {
      this.hide = true;
    }, 1100);
  }

  getOpacity(){
    return this.opacity;
  }

  more(){
    this.initialView = false;
  }

  onTextAreaClick(event: MouseEvent) {
    this.textarea = event.target as HTMLTextAreaElement;
    const cursorPosition: number = this.textarea.selectionStart;
    const textContent: string = this.textarea.value;

    this.clickedWord = this.getWordAtPosition(textContent, cursorPosition);
    //TODO: make it so that if you click beside a word it doesn't open the dialog
    //TODO: make it so that if you click a word next to punctuation, it doesn't eat the punctuation
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

  showWordTool(word): void{
    const dialogRef = this.dialog.open(WordToolComponent, {
      width: '78vw',
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

  replaceWordAfterIndex(text, index, oldWord, newWord) {
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
      width: '75vw',
      data: {
        text: cleanText,
      },
      disableClose: false,
      autoFocus: false,
    });
  }

  decideTooltipText(hint){

    switch (hint) {
      case 'ADJECTIVE':
        return "An adjective is a word that describes. ex: big, cold, shiny, golden, delicious";
      case 'NOUN':
        return "A noun is a thing. ex: monkey, tree, laser gun, pumpkin pie, 1989 Toyota MR2";
      case 'VERB':
        return "A verb is an action. ex: run, jump, think, talk, skate";
      case 'ADVERB':
        return "An adverb is a word that describes how an action is done. ex: sneakily, wonderfully, quickly, loudly, majestically";
      case 'LOCATION':
        return "A place. ex: poolside, the park, Publix, town hall, hell itself";
      case 'PLACE':
        return "A location. ex: poolside, the park, Publix, town hall, hell itself";
      case 'CELEBRITY':
        return "A famous person. ex: Elvis Presley, LeBron James, Tom Cruise, Post Malone";
      case 'COLOR':
        return "A hue on the visible light spectrum. ex: red, purple, chartreuse, lavender, lincoln green";
      case 'SUPERLATIVE':
        return "A word that describes something TO THE MAX. ex: coolest, best, stupidest, strongest, stinkiest";
      case 'NAME-CALLING NAME':
        return "A name to call someone to demean them. ex. jabrony, poo-poo head, dingus, fart-sniffer";
      case 'PLURAL NOUN':
        return "More than one thing. ex: puppies, pizza slices, couches, geniuses";
      case 'YEAR':
        return "A year that could be past, present, or future. ex. 1989, 2025, 2077";
      case 'NONSENSE':
        return "A bizarre or silly word or non-word. ex. asdfghjkl, temper-winkle, beezlebub, yickidy-dee yickidy-dah, bingo-bango, labubu";
      case 'GREETING':
        return "A word to start a dialogue. ex. welcome, hello, whassup, hail, ahoy";
      case 'BODY PART':
        return "A part of the body. ex. hand, foot, nose, elbow, butt";
      case 'ANIMAL':
        return "A concious life-form found on Earth. ex. dog, horse, chipmunk, salmon, eagle"
      default:
        return "I don't know";
    }
    
  }

  toggleTooltip(tooltip: MatTooltip): void {
    tooltip.show();
  }
}
