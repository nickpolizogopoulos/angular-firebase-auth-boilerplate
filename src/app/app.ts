import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../app/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class App {
  readonly #authService = inject(AuthService);

  constructor() {
    this.#authService.autoLogin();
    console.log(`%cAngular v21.1.0`,`font-size: 15px; font-weight: bold; color: orangered;`);
    console.log(
      '%cA boilerplate project for setting up Firebase Authentication in an Angular Application. This repo provides a ready-to-use authentication system with Firebase, including user sign-up, login, logout and password reset functionalities.',
      'font-size: 15px; font-weight: bold; color: green;'
    );
  }; 
}