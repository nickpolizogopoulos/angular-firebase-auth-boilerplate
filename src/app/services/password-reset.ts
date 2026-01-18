import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import {
    Injectable,
    inject
} from '@angular/core';
import {
    Observable,
    catchError,
    throwError
} from 'rxjs';

import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class PasswordReset {

    readonly #http = inject(HttpClient);
    readonly #resetUrl: string = `${environment.passwordResetApiUrl}${environment.firebaseApiKey}`;

    reset(email: string): Observable<{email: string}> {
        const payload = { requestType:'PASSWORD_RESET',  email: email };
        return this.#http
            .post<{email: string}>(this.#resetUrl, payload)
            .pipe(catchError(this.#handleError));
    };

    #handleError( errorResponse: HttpErrorResponse ): Observable<never> {
        let errorMessage = 'An unknown error occured!';

        if (!errorResponse.error || !errorResponse.error.error)
            return throwError(() => errorMessage);

        if (errorResponse.error.error.message === 'EMAIL_NOT_FOUND')
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';

        return throwError(() => errorMessage);
    };
}