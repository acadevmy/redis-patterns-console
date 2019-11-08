import { Pipe, PipeTransform } from '@angular/core';

import { markdown } from 'markdown';

@Pipe({
  name: 'markdown'
})

export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    return value ? markdown.toHTML(value) : value;
  }
}
