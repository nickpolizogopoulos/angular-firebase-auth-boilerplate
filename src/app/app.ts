import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../app/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
  
    <router-outlet />
  
  `,
})
export class App implements OnInit {

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  constructor() {
    console.log(
      `%cA boilerplate project for setting up Firebase Authentication in an Angular Application. This repo provides a ready-to-use authentication system with Firebase, including user sign-up, login, logout and password reset functionalities.`,
      `font-size: 15px; font-weight: bold; color: green;`
    );
  }

}
