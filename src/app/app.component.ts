import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Output } from '@app/shared/models/response.interface';
import { Pattern } from '@app/shared/models/pattern.interface';
import { CommandService } from '@app/core/services/command.service';
import { PatternService } from '@app/core/services/pattern.service';
import { RedisConnectService } from '@app/core/services/redis-connect.service';

@Component({
  selector: 'tr-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  responses: Output[] = [];
  selectedDoc: string;
  activePattern: Pattern;
  newCommandForInput: string;
  resetCommand$: Observable<number> = this.redisConnectService.execCommandTime$;

  constructor(
    public commandService: CommandService,
    public patternService: PatternService,
    private redisConnectService: RedisConnectService) {
      this.redisConnectService.response$.subscribe((response: Output) => this.updateResponses(response));
    }

  /**
   * Set current command as the active one
   * @param command String
   */
  selectActiveCommand(command: string) {
    this.commandService.activeCommand = command;
  }

  /**
   * Write command on text input
   * @param command String
   */
  writeCommand(command: string) {
    this.newCommandForInput = command;
    this.selectActiveCommand(command);
  }

  /**
   * Set new active pattern
   * @param pattern pattern
   */
  selectPattern(pattern: Pattern) {
    this.activePattern = pattern;
    this.patternService.activePattern = pattern;
  }

  /**
   * Send command to server and update responses
   * @param commandString String
   */
  runCommand(commandString: string) {
    const newCommand: Output = {valid: true, output: commandString.toUpperCase(), type: 'command'};
    this.updateResponses(newCommand);
    this.redisConnectService.send(commandString);
    const [first, ...second] = commandString.split(' ');
    this.selectActiveCommand(first);
  }

  private updateResponses(command: Output) {
    const commands = [];
    Object.assign(commands, [...this.responses, command]);
    this.responses = commands;
  }
}
