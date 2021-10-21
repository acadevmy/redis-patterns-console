import { AppComponent } from '@app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommandModule } from './features/command/command.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { PatternModule } from './features/pattern/pattern.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
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
export class AppModule {}
