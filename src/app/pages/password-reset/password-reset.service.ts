import {
    Injectable,
    inject
} from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';
import {
    Observable,
    catchError,
    throwError
} from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class PasswordResetService {

    private http = inject(HttpClient);
    private resetEndpoint: string = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=';
    private apiKey: string = environment.firebaseApiKey;
    private resetUrl: string = this.resetEndpoint + this.apiKey;

    reset(email: string): Observable<{email: string}> {

        const payload = { requestType:'PASSWORD_RESET',  email: email };
        return this.http
            .post<{email: string}>(this.resetUrl, payload)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError( errorResponse: HttpErrorResponse ): Observable<never> {

        let errorMessage = 'An unknown error occured!';

        if (!errorResponse.error || !errorResponse.error.error)
            return throwError(() => errorMessage);

        const message = errorResponse.error.error.message;

        if (message === 'EMAIL_NOT_FOUND')
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';

        return throwError(() => errorMessage);
    }

}