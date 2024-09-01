import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ConfigService } from './services/config/config.service';
import { ConfigItem } from './models/frontend';
import { provideHttpClient } from '@angular/common/http';

//
export function configInitializer(configService: ConfigService) {
  return () =>
    configService.loadConfig().subscribe((res: ConfigItem) => {
      configService.setConfig(res);
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializer,
      multi: true,
      deps: [ConfigService],
    },
  ],
};
