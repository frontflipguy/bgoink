import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';


@Component({ 
  selector: 'app-mad-lib',
  templateUrl: './mad-lib.component.html',
  styleUrls: ['./mad-lib.component.scss'],
})
export class MadLibComponent {
  display = '/madlib';

  constructor(
    private router: Router,
  ){}

  ngOnInit(){
    console.log(window.location)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((thing: NavigationEnd) => {
        this.display = thing.urlAfterRedirects;

    })
  }
}
