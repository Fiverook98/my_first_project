/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommentService } from '../../service/comment-service';
import { AuthService } from '../../service/auth-service';
import { PostService } from '../../service/post-service';
import { Comment } from '../../model/comment.model';

@Component({
  selector: 'app-com-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './com-form.html',
  styleUrl: './com-form.css'
})
export class ComForm implements OnDestroy {
  content = '';
  successMessage = '';
  errorMessage = '';
  date = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sub: any;

  constructor(
    private comServ: CommentService,
    private auth: AuthService,
    private postServ: PostService
  ) {}

  onSubmit(): void {
    const user = this.auth.getUser();
    const postId = this.postServ.getSelectedPostId();

    if (!user || !postId) {
      this.errorMessage = 'Utente o post non identificati.';
      return;
    }

    const comment: Partial<Comment> = {
      content: this.content.trim(),
      created_at: new Date().toISOString(),
      username: user.username,   
      user_id: user.id           
    };
    this.errorMessage = '';

    this.sub = this.comServ.createComment(postId, comment).subscribe({
      next: () => {
        // console.log('✅ Commento salvato');
        this.successMessage = 'Commento pubblicato con successo!';
        this.content = '';
      },
      error: () => {
        this.errorMessage = 'Errore durante il salvataggio del commento.';
      }
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}