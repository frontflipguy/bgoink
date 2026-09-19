import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-main-pane',
    templateUrl: './main-pane.component.html',
    styleUrls: ['./main-pane.component.scss'],
    standalone: false
})
export class MainPaneComponent {
  widget = "/";

  constructor(
    private router: Router,
  ){}

  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((thing: NavigationEnd) => {
        this.widget = thing.urlAfterRedirects;
    })
  }
}
