import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/auth.guard';

import { HomeComponent } from './pages/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { PageNotFoundComponent } from './pages/page-not-found.component';

const getAppTitle = (pageTitle?: string) => {
    return `NG & Firebase Auth - ${pageTitle}`
};

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
        canActivate: [authGuard],
        title: getAppTitle('Home')
    },
    { 
        path: 'login', 
        component: AuthComponent,
        title: getAppTitle('Login')
    },
    { 
        path: 'password-reset', 
        component: PasswordResetComponent,
        title: getAppTitle('Password Reset')
    },
    { 
        path: '404',
        component: PageNotFoundComponent,
        title: getAppTitle('404')
    },
    { 
        path: '**',
        redirectTo: '404'
    }
];