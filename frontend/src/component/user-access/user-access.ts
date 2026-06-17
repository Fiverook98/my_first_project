/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-user-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-access.html',
  styleUrl: './user-access.css'
})
export class UserAccess implements OnDestroy {
  username = '';
  password = '';
  birthdate = '';
  isNewUser = false;
  loginError = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub: any;

  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isNewUser = !this.isNewUser;
    this.loginError = '';
    this.resetForm();
  }

  private resetForm(): void {
    this.username = '';
    this.password = '';
    this.birthdate = '';
  }

  private isBirthdateValid(): boolean {
    const minAge = 18;
    const today = new Date();
    const birth = new Date(this.birthdate);

    const age = today.getFullYear() - birth.getFullYear()
      - (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);

    return age >= minAge;
  }

  private isPasswordValid(): boolean {
    return (
      this.password.length >= 8 &&
      /\d/.test(this.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(this.password)
    );
  }

  onSubmit(): void {
    this.loginError = '';
    if (!this.isPasswordValid()) {
      this.loginError = 'La password deve contenere almeno 8 caratteri, un numero e un simbolo speciale.';
      return;
    }
    if (this.isNewUser) {
      if (!this.isBirthdateValid()) {
        this.loginError = 'Devi avere almeno 18 anni per registrarti.';
        return;
      }
      const newUser = {
        username: this.username.trim(),
        password: this.password,
        birthdate: this.birthdate
      };
      this.sub = this.http.post(this.apiUrl, newUser).subscribe({
        next: () => {
          alert('Registrazione completata! Ora puoi accedere.');
          this.toggleMode(new Event('click'));
        },
        error: () => {
          this.loginError = 'Utente già esistente o dati non validi.';
        }
      });
    } else this.auth.login(this.username, this.password);
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}