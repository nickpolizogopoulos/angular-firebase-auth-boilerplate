
//* PRODUCTION

export const environment = {
    production: false,
    apiUrl: 'https://identitytoolkit.googleapis.com/v1/accounts',

    passwordReset: ':sendOobCode?key=',
    login: ':signInWithPassword?key=',
    signUp: ':signUp?key=',

    localStorageKey: 'angular-firebase-auth-boilerplate',
    
    firebaseApiKey: 'prod-firebase-project-key-here',
};