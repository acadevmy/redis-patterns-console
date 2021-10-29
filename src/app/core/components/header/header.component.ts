import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
        color: white;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  title = 'Redis Patterns Console';

  version = environment.version;

  loginUrl = environment.loginFlowStart + environment.githubAppClientId;

  @Input('isAuth') isLogged: boolean;

}
