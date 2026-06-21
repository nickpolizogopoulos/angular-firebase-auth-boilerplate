
//* DEVELOPMENT

export const environment = {
    production: false,
    localStorageKey: 'angular-firebase-auth-boilerplate',
    
    signUpUrl: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`,
    loginUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    passwordResetUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=',
    
    firebaseApiKey: 'dev-firebase-project-key-here'
};