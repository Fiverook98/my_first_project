import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private auth: AuthService) {}
  admin() {
    return this.auth.isAdmin();
  }
}
