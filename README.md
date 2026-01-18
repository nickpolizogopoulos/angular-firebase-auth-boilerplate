# Angular & Firebase Authentication Boilerplate

This project uses the latest version of [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.  
A boilerplate project for setting up Firebase Authentication in an Angular Application.  
This repo provides a ready-to-use authentication system with Firebase, including user sign-up, login, logout and password reset functionalities.

## Features

1. Zoneless Angular v21.1 with Standalone Components and Signals!
2. Firebase Authentication ([Email / Password](https://firebase.google.com/docs/reference/rest/auth)) that uses the JWT pattern
3. Secure Route Guard for Authenticated Users

Get the [Docker Image](https://hub.docker.com/r/nickpolizogopoulos/angular-firebase-auth-boilerplate)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/nickpolizogopoulos/angular-firebase-auth-boilerplate.git my-angular-firebase-auth-project
cd my-angular-firebase-auth-project
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project & enable Authentication (Email / Password)
3. Get your Firebase Web API Key from **Project Settings** → **General**
4. Add it in your "firebaseApiKey" in your environment.
5. Set your localStorage Key property value in the Auth Service.

### 4. Run the Project

```sh
npm start
```

OR  
```sh
ng serve --open
```

## License

This project is open-source under the **MIT License**.  