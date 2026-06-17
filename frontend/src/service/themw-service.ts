import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemwService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // Inizializza il tema al caricamento dell'app
  init() {
    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
      this.setTheme(theme || 'light');
    }
  }
  // Imposta il tema e lo salva nel localStorage
  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme',theme);
  }
  // Carica il tema salvato all'avvio dell'app
  loadSavedTheme(){
    const theme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    this.setTheme(theme || 'light');
  }
  // Alterna tra tema chiaro e scuro
  toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme');
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
}
