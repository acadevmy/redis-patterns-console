import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Output } from '@app/shared/models/response.interface';

@Component({
  selector: 'tr-command-output',
  templateUrl: './command-output.component.html',
  styleUrls: ['./command-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandOutputComponent {
  @Input() commandsOutput: Array<Output> = [];
}
