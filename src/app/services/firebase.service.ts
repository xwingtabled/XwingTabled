import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    public user: firebase.User = null;

    constructor(private platform: Platform,
                public afAuth: AngularFireAuth,
                public gplus: GooglePlus) { 
        this.afAuth.authState.subscribe(
            (user) => {
                this.user = user;
            }
        )
    }

    
  async nativeGoogleLogin(): Promise<firebase.User> {
    const gplusUser = await this.gplus.login({
      'webClientId': '709154274494-m1m5u7fbcpbmk65h9l5segon0tvjdo0u.apps.googleusercontent.com',
      'offline': true,
      'scopes': 'profile email'
    });
    let credential = await auth.GoogleAuthProvider.credential(gplusUser.idToken);
    let user = await this.afAuth.auth.signInWithCredential(credential);
    return user;
  }

  async webGoogleLogin(): Promise<auth.UserCredential> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return credential;
  }

  login() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin().then(
        (result) => {
          console.log("Native Login Success", this.afAuth.auth.currentUser);
        },
        (error) => {
          console.log("Native Login Error", error);
        }
      );
    } else {
      this.webGoogleLogin().then(
        (result) => {
          console.log("Web Login Success", this.afAuth.auth.currentUser);
        },
        (error) => {
          console.log("Web Login Error", error);
        }
      );
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    console.log("Logged out", this.afAuth.auth.currentUser);
  }
}
