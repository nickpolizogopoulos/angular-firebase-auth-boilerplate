import {
    Component,
    inject,
    signal
} from '@angular/core';
import {
    FormsModule,
    NgForm
} from '@angular/forms';
import {
    Router,
    RouterModule
} from '@angular/router';
import {
    catchError,
    EMPTY,
    finalize,
    tap
} from 'rxjs';

import { LoadingSpinner } from "../components/loading-spinner";
import { AuthService } from '../services/auth';
import { PasswordReset as PasswordResetService } from '../services/password-reset';
  
@Component({
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        LoadingSpinner
    ],
    template: `

        @if (isLoading()) {
            <h3 class="mb-3">Sending email...</h3>
            <span loader></span>
        }
        <!-- @if (errorMessage()) {
            <p class="text-error">{{ errorMessage() }}</p>
        } -->
        @if (!isLoading() && !alert()) {
            <h3>{{ isAuthenticated ? 'Password Reset' : 'Find Your Account' }}</h3>
            <p>
                {{
                    isAuthenticated
                    ? "Enter your email below and follow the instructions we will send to your inbox to reset your password."
                    : "Enter your email below to locate your account and proceed with password recovery."
                }}
            </p>
            
            <form #form="ngForm" (ngSubmit)="onSubmit(form)">
                @let emailIsInvalid = !email.valid && email.touched;

                <div>
                    <input [class.is-invalid]="emailIsInvalid" type="text" placeholder="Email" name="email" #email="ngModel" required email [ngModel]="userEmail">
                    @if (emailIsInvalid) {
                        <p class="text-error form-error">Email is required.</p>
                    }
                </div>
                <div style="display: flex; gap: .4rem;">
                    <button type="submit" [disabled]="!form.valid">Submit</button>
                    <button routerLink="/">Cancel</button>
                </div>
            </form>
        }
        @if (alert()) {
            <p>A password reset request has been sent, check your email!</p>
            <p>Check your spam emails as well!</p>
            <button routerLink="/">Back</button>
        }
    `
})
export class PasswordReset {
    readonly #router = inject(Router);
    readonly #passResetService = inject(PasswordResetService);
    readonly #authService = inject(AuthService);

    readonly userEmail = this.#authService.userEmail();

    protected readonly isAuthenticated = this.#authService.isAuthenticated();
    protected readonly isLoading = signal<boolean>(false);
    protected readonly errorMessage = signal<string | null>(null);
    protected readonly alert = signal<boolean>(false);

    onSubmit(form: NgForm): void {
        if (!form.valid) return;

        this.isLoading.set(true);

        this.#passResetService
            .reset(form.value.email.toLowerCase())
            .pipe(
                tap(() => {
                    this.alert.set(true);
                    setTimeout(() => this.#router.navigate(['/login']), 2400);
                }),
                catchError(error => {
                    this.errorMessage.set(error);
                    return EMPTY;
                }),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe();
    };

    // onCloseAlert(): void {
    //   this.errorMessage.set(null);
    // };
}