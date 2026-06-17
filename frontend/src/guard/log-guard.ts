import { inject } from '@angular/core';
import { Router, CanActivateChildFn } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const logGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};