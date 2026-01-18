import { 
    Component, 
    DestroyRef, 
    inject, 
    OnInit, 
    signal, 
    viewChild
} from '@angular/core';
import { 
    FormsModule,
    NgForm
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { LoadingSpinner } from '../../components/loading-spinner';
import { AuthService } from '../../services/auth';
import { AuthResponse } from '../../models/auth';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [
        LoadingSpinner,
        FormsModule,
        RouterLink
    ],
    template: `

        @if (errorMessage()) {
            <div>
                <span>Error {{ isLoginMode() ? 'Logging in' : 'Signing up' }}:</span>
                <p>{{ errorMessage() }}</p>
                <button (click)="onCloseAlert()">close</button>
            </div>
        }
        @if (isLoading()) {
            <h3>{{ isLoginMode() ? 'Logging in...' : 'Signing up...' }}</h3>
            <app-loading-spinner />
        }
        @else {
            <h3>{{ isLoginMode() ? 'Login' : 'Sign Up' }}</h3>
            <form #form="ngForm" (ngSubmit)="onSubmit(form)">
                @let emailIsInvalid = !email.valid && email.touched;
                @let passwordIsInvalid = !password.valid && password.touched;

                <div>
                    <input [class.is-invalid]="emailIsInvalid" type="text" placeholder="Email" name="email" #email="ngModel" required email ngModel>
                    @if (emailIsInvalid) {
                        <div>Email is required.</div>
                    }
                </div>
                <div>
                    <input [class.is-invalid]="passwordIsInvalid" type="password" placeholder="Password" name="password" #password="ngModel" required minlength="6" ngModel>
                    @if (passwordIsInvalid) {
                        <div>A password of at least 6 characters is required.</div>
                    }
                </div>
                <div>
                    <button [disabled]="!form.valid" type="submit">
                        {{ isLoginMode() ? 'Login' : 'Sign Up' }}
                    </button>
                    <span>
                        {{ isLoginMode() ? 'Need an account?' : 'Already have an account?'}}
                        <button type="button" (click)="onSwitchMode()" (click)="onCloseAlert()">
                            {{ isLoginMode() ? 'Sign Up' : 'Login' }}
                        </button>
                    </span>
                </div>
            </form>
        }
        <hr>
        <div>
            Forgot your password? You can
            <a routerLink="/password-reset">reset</a>
            it.
        </div>
    `
})
export class Auth implements OnInit {

    private authService = inject(AuthService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    private isAuthenticated = signal<boolean>(false);
    private form = viewChild.required<NgForm>('form');

    isLoginMode = signal<boolean>(true);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.authService.user
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: user => {
                    this.router.navigate(['/']);
                    this.isAuthenticated.set(!!user);
                }
            });
    }

    onSwitchMode(): void {
        this.isLoginMode.update(value => !value);
        this.form()?.reset();
    }

    onSubmit(form: NgForm): void {
        
        this.isLoading.set(true);
        this.errorMessage.set(null);

        if (!form.valid) return;

        const email = form.value.email;
        const password = form.value.password;
        
        let authObservable: Observable<AuthResponse>;

        if (this.isLoginMode())
            authObservable = this.authService.login(email, password);
        else
            authObservable = this.authService.signup(email, password);

        authObservable
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.errorMessage.set(null);
                    this.router.navigate(['/']);
                },
                error: responseError => {
                    this.isLoading.set(false)
                    this.errorMessage.set(responseError);        
                }
            });

        this.form()?.reset();
    }

    onCloseAlert(): void {
        this.errorMessage.set(null);
    }

}