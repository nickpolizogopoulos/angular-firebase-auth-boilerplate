import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { AuthService } from "../services/auth";

@Component({
    imports: [RouterLink],
    template: `
    
        <h1 class="text-green">You are logged in!</h1>
        <p>User: {{ userEmail() }}</p>
        <p>The app won't let you navigate back to the login page once authenticated.</p>

        <div style="display: flex; flex-direction: row; gap: 1rem;">    
            <button routerLink="login">Go to Login</button>
            <button (click)="onLogout()">Logout</button>
            <button routerLink="password-reset">Password Reset</button>
        </div>
    `
})
export class Home {
    readonly #authService = inject(AuthService);
    protected readonly userEmail = this.#authService.userEmail;

    protected onLogout(): void {
        this.#authService.logout();
    };
}