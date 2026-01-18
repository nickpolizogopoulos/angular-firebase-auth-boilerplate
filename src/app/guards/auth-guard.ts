import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';
import {
  Observable,
  map,
  take
} from 'rxjs';

import { AuthService } from '../services/auth';

type AuthGuardType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

export const authGuard: CanActivateFn = (): AuthGuardType => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user
    .pipe(
      take(1),
      map( user => {

        const isAuthenticated = !!user;

        if (!isAuthenticated) {
          router.navigate(['/login']);
          return false;
        }
        
        return true;

      })
    );
  
}