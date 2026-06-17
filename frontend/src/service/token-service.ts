import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthUser } from './auth-service';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storageKey = 'loggedUser';
  private isBrowser: boolean;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  // Imposta l'utente nel localStorage
  set(user: AuthUser): void {
    if (this.isBrowser) localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
  // Recupera l'utente dal localStorage
  get(): User | null {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
  // Rimuove l'utente dal localStorage
  remove(): void {
    if (this.isBrowser) localStorage.removeItem(this.storageKey);
  }
  // Controlla se l'utente è autenticato
  isAuthenticated(): boolean {
    return !!this.get();
  }
}