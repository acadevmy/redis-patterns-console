import {ChangeDetectionStrategy, Component, Input, EventEmitter, Output} from '@angular/core';

import {Output as OutputItf} from '@app/shared/models/response.interface';

@Component({
  selector: 'tr-command-output',
  templateUrl: './command-output.component.html',
  styleUrls: ['./command-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandOutputComponent {
  @Input() commandsOutput: Array<OutputItf> = [];
  @Output()
  clearEvt: EventEmitter<void> = new EventEmitter<void>();

  clear(): void {
    this.clearEvt.emit();
  }
}
