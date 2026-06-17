/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Header } from "../component/header/header";
import { Footer } from '../component/footer/footer';
import { ThemwService } from '../service/themw-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'mini-blog';

  constructor(protected themeService: ThemwService) {}

  ngOnInit() {
    this.themeService.init();
  }

}
