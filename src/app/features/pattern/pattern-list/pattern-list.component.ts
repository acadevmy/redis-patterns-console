import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Pattern } from '@app/shared/models/pattern.interface';

@Component({
  selector: 'tr-pattern-list',
  templateUrl: './pattern-list.component.html',
  styleUrls: ['./pattern-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatternListComponent {
  @Input() patterns$: Observable<Pattern[]>;
  @Output() selected = new EventEmitter<Pattern>();
  current: Pattern;

  select(pattern: Pattern) {
    this.current = pattern;
    this.selected.emit(pattern);
  }
}
