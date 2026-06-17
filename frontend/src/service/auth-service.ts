/* eslint-disable @angular-eslint/prefer-inject */
import { Injectable, OnDestroy,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { TokenService } from './token-service';

export type UserRole = 'admin' | 'user' | null;

export interface AuthUser {
  id: string;
  username: string;
  birthdate: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly apiUrl = 'http://localhost:3000/api/login';
  private sub: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  //login e logout
  login(username: string, password: string): void {
    this.sub = this.http.post<{ success: boolean; user: AuthUser }>(this.apiUrl, {
      username,
      password
    }).subscribe({
      next: ({ user }) => {
        this.tokenService.set(user);
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Credenziali non valide');
      }
    });
  }

  logout(): void {
    this.tokenService.remove();
    this.router.navigate(['/login']);
  }
  //controlli e getter
  isLoggedIn(): boolean {
    return this.tokenService.isAuthenticated();
  }
  getUser(): User | null {
    return this.tokenService.get();
  }
  getRole(): UserRole {
    return this.getUser()?.role ?? null;
  }
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}