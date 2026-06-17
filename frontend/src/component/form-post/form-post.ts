/* eslint-disable @angular-eslint/prefer-inject */
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostService } from '../../service/post-service';
import { NewPost } from '../../model/post.model';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-form-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-post.html',
  styleUrl: './form-post.css'
})
export class FormPost {
  title = '';
  content = '';
  tags = '';
  private tagsArray: string[] = [];
  private successMessage = '';
  private errorMessage = '';
  private selectedFile: File | null = null;
  private previewUrl: string | null = null;

  constructor(
    private auth: AuthService,
    private postServ: PostService
  ) {}

  submitPost(): void {
    const trimmedTitle = this.title.trim();
    const trimmedContent = this.content.trim();
    const trimmedTags = this.tags.trim();
    if (!trimmedTitle || !trimmedContent || !trimmedTags) {
      this.errorMessage = 'Titolo, contenuto e tag non possono essere vuoti.';
      return;
    }
    this.tagsArray = trimmedTags.split(',').map(tag => tag.trim());
    if (this.selectedFile) {
      this.postServ.uploadCoverImage(this.selectedFile).subscribe({
        next: (imageUrl) => {
          const coverImageUrl = this.getImageUrl(imageUrl);
          this.errorMessage = '';
          this.createPost(trimmedTitle, trimmedContent, this.tagsArray, coverImageUrl);
        },
        error: () => {
          this.errorMessage = 'Errore durante l\'upload dell\'immagine.';
        }
      });
    } else {
      this.createPost(trimmedContent, trimmedContent, this.tagsArray);
      this.errorMessage = '';
    }
  }

  private createPost(title: string, content: string, tags: string[], cover: string | null = null): void {
    const newPost: NewPost = {
      title: title,
      content: content,
      user_id: this.auth.getUser()!.id,
      author: this.auth.getUser()!.username,
      coverImage: cover ? cover : null,
      tags: tags
    };

    this.postServ.createPost(newPost).subscribe({
      next: () => {
        this.successMessage = '✅ Post creato con successo!';
        this.resetForm();
      },
      error: () => {
        this.errorMessage = 'Errore durante la creazione del post.';
      }
    });
  }

  private resetForm(): void {
    this.title = '';
    this.content = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.tags = '';
    this.tagsArray = [];
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  getImageUrl(imagePath: string | null): string | null {
    if (!imagePath) return null;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://localhost:3000/api/upload/${cleanPath}`;
  }

  getPreviewImageUrl(): string | null {
    return this.previewUrl ? this.previewUrl : null;
  }
  // Getter per i messaggi di successo ed errore
  get success(): string {
    return this.successMessage;
  }
  get error(): string {
    return this.errorMessage;
  }
} 