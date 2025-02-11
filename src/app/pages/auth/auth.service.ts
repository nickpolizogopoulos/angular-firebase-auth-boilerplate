import {
    Injectable,
    inject
} from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
    Observable,
    BehaviorSubject,
    catchError,
    tap,
    throwError
} from 'rxjs';

import { User } from './user.model';
import { environment } from '../../../environments/environment.development';

import {
    type AuthResponseData,
    type UserData
} from './types';
  
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject<User | null>(null);

    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);

    private readonly signUpEndpoint: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    private readonly loginEndpoint: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
    private readonly apiKey: string = environment.firebaseApiKey;

    private readonly signUpUrl: string = this.signUpEndpoint + this.apiKey;
    private readonly loginUrl: string = this.loginEndpoint + this.apiKey;
    private readonly localStorageKey = 'angular-firebase-auth-boilerplate';
    private tokenExpirationTimer: any;

    signup(email: string, password: string): Observable<AuthResponseData> {

        const payload = { email: email, password: password, returnSecureToken: true };

        return this.http
            .post <AuthResponseData>(this.signUpUrl, payload)
            .pipe(
                tap( responseData => 
                    this.handleAuthentication(
                        responseData.email,
                        responseData.localId,
                        responseData.idToken,
                        +responseData.expiresIn
                    )
                ),
                catchError(this.handleError)
            );
    }

    login(email: string, password: string): Observable<AuthResponseData> {

        const payload = { email: email, password: password, returnSecureToken: true };

        return this.http
            .post <AuthResponseData>( this.loginUrl, payload )
            .pipe(
                tap( responseData =>
                    this.handleAuthentication(
                        responseData.email,
                        responseData.localId,
                        responseData.idToken,
                        +responseData.expiresIn
                    )
                ),
                catchError(this.handleError)
            );
    }

    autoLogin(): void {

        const userData: UserData = JSON.parse(localStorage.getItem(this.localStorageKey) as string);

        if (!userData)
            return;

        const loadedUser = new User (
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            this.autoLogout( new Date(userData._tokenExpirationDate).getTime() - new Date().getTime() );
        }

    }

    logout(): void {

        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem(this.localStorageKey);

        if (this.tokenExpirationTimer)
            clearTimeout(this.tokenExpirationTimer);

        this.tokenExpirationTimer = null;

    }

    autoLogout( expirationDuration: number ): void {

        this.tokenExpirationTimer = setTimeout(
            () => this.logout(),
            expirationDuration
        );

    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ): void 
    {
        const expirationDate: Date = new Date( new Date().getTime() + expiresIn * 1000 );
        const user: User = new User( email, userId, token, expirationDate);
        
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem(this.localStorageKey, JSON.stringify(user));

    }

    private handleError( errorResponse: HttpErrorResponse ): Observable<never> {

        let errorMessage = 'An unknown error occured!';

        if (!errorResponse.error || !errorResponse.error.error)
            return throwError(() => errorMessage);

        const message = errorResponse.error.error.message;
        const manyAttemptsMessage: string = 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';

        //* Signup
        if (message === 'EMAIL_EXISTS')
            errorMessage = 'The email address is already in use by another account. If this is your account address, try logging in.';

        if (message === manyAttemptsMessage)
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';

        //* Login
        if (message === 'INVALID_LOGIN_CREDENTIALS')
            errorMessage = 'Incorrect credentials. Please try again.';

        if (message === 'USER_DISABLED')
            errorMessage = 'This user account has been disabled by an administrator.';

        return throwError( () => errorMessage );

    }

}