/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Post } from '../../model/post.model';
import { PostService } from '../../service/post-service';

@Component({
  selector: 'app-strumenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strumenti.html',
  styleUrl: './strumenti.css'
})
export class Strumenti implements OnDestroy {
  title = '';
  content = '';
  tags = '';
  private tagsArray: string[] = [];

  private openForm = false;
  private postId: string | null = null;
  private uploadedImageUrl: string | null = null; 
  private coverImage: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub: any;

  constructor(private postServ: PostService, private router: Router) {}
  
  toggleForm(): void {
    this.openForm = !this.openForm;
  }

  get shouldShowForm(): boolean {
    return this.openForm;
  }
 
  private loadSelectedPostId(): void {
    this.postId = this.postServ.getSelectedPostId();
  }

  deletePost(): void {
    this.loadSelectedPostId();
      this.sub = this.postServ.deletePost(this.postId!).subscribe(() => {
        alert('Post eliminato con successo!');
        this.router.navigate(['/tutti-i-post']);
      });
  }

  updatePost(): void {
    this.loadSelectedPostId();
    this.postServ.getPostById(this.postId!).subscribe(original => {
      if (!this.title.trim() && !this.content.trim() && !this.uploadedImageUrl && !this.tags.trim()) {
        alert('Nessun campo da modificare');
        return;
      }
      if (this.tags.trim()) this.tagsArray = this.tags.trim().split(',').map(tag => tag.trim());

      const updatedPost: Partial<Post> = {
        id: original.id,
        title: this.title.trim() || original.title,
        content: this.content.trim() || original.content,
        tags: this.tagsArray.length > 0 ? this.tagsArray : original.tags,
        created_at: new Date().toISOString()
      };

      if (this.uploadedImageUrl) updatedPost.coverImage = this.uploadedImageUrl;
      
      this.postServ.patchPost(this.postId!, updatedPost).subscribe({
        next: () => {
          alert('Post modificato con successo!');
          this.router.navigate(['/tutti-i-post']);
        },
        error: () => alert('Errore durante la modifica del post')
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.postServ.uploadCoverImage(file).subscribe({
        next: (imageUrl) => {
          this.uploadedImageUrl = imageUrl; 
          this.postServ.setCoverImage(imageUrl); 
          alert('Immagine caricata con successo!');
        },
        error: () => alert('Errore durante il caricamento dell\'immagine')
      });
    }
  }

  ngOnDestroy(): void {
    if (this.uploadedImageUrl) 
      this.postServ.deleteCoverImage(this.uploadedImageUrl).subscribe({
        next: () => console.log('Immagine temporanea eliminata con successo.'),
        error: () => console.error('Errore durante l\'eliminazione dell\'immagine temporanea.')
      });
    if (this.sub) this.sub.unsubscribe();
  }
  
}