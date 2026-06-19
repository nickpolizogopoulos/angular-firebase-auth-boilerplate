import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    Injectable,
    computed,
    inject,
    signal
} from '@angular/core';
import { Router } from '@angular/router';
import {
    Observable,
    catchError,
    tap,
    throwError
} from 'rxjs';

import {
    AuthRequest,
    AuthResponse,
    UserData
} from '../models/auth';
import { environment as env } from '../../environments/environment';
import { User } from '../models/user';
  
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    readonly #router = inject(Router);
    readonly #http = inject(HttpClient);

    readonly #user = signal<User | null>(null);
    public readonly isAuthenticated = computed<boolean>(() => !!this.#user());
    public readonly userEmail = computed<string>(() => this.#user()?.email ?? '');


    


    readonly #signUpUrl: string = `${env.apiUrl}${env.signUp}${env.firebaseApiKey}`;
    readonly #loginUrl: string = `${env.apiUrl}${env.login}${env.firebaseApiKey}`;
    readonly #localStorageKey = `${env.localStorageKey}`;
    #tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

    #getPayload(email: string, password: string): AuthRequest {
        return {
            email: email,
            password: password,
            returnSecureToken: true
        };
    };

    public signup(email: string, password: string): Observable<AuthResponse> {
        return this.#http
            .post<AuthResponse>(this.#signUpUrl, this.#getPayload(email, password))
            .pipe(
                tap(res => this.#handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)),
                catchError(this.#handleError)
            );
    };

    public login(email: string, password: string): Observable<AuthResponse> {
        return this.#http
            .post<AuthResponse>(this.#loginUrl, this.#getPayload(email, password))
            .pipe(
                tap(response => this.#handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn)),
                catchError(this.#handleError)
            );
    };

    public autoLogin(): void {
        const stored = localStorage.getItem(this.#localStorageKey);
        if (!stored) return;

        const storedUser: UserData = JSON.parse(stored);

        const loadedUser = new User (
            storedUser.email,
            storedUser.id,
            storedUser._token,
            new Date(storedUser._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.#user.set(loadedUser);
            this.#autoLogout(new Date(storedUser._tokenExpirationDate).getTime() - new Date().getTime());
        };
    };

    public logout(): void {
        this.#user.set(null);
        this.#router.navigate(['/login']);
        localStorage.removeItem(this.#localStorageKey);

        if (this.#tokenExpirationTimer)
            clearTimeout(this.#tokenExpirationTimer);

        this.#tokenExpirationTimer = null;
    };

    #autoLogout(expirationDuration: number): void {
        this.#tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
    };

    #handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
        const expirationDate: Date = new Date(new Date().getTime() + expiresIn * 1000);
        const user: User = new User(email, userId, token, expirationDate);

        this.#user.set(user);
        this.#autoLogout(expiresIn * 1000);
        localStorage.setItem(this.#localStorageKey, JSON.stringify(user));
    };

    #handleError( errorResponse: HttpErrorResponse ): Observable<never> {
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

        return throwError(() => errorMessage);
    };
}