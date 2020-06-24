import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { allowedCommandValidator } from './command-line.validator';
import { Command } from '@app/shared/models/command.interface';

@Component({
  selector: 'tr-command-line',
  templateUrl: './command-line.component.html',
  styles: [
    `
      .input-group-text {
        background: white;
        font-size: .9em;
      }

      .form-control {
        font-size: .9em;
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
    if (data == undefined) return;
    
    this.commandLine.setValue(data);
    this.commandLine.markAsDirty();
  }

  @Input('reset') set resetCommandLine(data: number) {
    if (!data) return;

    this.commandLine.reset();
  }

  @Output() detectCommand: EventEmitter<string> = new EventEmitter();
  @Output() execute: EventEmitter<string> = new EventEmitter();

  /**
   * Init command line input text with its validator
   * and start to observe its value changes.
   */
  ngOnInit() {
    this.commandLine = new FormControl('', this.commandLineValidators);
    this.detectCommandOnValidValueSet();
  }

  /**
   * Emits a detectCommand event on a valid command value emission
   */
  detectCommandOnValidValueSet() {
    this.validCommand$.subscribe((value) => this.detectCommand.emit(value));
  }

  get commandLineValidators() {
    return [
      Validators.required,
      allowedCommandValidator(this.allowedCommands)
    ];
  }

  /** 
   * Returns a valid command line value observable
   */
  get validCommand$() {
    return this.commandLine.valueChanges.pipe(
      debounceTime(200),
      filter(() => this.commandLine.valid),
      map((value) => value.split(' ')[0]),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if is a valid command and emits event for it execution,
   * and add it to commands history, finally reset command line input.
   * @param command the command that should be execute
   */
  executeCommand(command: string) {
    if (this.commandLine.invalid) return;

    command = command.trim();
    const isNewCommand = this.commandsHistory[0] !== command;

    this.emitExecEvent(command);
    
    if (isNewCommand) {
      this.addCommandToHistory(command);
    }

    this.resetCommandHistory();
  }

  /**
   * Emits the execute event
   * @param command The command to be executed
   */
  emitExecEvent(command: string) {
    this.execute.emit(command);
  }

  /**
   * Adds a command at the start of the commands history array
   * @param command The command to be added
   */
  addCommandToHistory(command: string) {
    this.commandsHistory.unshift(command);
  }

  /**
   * Resets history cursor and command line to the default value
   */
  resetCommandHistory() {
    this.commandsHistoryCursor = 0;
    this.commandLine.reset();
  }

  /**
   * Implements command input history on keyboard arrow up/down press event
   * @param event a keyboard event
   */
  getHistory(event: KeyboardEvent) {
    let historyCommand: string;
    const hasHistory = this.commandsHistory.length > 0;
    const canBrowseUpHistory = this.commandsHistory.length > this.commandsHistoryCursor;
    const isHistoryBrowsedUp = this.commandsHistoryCursor > 0;
    
    switch (event.key) {
      case 'ArrowUp': {
        if (!hasHistory || !canBrowseUpHistory) break;

        historyCommand = this.commandsHistory[this.commandsHistoryCursor++];
        this.commandLine.setValue(historyCommand);
        break;
      }

      case 'ArrowDown': {
        if (!hasHistory || !isHistoryBrowsedUp) {
          this.resetCommandHistory();
          break;
        }
      
        historyCommand = this.commandsHistory[--this.commandsHistoryCursor];
        this.commandLine.setValue(historyCommand);
      }
    }
  }
}
