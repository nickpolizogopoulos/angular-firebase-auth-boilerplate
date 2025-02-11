

export class User {

    constructor (
        public username:string,
        public id:string,
        private _token:string,
        private _tokenExpirationDate:Date
    ) { }

    get token() {
        if ( !this._tokenExpirationDate || new Date() > this._tokenExpirationDate )
            return null;
        return this._token;
    }
    
}

//* Έχει tokenExpirationDate σε περίπτωση που πρέπει να υπάρχει
//* λήξη του session για auto logout μετά απο κάποια ώρα.
