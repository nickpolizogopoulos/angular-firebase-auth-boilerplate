import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import {
    catchError,
    EMPTY,
    finalize,
    Observable,
    tap
} from 'rxjs';

import { LoadingSpinner } from '../../components/loading-spinner';
import { AuthResponse } from '../../models/auth';
import { AuthService } from '../../services/auth';

@Component({
    imports: [
        LoadingSpinner,
        FormsModule,
        RouterLink,
        FormField
    ],
    template: `

        @if (error()) {
            <div>
                <h3>Error {{ isLoginMode() ? 'Logging in' : 'Signing up' }}:</h3>
                <p class="text-error">{{ error() }}</p>
                <button (click)="onCloseAlert()">clear error</button>
            </div>
        }
        @if (loading()) {
            <h3>{{ isLoginMode() ? 'Logging in...' : 'Signing up...' }}</h3>
             <span loader></span>
        }
        @else {
            <h3>{{ isLoginMode() ? 'Login' : 'Sign Up' }}</h3>
            <form (ngSubmit)="onSubmit()">
                
                @let email = form.email();
                @let emailIsInvalid = email.invalid() && email.touched();
                <div>
                     <input [formField]="form.email" type="text" placeholder="Email" />
                    @if (emailIsInvalid) {
                        @for (error of email.errors(); track error) {
                            <p class="form-error">{{ error.message }}.</p>
                        }
                    }
                </div>

                @let password = form.password();
                @let passwordIsInvalid = password.invalid() && password.touched();
                <div>
                     <input [formField]="form.password" type="password" placeholder="Password" />
                    @if (passwordIsInvalid) {
                        @for (error of password.errors(); track error) {
                            <p class="form-error">{{ error.message }}.</p>
                        }
                    }
                </div>
                <div>
                    <button [disabled]="form().invalid()" type="submit">
                        {{ isLoginMode() ? 'Login' : 'Sign Up' }}
                    </button>
                    <span class="text">
                        {{ isLoginMode() ? 'Need an account?' : 'Already have an account?'}}
                        <button type="button" (click)="onSwitchModeAndCloseAlert()">
                            {{ isLoginMode() ? 'Sign Up' : 'Login' }}
                        </button>
                    </span>
                </div>
            </form>
        }
        <div style="padding-top: .7rem;">
            Forgot your password? You can
            <a routerLink="/password-reset">reset</a> it.
        </div>
    `
})
export class Auth {
    readonly #authService = inject(AuthService);
    readonly #router = inject(Router);

    protected readonly isLoginMode = signal<boolean>(true);
    protected readonly loading = signal<boolean>(false);
    protected readonly error = signal<string | null>(null);

    readonly #formModel = signal({ email: '', password: '' });

    protected readonly form = form(this.#formModel, path => {
        required(path.email, { message: 'Email is required' });
        email(path.email, { message: 'Enter a valid email address' });
        required(path.password, { message: 'Password is required' })
        minLength(path.password, 6, { message: 'Password must be at least 6 characters long' })
    });

    protected onSwitchModeAndCloseAlert(): void {
        this.onSwitchMode();
        this.onCloseAlert();
    };

    public onSwitchMode(): void {
        this.isLoginMode.update(value => !value);
        this.form().reset();
    };

    #authenticate(): Observable<AuthResponse> {
        const { email, password } = this.form().value();

        return this.isLoginMode()
            ? this.#authService.login(email, password)
            : this.#authService.signup(email, password);
    };

    public onSubmit(): void {
        if (this.form().invalid()) return;

        this.loading.set(true);
        this.error.set(null);
        
        this.#authenticate()
            .pipe(
                tap(() => this.#router.navigate(['/'])),
                catchError(error => {
                    this.error.set(error);
                    return EMPTY;
                }),
                finalize(() => this.loading.set(false))
            )
            .subscribe();
    };

    protected onCloseAlert(): void {
        this.error.set(null);
    };
}