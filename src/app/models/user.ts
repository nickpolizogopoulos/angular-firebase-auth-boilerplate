
export class User {

    constructor (
        public username:string,
        public id:string,
        private _token:string,
        private _tokenExpirationDate:Date
    ) {};

    public get token(): string | null {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
            return null;
        return this._token;
    };
    
};