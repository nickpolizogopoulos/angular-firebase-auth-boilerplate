import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { unauthGuard } from './guards/unauth-guard';

const getAppTitle = (pageTitle?: string) => {
    const appTitle = 'Angular & Firebase Auth';
    return pageTitle ? `${appTitle} - ${pageTitle}` : appTitle;
};

export const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('../app/pages/home').then(module => module.Home),
        canActivate: [authGuard],
        title: getAppTitle('Home')
    },
    { 
        path: 'login', 
        loadComponent: () => import('../app/pages/auth/auth').then(module => module.Auth),
        canActivate: [unauthGuard],
        title: getAppTitle('Login')
    },
    { 
        path: 'password-reset', 
        loadComponent: () => import('../app/pages/password-reset').then(module => module.PasswordReset),
        title: getAppTitle('Password Reset')
    },
    { 
        path: '404',
        loadComponent: () => import('../app/pages/page-not-found').then(module => module.PageNotFound),
        title: getAppTitle('404')
    },
    { 
        path: '**',
        redirectTo: '404'
    }
];