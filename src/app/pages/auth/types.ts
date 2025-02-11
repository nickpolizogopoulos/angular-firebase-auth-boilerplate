export type AuthResponseData = {
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
};

export type UserData = {
    email:string;
    id:string;
    _token:string;
    _tokenExpirationDate:string;
};