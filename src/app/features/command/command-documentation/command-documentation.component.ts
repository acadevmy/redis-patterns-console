import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'tr-command-documentation',
  templateUrl: './command-documentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandDocumentationComponent {
  public documentation = '';
  @ViewChild('scrollBox', {static: true}) scrollBox: ElementRef;
  @Input('documentation') set resetScroll(document: string) {
    this.documentation = document;
    this.scrollBox.nativeElement.scrollTop = 0;
  }
}
