import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server }, // homepage
  { path: 'tutti-i-post', renderMode: RenderMode.Server },
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'add-post', renderMode: RenderMode.Server },
  { path: 'users', renderMode: RenderMode.Server },
  { path: 'users/user-mod/:id', renderMode: RenderMode.Server },
  { path: 'post/:id', renderMode: RenderMode.Server },
  { path: 'post/:id/strumenti', renderMode: RenderMode.Server },
  { path: 'post/:id/commenti', renderMode: RenderMode.Server },
  { path: 'post/:id/commenti/com-form', renderMode: RenderMode.Server },
  { path: 'post/:id/commenti/com-list', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server } // fallback
];