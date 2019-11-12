import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tr-header',
  templateUrl: './header.component.html',
  styles: [
    `
      :host {
        background: #222;
        color: white;
        padding: 1rem;
      }

      a {
        color:white;
      }
    `
  ]
})
export class HeaderComponent implements AfterViewInit {
  title = 'Redis Patterns Console';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detach();
  }
}
