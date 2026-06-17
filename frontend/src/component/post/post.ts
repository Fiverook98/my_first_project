/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { PostService } from '../../service/post-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth-service';
import { Post } from '../../model/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class PostC implements OnInit, OnDestroy {
  post?: Post;
  openedSection: 'comments' | 'edit' | null = null;
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postServ: PostService,
    private auth: AuthService
  ) {} 

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sub = this.postServ.getPostById(id).subscribe({
        next: (data) => {
          console.log('Dati post ricevuti:', data);
          console.log('coverImage:', data.coverImage);
          this.post = data;
        },
        error: () => console.error('Post non trovato'),
      });
      this.postServ.setSelectedPostId(id);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleEdit(): void {
    this.openedSection = this.openedSection === 'edit' ? null : 'edit';
  }

  toggleComments(): void {
    this.openedSection = this.openedSection === 'comments' ? null : 'comments';
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get shouldShowComments(): boolean {
    return this.openedSection === 'comments';
  }

  get shouldShowEdit(): boolean {
    return this.openedSection === 'edit';
  }

  getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    // Rimuovi il primo slash se presente
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://localhost:3000/api/upload/${cleanPath}`;
  }

  getUsername(): string {
    return this.auth.getUser()!.username ;
  }
}

