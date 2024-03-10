import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';


import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideClientHydration(),
     {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '878958543895-jvesiqudtoi4iaf3kfjjaaipqh51b164.apps.googleusercontent.com'
            )
          }
        ],
        onError: (error) => {
          console.error(error);
        }
      } as SocialAuthServiceConfig},
        
  ]
};
