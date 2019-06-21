import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { LandingComponent } from './core/landing/landing.component';
import { PathNotFoundComponent } from './core/path-not-found/path-not-found.component';
import { SigninComponent } from './core/auth/signin/signin.component';
import { SignupComponent } from './core/auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PathNotFoundComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
