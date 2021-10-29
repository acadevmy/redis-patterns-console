import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PatternContentComponent } from './pattern-content/pattern-content.component';
import { PatternListComponent } from './pattern-list/pattern-list.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [PatternListComponent, PatternContentComponent],
  imports: [CommonModule, SharedModule],
  exports: [PatternListComponent, PatternContentComponent]
})
export class PatternModule {}
