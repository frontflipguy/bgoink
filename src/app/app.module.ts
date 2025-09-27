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
import { PlayComponent } from 'src/main-pane/mad-lib/play/play.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { WriteComponent } from 'src/main-pane/mad-lib/write/write.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    MainPaneComponent,
    MadLibComponent,
    PlayComponent,
    WriteComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCheckboxModule,
    WordToolComponent,
    SuccessComponent,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    MatButtonToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
