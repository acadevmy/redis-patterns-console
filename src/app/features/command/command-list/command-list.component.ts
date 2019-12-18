import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';

import { Command } from '@app/shared/models/command.interface';

@Component({
  selector: 'tr-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandListComponent {
  filteredCommands: Array<Command> = [];
  categories: Array<string> = [];
  activeCommand: Command;
  activeCategory = '';

  @ViewChild('scrollBox', {static: true}) scrollBox: ElementRef;
  @Input('commands') set setCommands(data: Array<Command>) {
    this.filteredCommands = data;
    const array = this.filteredCommands.map(item => item.group);
    array.push('');
    this.categories = Array.from(new Set(array)).sort();
  }

  @Input('activeCommand') set currentCommand(data: Command) {
    if (data) {
      this.activeCommand = data;
      this.setActiveCategory(data.group);
    }
  }

  @Output() selected = new EventEmitter<string>();
  @Output() writeCommand = new EventEmitter<string>();

  /**
   * Emits an event when a command is selected from command list box.
   * @param command name of selected command
   */
  select(command: Command) {
    this.activeCommand = command;
    this.selected.emit(this.activeCommand.key);
  }

  /**
   * Emits an event when command relative "input" icon is selected
   * @param command name of realtive command
   */
  writeToCommandLine(command: Command) {
    this.select(command);
    this.writeCommand.emit(this.activeCommand.key);
  }

  /**
   * Set as current category the one is selected.
   * @param category category name
   */
  setActiveCategory(category: string) {
    this.scrollBox.nativeElement.scrollTop = 0;
    this.activeCategory = category;
  }
}
