import { Routes } from '@angular/router';

import { Home } from '../component/home/home';
import { PostC } from '../component/post/post';
import { PostList } from '../component/post-list/post-list';
import { UserAccess } from '../component/user-access/user-access';
import { FormPost } from '../component/form-post/form-post';
import { authGuard } from '../guard/auth-guard-guard';
import { Error } from '../component/error/error';
import { Strumenti } from '../component/strumenti/strumenti';
import { Comments } from '../component/comments/comments';
import { logGuard } from '../guard/log-guard';
import { ComList } from '../component/com-list/com-list';
import { ComForm } from '../component/com-form/com-form';
import { GestioneUtenti } from '../component/gestione-utenti/gestione-utenti';
import { UsersMod } from '../component/users-mod/users-mod';


export const routes: Routes = [
      {path: '', component: Home},
      {path: 'post/:id', component:PostC, canActivate: [logGuard], children: [
            {path:'strumenti', component: Strumenti, canActivateChild: [authGuard]},
            {path:'commenti', component: Comments, children: [
                  {path:'com-list', component: ComList},
                  {path:'com-form', component: ComForm},
                  {path: 'posts/:postId/comments/:commentId/replies', component: ComList},
            ]}
      ]},
      {path: 'tutti-i-post', component: PostList},
      {path: 'login', component: UserAccess},
      {path: 'add-post', component: FormPost},
      {path: 'users', component: GestioneUtenti, canActivate: [authGuard], children:[
            {path: 'user-mod/:id', component: UsersMod},
      ]},
      {path: '404', component: Error},
      {path: '**', redirectTo: '/404'},

];


