import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CommandModule } from './features/command/command.module';
import { PatternModule } from './features/pattern/pattern.module';

import { AppComponent } from '@app/app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    CommandModule,
    PatternModule,
    RouterModule.forRoot([]),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
