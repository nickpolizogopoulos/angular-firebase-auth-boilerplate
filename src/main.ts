import { provideHttpClient, withXhr } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { App } from './app/app';
import { routes } from './app/routes';

const config: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withXhr())
    ]
};

bootstrapApplication(App, config)
  .catch(error => console.error(error));
