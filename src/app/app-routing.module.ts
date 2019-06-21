import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './core/landing/landing.component';
import { PathNotFoundComponent } from './core/path-not-found/path-not-found.component';
// import { SigninComponent } from './core/auth/signin/signin.component';
// import { SignupComponent } from './core/auth/signup/signup.component';

const routes: Routes = [
  // { path: 'signin', component: SigninComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: 'feature',
    loadChildren: () =>
      import('./feature/feature.module').then(m => m.FeatureModule)
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./admin/admin.module').then(m => m.AdminModule)
  // },
  { path: '', component: LandingComponent },
  { path: '**', component: PathNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
