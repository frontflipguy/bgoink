import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MadLibComponent } from 'src/main-pane/mad-lib/mad-lib.component';

const routes: Routes = [
  { path: '', redirectTo: '/madlib', pathMatch: 'full' }, //Temporary only! Later when I have more games, there will be a menu and the user can select madlib or something else
  { path: 'madlib', component: MadLibComponent },
  { path: 'madlib/play', component: MadLibComponent },
  { path: 'madlib/play?value*', component: MadLibComponent },
  { path: 'madlib/write', component: MadLibComponent },
  { path: '**', redirectTo: '/index.html', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
