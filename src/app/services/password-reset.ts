import { Service, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment as env } from '../../environments/environment.development';

type PassResetResponse = {
    email: string
};

@Service()
export class PasswordReset {
    readonly #http = inject(HttpClient);
    readonly #resetUrl: string = `${env.passwordResetUrl}${env.firebaseApiKey}`;

    public reset(email: string): Observable<PassResetResponse> {
        const payload = { requestType:'PASSWORD_RESET', email };
        return this.#http
            .post<PassResetResponse>(this.#resetUrl, payload)
            .pipe(catchError(this.#handleError));
    };

    #handleError(errorResponse: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occured!';

        if (!errorResponse.error || !errorResponse.error.error)
            return throwError(() => errorMessage);

        if (errorResponse.error.error.message === 'EMAIL_NOT_FOUND')
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';

        return throwError(() => errorMessage);
    };
}