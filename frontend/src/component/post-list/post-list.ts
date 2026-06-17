import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostService } from '../../service/post-service';
import { Post } from '../../model/post.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList implements OnInit, OnDestroy {
  private allPosts: Post[] = [];
  private filteredPosts: Post[] = [];
  searchQuery = '';
  private sub?: Subscription;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private postServ: PostService) {}
  
  ngOnInit(): void {
    this.sub = this.postServ.getPosts().subscribe({
      next: (posts) => (this.allPosts = posts),
      error: () => console.error('Errore nel caricamento dei post')
    });
  }
  get posts(): Post[] {
    return this.filteredPosts.length > 0 ? this.filteredPosts : this.allPosts;
  }
  
  onSearch(): void {
    if(this.searchQuery.trim())
      this.filteredPosts = this.allPosts.filter(post =>
        post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.author?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag =>
          tag.toLowerCase().includes(this.searchQuery.toLowerCase())
        ))
      );
     else this.filteredPosts = [];
  }

  get filterPosts(): Post[] {
    return this.filteredPosts.length > 0 ? this.filteredPosts : [];
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredPosts = [];
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}