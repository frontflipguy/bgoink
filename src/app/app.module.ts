import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloWorldComponent } from 'src/hello-world/hello-world.component';
import { MainPaneComponent } from 'src/main-pane/main-pane.component';
import { MadLibComponent } from 'src/main-pane/mad-lib/mad-lib.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WordToolComponent } from 'src/main-pane/mad-lib/word-tool/word-tool.component';
import { SuccessComponent } from 'src/main-pane/mad-lib/success/success.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    MainPaneComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCheckboxModule,
    MadLibComponent,
    WordToolComponent,
    SuccessComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
