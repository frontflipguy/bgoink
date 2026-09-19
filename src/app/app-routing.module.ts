import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MadLibComponent } from 'src/main-pane/mad-lib/mad-lib.component';
import { AppComponent } from './app.component';
import { FlashcardsComponent } from 'src/main-pane/flashcards/flashcards.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/madlib', pathMatch: 'full' }, //Temporary only! Later when I have more games, there will be a menu and the user can select madlib or something else
  { path: '', component: AppComponent },
  { path: 'madlib', component: MadLibComponent },
  { path: 'madlib/play', component: MadLibComponent },
  { path: 'madlib/play?value*', component: MadLibComponent },
  { path: 'madlib/write', component: MadLibComponent },
  { path: 'flashcards', component: FlashcardsComponent },
  { path: '**', redirectTo: '/index.html', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
