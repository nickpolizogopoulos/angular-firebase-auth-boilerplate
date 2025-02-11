import { 
    Component,
    DestroyRef,
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
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  
  import { AuthService } from '../auth/auth.service';
import { PasswordResetService } from './password-reset.service';
import { LoadingSpinnerComponent } from "../../components/loading-spinner.component";
  
  @Component({
    selector: 'app-password-reset',
    standalone: true,
    imports: [
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent
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
  export class PasswordResetComponent {
  
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    private readonly passReset = inject(PasswordResetService);
    private readonly authService = inject(AuthService);
    
    isAuthenticated = signal<boolean>(false);
  
    ngOnInit(): void {
      this.authService.user
        .pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
            next: user => this.isAuthenticated.set(!!user)
        });
    }
  
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    alert = signal<boolean>(false);
  
    onSubmit( form: NgForm ): void {
  
        this.isLoading.set(true);
  
        if (!form.valid)
            return;
    
        const email = form.value.email.toLowerCase();
    
        this.passReset
            .reset(email)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.alert.set(true);
                    setTimeout( 
                        () => this.router.navigate(['/login']),
                        4500
                    );
                },
                error: responseError => this.errorMessage.set(responseError),
                complete: () => this.isLoading.set(false)
            });
        
        form.reset();
    }
  
    //* Errors do not work for now
    // onCloseAlert(): void {
    //   this.errorMessage.set(null);
    // }
  
  }