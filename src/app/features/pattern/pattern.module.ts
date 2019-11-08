import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { PatternListComponent } from './pattern-list/pattern-list.component';
import { PatternContentComponent } from './pattern-content/pattern-content.component';

@NgModule({
  declarations: [
    PatternListComponent,
    PatternContentComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PatternListComponent,
    PatternContentComponent
  ]
})
export class PatternModule { }
