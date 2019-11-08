import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Command } from '@app/shared/models/command.interface';

@Component({
  selector: 'tr-command-summary',
  templateUrl: './command-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandSummaryComponent {
  @Input() command: Command;
}
