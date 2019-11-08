import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tr-command-documentation',
  templateUrl: './command-documentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandDocumentationComponent {
  @Input() documentation = '';
}
