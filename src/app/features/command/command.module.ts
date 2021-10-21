import { CommandDocumentationComponent } from './command-documentation/command-documentation.component';
import { CommandLineComponent } from './command-line/command-line.component';
import { CommandListComponent } from './command-list/command-list.component';
import { CommandOutputComponent } from './command-output/command-output.component';
import { CommandSummaryComponent } from './command-summary/command-summary.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    CommandDocumentationComponent,
    CommandLineComponent,
    CommandListComponent,
    CommandSummaryComponent,
    CommandOutputComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [
    CommandDocumentationComponent,
    CommandLineComponent,
    CommandListComponent,
    CommandSummaryComponent,
    CommandOutputComponent
  ]
})
export class CommandModule {}
