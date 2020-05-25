import { Component, EventEmitter, HostListener, Input, Output, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';

import { Pattern } from '@app/shared/models/pattern.interface';

enum Paginator {
  FIRST_PAGE,
  PREVIOUS_PAGE,
  NEXT_PAGE,
  LAST_PAGE
}
@Component({
  selector: 'tr-pattern-content',
  templateUrl: './pattern-content.component.html',
  styleUrls: ['./pattern-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatternContentComponent {
  @ViewChild('scrollBox') scrollBox: ElementRef;
  @Input('patternContent') set newStep(data: Array<string>) {
    this.resetScroll();
    this.steps = data;
    this.currentStep = 0;
  }
  @Input() activePattern: Pattern;
  @Output() help = new EventEmitter<string>();
  @Output() run = new EventEmitter<string>();

  currentStep: number;
  steps: Array<string>;
  paginator = Paginator;

  /**
   *  On click occurs emits run or help event based on elemnt target hash
   */
  @HostListener('click', ['$event'])
    onClick(targetElement) {
      if (targetElement.target.nodeName !== 'A') {
        return;
      }

      const command = targetElement.target.innerText;
      if (targetElement.target.hash === '#run') {
        this.run.emit(command);
      } else {
        this.help.emit(command);
      }
    }

  /**
   * Navigate to new page of pattern
   * @param type boolean (TRUE: previous step, FALSE: next step)
   */
  changeStep(type: Paginator) {
    this.resetScroll();

    switch (type) {
      case Paginator.FIRST_PAGE:
        this.currentStep = 0;
        break;
      case Paginator.PREVIOUS_PAGE:
        this.currentStep--;
        break;
      case Paginator.NEXT_PAGE:
          this.currentStep++;
          break;
      case Paginator.LAST_PAGE:
        this.currentStep = this.steps.length - 1;
    }
  }

  private resetScroll() {
    if (this.scrollBox) {
      this.scrollBox.nativeElement.scrollTop = 0;
    }
  }
}
