import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandDocumentationComponent } from './command-documentation/command-documentation.component';
import { CommandLineComponent } from './command-line/command-line.component';
import { CommandListComponent } from './command-list/command-list.component';
import { CommandOutputComponent } from './command-output/command-output.component';
import { CommandSummaryComponent } from './command-summary/command-summary.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommandDocumentationComponent,
    CommandLineComponent,
    CommandListComponent,
    CommandSummaryComponent,
    CommandOutputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    CommandDocumentationComponent,
    CommandLineComponent,
    CommandListComponent,
    CommandSummaryComponent,
    CommandOutputComponent
  ]
})
export class CommandModule { }
