/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../model/user.model';
import { UsersService } from '../../service/users-service';

@Component({
  selector: 'app-users-mod',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users-mod.html',
  styleUrl: './users-mod.css'
}) 
export class UsersMod implements OnInit, OnDestroy {
  private userId!: string;
  private user!: User;

  username= '';
  birthdate= '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub2?: any;
  constructor(
    private userServ: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.sub = this.userServ.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.username = data.username;
        this.birthdate = data.birthdate;
      },
      error: () => alert('Utente non trovato')
    });
  }

  submitMod(): void {
    const updates: Partial<User> = {};
    
    if (this.username !== this.user.username) updates.username = this.username;
    if (this.birthdate !== this.user.birthdate) updates.birthdate = this.birthdate;

    if (Object.keys(updates).length === 0) {
      alert('Nessun campo modificato');
      return;
    }

    this.sub2 = this.userServ.updateUser(this.userId, updates).subscribe({
      next: () => {
        // console.log('Utente aggiornato.');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Errore aggiornamento:', err);
        alert('Errore durante l\'aggiornamento utente');
      }
    });
  }
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();

    if (this.sub2) this.sub2.unsubscribe();
  }
}