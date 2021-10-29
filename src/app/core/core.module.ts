import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CacheInterceptor } from './interceptors/cache-interceptor';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { HeaderComponent } from '@app/core/components/header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [HttpClientModule, CommonModule],
  exports: [HeaderComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => {
        return () => configService.init();
      },
      deps: [ConfigService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
