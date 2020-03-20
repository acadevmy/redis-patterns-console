import { Component, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';
import { environment } from '@app/../environments/environment';

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
  version = environment.version;
  loginUrl = environment.loginFlowStart + environment.githubAppClientId;
  isLogged: boolean;
  @Input('isAuth') set islogged(data: boolean) {
    this.isLogged = data;
    this.changeDetectorRef.detectChanges();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detach();
  }
}
