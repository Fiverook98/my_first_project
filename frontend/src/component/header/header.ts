import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(protected auth: AuthService){}
  logged(){
    return this.auth.isLoggedIn();
  }
  logout(){
    this.auth.logout();
  }
}
