/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UsersService } from '../../service/users-service';
import { AuthService } from '../../service/auth-service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-gestione-utenti',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './gestione-utenti.html',
  styleUrl: './gestione-utenti.css'
})
export class GestioneUtenti implements OnInit, OnDestroy {
  users: User[] = [];
  selectedUserId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub: any; 
  searchQuery = '';
  private filteredUsers: User[] = [];

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  getFilteredUsers(): User[] {
    if (this.searchQuery.trim()) return this.filteredUsers;
    return this.users;
  }
  
  onSearch(): void {
    if (this.searchQuery.trim())
      this.filteredUsers = this.users.filter(user => 
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
     else this.filteredUsers = [];
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredUsers = [];
  }

  private loadUsers(): void {
    this.sub = this.userService.getUsers().subscribe({
      next: (all) => this.users = all,
      error: () => alert('Errore nel caricamento utenti')
    });
  }

  get currentUser(): User {
    return this.authService.getUser()!;
     ;
  }

  toggleMod(userId: string): void {
    this.selectedUserId = this.selectedUserId === userId ? null : userId;
  }

  isModOpen(userId: string): boolean {
    return this.selectedUserId === userId;
  }

  deleteUser(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Utente eliminato con successo!');
          this.loadUsers();
        },
        error: () => alert('Errore durante l’eliminazione utente')
      });
    }
  }

  // Ritorna tutti gli utenti (per binding)
  get allUsers(): User[] {
    return this.users;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}