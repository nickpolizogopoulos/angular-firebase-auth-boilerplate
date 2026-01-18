import {
    Component,
    DestroyRef,
    inject,
    signal
} from '@angular/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormsModule,
    NgForm
} from '@angular/forms';
import {
    Router,
    RouterModule
} from '@angular/router';

import { LoadingSpinner } from "../../components/loading-spinner";
import { AuthService } from '../../services/auth';
import { PasswordReset as PasswordResetService } from '../../services/password-reset';
  
  @Component({
    selector: 'app-password-reset',
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        LoadingSpinner
    ],
    template: `

        @if (isLoading()) {
            <h3 class="mb-3">Sending email...</h3>
            <app-loading-spinner />
        }

        @if (!isLoading() && !alert()) {
            <h3>{{ isAuthenticated() ? 'Password Reset' : 'Find Your Account' }}</h3>
            <p>Please enter your email address to reset your password.</p>
            
            <form #form="ngForm" (ngSubmit)="onSubmit(form)">
                @let emailIsInvalid = !email.valid && email.touched;

                <div>
                    <input [class.is-invalid]="emailIsInvalid" type="text" placeholder="Email" name="email" #email="ngModel" required email ngModel>
                    @if (emailIsInvalid) {
                        <div>Email is required.</div>
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
    
    `,
  })
  export class PasswordReset {
  
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);

    readonly #passResetService = inject(PasswordResetService);
    readonly #authService = inject(AuthService);
    
    protected readonly isAuthenticated = signal<boolean>(false);
  
    ngOnInit(): void {
      this.#authService.user
        .pipe(
            takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe({
            next: user => this.isAuthenticated.set(!!user)
        });
    }
  
    protected readonly isLoading = signal<boolean>(false);
    protected readonly errorMessage = signal<string | null>(null);
    protected readonly alert = signal<boolean>(false);
  
    onSubmit(form: NgForm): void {
        this.isLoading.set(true);
  
        if (!form.valid) return;
    
        const email = form.value.email.toLowerCase();
    
        this.#passResetService
            .reset(email)
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                catchError(error => {
                    this.errorMessage.set(error)
                    return EMPTY;
                }),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe(() => {
                this.alert.set(true);
                setTimeout(() => this.#router.navigate(['/login']), 2400);
            });
    }
  
    //* Errors do not work for now
    // onCloseAlert(): void {
    //   this.errorMessage.set(null);
    // }
  
  }