
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}