import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-comments',
  imports: [RouterModule, RouterOutlet],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class Comments {}

