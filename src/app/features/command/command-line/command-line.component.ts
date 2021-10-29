import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Command } from '@app/shared/models/command.interface';
import { allowedCommandValidator } from './command-line.validator';

@Component({
  selector: 'tr-command-line',
  templateUrl: './command-line.component.html',
  styles: [
    `
      .input-group-text {
        background: white;
        font-size: 0.9em;
      }

      .form-control {
        font-size: 0.9em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandLineComponent implements OnInit {
  commandLine: FormControl;

  commandsHistory: string[] = [];

  commandsHistoryCursor = 0;

  @Input() allowedCommands: Array<Command> = [];

  @Input() activeCommand: Command;

  @Input('writeCommand') set newCommand(data: string) {
    if (data !== undefined) {
      this.commandLine.setValue(data);
      this.commandLine.markAsDirty();
    }
  }

  @Input('reset') set resetCommandLine(data: number) {
    if (data) {
      this.commandLine.reset();
    }
  }

  @Output() detectCommand: EventEmitter<unknown> = new EventEmitter();

  @Output() execute: EventEmitter<unknown> = new EventEmitter();

  /**
   * Init command line input text with its validator
   * and start to observe its value changes.
   */
  ngOnInit(): void {
    this.commandLine = new FormControl('', [Validators.required, allowedCommandValidator(this.allowedCommands)]);
    this.commandLine.valueChanges
      .pipe(
        debounceTime(200),
        filter(() => this.commandLine.valid),
        map((value: string) => value.split(' ')[0]),
        distinctUntilChanged()
      )
      .subscribe((value) => this.detectCommand.emit(value));
  }

  /**
   * Checks if is a valid command and emits event for it execution,
   * and add it to commands history, finally reset command line input.
   * @param command the command that should be execute
   */
  executeCommand(command: string): void {
    if (this.commandLine.valid) {
      this.execute.emit(command.trim());
      this.commandsHistoryCursor = 0;

      if (this.commandsHistory[0] !== command.trim()) {
        this.commandsHistory.unshift(command.trim());
      }
      this.commandLine.reset();
    }
  }

  /**
   * Implements command input history on keyboard arrow up/down press event
   * @param event a keyboard event
   */
  getHistory(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.commandsHistory.length > 0 && this.commandsHistory.length > this.commandsHistoryCursor) {
        this.commandLine.setValue(this.commandsHistory[this.commandsHistoryCursor++]);
      }
    }

    if (event.key === 'ArrowDown') {
      if (this.commandsHistory.length > 0 && this.commandsHistoryCursor > 0) {
        this.commandLine.setValue(this.commandsHistory[--this.commandsHistoryCursor]);
      } else {
        this.commandsHistoryCursor = 0;
        this.commandLine.setValue('');
      }
    }
  }
}
