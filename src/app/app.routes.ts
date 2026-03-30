import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard, guestGuard } from './core/guards';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { GameComponent } from './pages/game/game.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { Library } from './pages/library/library';
import { Members } from './pages/members/members';
import { Requests } from './pages/requests/requests';
import { Logs } from './pages/logs/logs';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', canActivate: [guestGuard], component: Login },
  { path: 'register', canActivate: [guestGuard], component: Register },

  { path: 'profile', canActivate: [authGuard], component: ProfileComponent },
  { path: 'user/:username', canActivate: [authGuard], component: ProfileComponent },

  { path: 'library/:id', canActivate: [authGuard], component: Library },
  { path: 'my-library', canActivate: [authGuard], component: Library },

  { path: 'game/:id', component: GameComponent },
  { path: 'search', component: BuscarComponent },
  
  { path: 'members', canActivate: [authGuard], component: Members },
  { path: 'requests', canActivate: [authGuard], component: Requests },
  { path: 'logs/:id', canActivate: [authGuard], component: Logs  },
  { path: '**', redirectTo: '' },
];
