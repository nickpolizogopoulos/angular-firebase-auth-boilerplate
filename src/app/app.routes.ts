import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Home } from './pages/home';
import { Auth } from './pages/auth/auth';

import { PasswordReset } from './pages/password-reset/password-reset';
import { PageNotFound } from './pages/page-not-found';

const getAppTitle = (pageTitle?: string) => {
    const appTitle = 'Angular & Firebase Auth';
    return pageTitle ? `${appTitle} - ${pageTitle}` : appTitle;
};

export const routes: Routes = [
    { 
        path: '', 
        component: Home,
        canActivate: [authGuard],
        title: getAppTitle('Home')
    },
    { 
        path: 'login', 
        component: Auth,
        title: getAppTitle('Login')
    },
    { 
        path: 'password-reset', 
        component: PasswordReset,
        title: getAppTitle('Password Reset')
    },
    { 
        path: '404',
        component: PageNotFound,
        title: getAppTitle('404')
    },
    { 
        path: '**',
        redirectTo: '404'
    }
];