/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { CommentService } from '../../service/comment-service';
import { Comment } from '../../model/comment.model';
import { PostService } from '../../service/post-service';
import { AuthService } from '../../service/auth-service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-com-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './com-list.html',
  styleUrl: './com-list.css'
})
export class ComList implements OnInit, OnDestroy {
  // Variabili per i commenti e le risposte
  private comments: Comment[] = [];
  private sub?: Subscription;
  private postId: string | null = null;
  likedCommentIds = new Set<string>();
  private user: User | null = null;
  replyContent = '';
  replyingToCommentId: string | null = null;
  replies: Comment[] = [];
  isReplyOpen = false;

  // Iniezione dei servizi necessari
  constructor(
    private comServ: CommentService,
    private postServ: PostService,
    private authServ: AuthService
  ) {}

  getComments(): Comment[] {
    return this.comments;
  }
  // Verifica se l'utente è autenticato come amministratore
  get isAdmin(): boolean {
    return this.authServ.isAdmin();
  }
  //Controllo Like
  toggleLike(commentId: string): void {
    if (this.likedCommentIds.has(commentId)) this.likedCommentIds.delete(commentId);
    else this.likedCommentIds.add(commentId);
  }

  isLiked(commentId: string): boolean {
    return this.likedCommentIds.has(commentId);
  }

  //------Gestione risposte ai commenti -------\\
  toggleReplyForm(commentId: string): void {
    this.replyingToCommentId = this.replyingToCommentId === commentId ? null : commentId;
  }
  isReplying(commentId: string): boolean {
    return this.replyingToCommentId === commentId;
  }
  
  sendReply(commentId: string): void {

    if (!this.replyContent.trim()) {
      console.warn('Reply content is empty');
      return;
    }

    const userId = this.authServ.getUser()!.id;
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    this.comServ.addReply(this.postId!, commentId, this.replyContent, userId).subscribe({
      next: (reply) => {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
          comment.replies = comment.replies || [];
          comment.replies.push(reply);
        }
        this.replyContent = '';
        this.replyingToCommentId = null;
      },
      error: () => alert('Errore durante l’invio della risposta')
    });
  }
  toggleRepliesList(comment: Comment): void {
    comment.isReplyOpen = !comment.isReplyOpen;
    if (comment.isReplyOpen) this.getReplies(comment);
    else comment.replies = [];  
  }

  getReplies(comment: Comment): void {
    if (!this.postId) return;
    this.comServ.getReplies(this.postId, comment.id!).subscribe({
      next: (replies) => {
        comment.replies = replies;
      },
      error: () => console.error(`Errore nel recupero delle risposte per il commento ${comment.id}`)
    });
  }

  deleteReply(commentId:string, replyId:string): void{
    this.comServ.deleteReply(this.postId!, commentId, replyId).subscribe({
      next: () => {
        alert('Risposta eliminata con successo!');
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) comment.replies = comment.replies?.filter(r => r.id !== replyId);
      },
      error: () => alert('Errore durante l’eliminazione della risposta')
    });
  }

  
  ngOnInit(): void {
    this.user = this.authServ.getUser();
    this.postId = this.postServ.getSelectedPostId();
    if (this.postId) {
      this.sub = this.comServ.getAllComments(this.postId).subscribe({
        next: (all) => (this.comments = all),
        error: () => console.warn('Errore nel caricamento dei commenti'),
      });
    }
  }

  //-------------Gestione dei commenti------------\\
  deleteComment(commentId: string): void {
    this.comServ.deleteComment(this.postId!, commentId).subscribe({
      next: () => {
        alert('Commento eliminato con successo!');
        this.comments = this.comments.filter(c => c.id !== commentId);
      },
      error: () => alert('Errore durante l’eliminazione del commento')
    });
  }

  getUsername(): string {
    return this.user ? this.user.username : '';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}