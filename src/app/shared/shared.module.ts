import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownPipe } from './pipes/markdown.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';

@NgModule({
  declarations: [
    MarkdownPipe,
    SearchFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MarkdownPipe,
    SearchFilterPipe
  ]
})
export class SharedModule { }
