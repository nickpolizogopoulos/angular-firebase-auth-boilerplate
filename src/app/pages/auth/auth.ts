import {
    Component,
    inject,
    signal,
    viewChild,
    effect
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
        RouterLink
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
            <form #form="ngForm" (ngSubmit)="onSubmit(form)">
                @let emailIsInvalid = !email.valid && email.touched;
                @let passwordIsInvalid = !password.valid && password.touched;

                <div>
                    <input [class.is-invalid]="emailIsInvalid" type="text" placeholder="Email" name="email" #email="ngModel" required email ngModel>
                    @if (emailIsInvalid) {
                        <p class="form-error">Email is required.</p>
                    }
                </div>
                <div>
                    <input [class.is-invalid]="passwordIsInvalid" type="password" placeholder="Password" name="password" #password="ngModel" required minlength="6" ngModel>
                    @if (passwordIsInvalid) {
                        <p class="form-error">A password of at least 6 characters is required.</p>
                    }
                </div>
                <div>
                    <button [disabled]="!form.valid" type="submit">
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

    constructor() {
        if (this.#authService.isAuthenticated())
            this.#router.navigate(['/']);
    };

    protected onSwitchModeAndCloseAlert(): void {
        this.onSwitchMode();
        this.onCloseAlert();
    };

    private readonly form = viewChild.required<NgForm>('form');
    public onSwitchMode(): void {
        this.isLoginMode.update(value => !value);
        this.form().reset();
    };

    #authenticate(email: string, password: string): Observable<AuthResponse> {
        return this.isLoginMode()
            ? this.#authService.login(email, password)
            : this.#authService.signup(email, password);
    };

    public onSubmit(form: NgForm): void {
        if (!form.valid) return;

        this.loading.set(true);
        this.error.set(null);
        
        this.#authenticate(form.value.email, form.value.password)
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