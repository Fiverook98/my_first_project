/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../service/post-service';
import { Post } from '../../model/post.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  latestPosts: Post[] = [];
  private sub?: Subscription;

  constructor( 
    private postServ: PostService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.postServ.getLatestPosts().subscribe({
      next: (data) => (this.latestPosts = data),
      error: () => console.error('Errore nel recupero dei post')
    });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); 
  }
}