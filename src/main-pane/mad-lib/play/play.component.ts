import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { madLib } from '../mad-lib-object';
import { HttpClient } from '@angular/common/http';
import { tooltipObject } from '../tooltip-object';
import { MatTooltip } from '@angular/material/tooltip';
import { filter } from 'rxjs';

@Component({ 
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss'],
  })

export class PlayComponent {
    initialView = true;
    fillOut = "one";
    paramValue = null;
    madlibNames = [];
    madlibList;
    madlibForm = this.fb.group({});
    madlibTemplate = "";
    hints: string[] = [];
    opacity = 1;
    hide = false;
    reveal = false;

    constructor(
        private readonly fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ){}

    ngOnInit(){
        
        this.getJSONData('/assets/madlibs.txt');

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
          ).subscribe((thing: NavigationEnd) => {
            this.handleUrl();
          })
    }

    handleUrl(){
        const urlParams = new URLSearchParams(window.location.search);
        this.paramValue = urlParams.get('value');
        if(this.paramValue){
            this.handlePlay(this.paramValue);
            this.reveal = true;
        }
    }

    getJSONData(url: string) {
        this.http.get(url, { responseType: 'text' })
          .subscribe(json => {
                const modified = "{" + json + "}";
                const result = JSON.parse(modified);
                this.madlibList = result;

                if(this.madlibNames.length == 0){
                    this.madlibNames = Object.keys(this.madlibList);
                }
                this.handleUrl();
            });
      }

    more(){
        this.initialView = false;
    }

    handleBack(){
        this.router.navigate(['/madlib']);
    }

    handlePlay(selection){
        //wipe form
        this.madlibForm = this.fb.group({});
        
        let myItem: madLib = this.madlibList[selection];
    
        this.madlibTemplate = myItem.text;
    
        this.hints = myItem.hints.split(',');
    
        this.hints.forEach((hint, index) => {
          this.madlibForm.addControl("word"+index, this.fb.control("", Validators.required));
        });
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

    decideTooltipText(hint){
        hint = hint.replaceAll(" ", "");
        hint = hint.replaceAll("-", "");
        return tooltipObject[hint] ? tooltipObject[hint] : "I don't know";
      }

    toggleTooltip(tooltip: MatTooltip): void {
        tooltip.show();
    }

    disableSubmitButton(){
        if(this.madlibForm.valid){
          return false;
        } else {
          return true;
        }
      }
    
      getColor(){
        if(this.madlibForm.valid){
          return '#bdfac5';
        } else {
          return '#8d8d8d';
        }
      }
}