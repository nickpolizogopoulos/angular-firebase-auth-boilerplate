import {
    Component,
    inject
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { AuthService } from "./auth/auth.service";

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [
        RouterLink
    ],
    template: `
    
        <h1>You are logged in.</h1>
        <p>The app won't let you navigate back to the login page once authenticated.</p>

        <div style="display: flex; flex-direction: row; gap: 1rem;">    
            <button routerLink="login">Go to Auth</button>
            <button (click)="onLogout()">Logout</button>
            <button routerLink="password-reset">Password Reset</button>
        </div>

    `
})
export class HomeComponent {

    private authService = inject(AuthService);

    onLogout(): void {
        this.authService.logout();
    }

}