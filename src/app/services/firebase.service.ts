import { Injectable } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, firestore } from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { XwingStateService } from './xwing-state.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public user: firebase.User = null;

  private pushes: any = { };

  constructor(private platform: Platform,
              public afAuth: AngularFireAuth,
              public gplus: GooglePlus,
              public afStore: AngularFirestore,
              public state: XwingStateService,
              public loadingCtrl: LoadingController) { 
      this.afAuth.authState.subscribe(
          (user) => {
              this.user = user;
          }
      )
  }

  timestamp() {
    return Math.floor(Date.now() / 1000);
  }

  async pushSquadron(uuid: string) {
    if (!this.user.uid) {
      return;
    }
    let squadron = this.state.getSquadron(uuid);
    if (!squadron) {
      return;
    }
    if (!squadron.uid) {
      squadron.uid = this.user.uid;
    }
    if (squadron.uid != this.user.uid) {
      return;
    }
    if (JSON.stringify(squadron) == this.pushes[squadron.uuid]) {
      return;
    }
    squadron.timestamp = this.timestamp();
    this.pushes[squadron.uuid] = JSON.stringify(squadron);
    let doc = this.afStore.doc("squadrons/" + squadron.uuid);
    return await doc.set(squadron);
  }

  async mysquadrons() {
    let collection = this.afStore.collection('squadrons', ref => ref.where('uid', '==', this.user.uid));
    return collection.get().toPromise();
  }

  async deleteSquadron(uuid: string) {
    let doc = this.afStore.doc("squadrons/" + uuid);
    return await doc.delete();
  }

  async retrieveSquadron(uuid: string) : Promise<firebase.firestore.DocumentSnapshot> {
    let doc = this.afStore.doc("squadrons/" + uuid);
    return await doc.get().toPromise();
  }

  async subscribeSquadron(uuid: string) {
    let doc = this.afStore.doc("squadrons/" + uuid);
    doc.snapshotChanges().subscribe(
      (snapshot) => {
        if (snapshot.payload.exists) {
          this.state.updateSquadron(snapshot.payload.data())
        } else {
          console.log("UUID ceased to exist", uuid);
        }
      }
    )
  }

  async synchronize() {
    const loading = await this.loadingCtrl.create({
      message: "Looking for squadron online"
    });
    await loading.present();
    this.state.squadrons.forEach(
      async (squadron) => {
        try {
          let result = await this.retrieveSquadron(squadron.uuid);
          if (result.exists) {
            let onlineSquadron = result.data();
            if (onlineSquadron.timestamp > squadron.timestamp) {
              this.state.updateSquadron(onlineSquadron);
            }
          } else {
            await this.pushSquadron(squadron.uuid);
          }
          await this.subscribeSquadron(squadron.uuid);
          console.log("Squadron synced", squadron.uuid);
        } catch (err) {
          console.log("Unable to sync squadron", squadron.uuid, err);
        }
      }
    )
    return await this.loadingCtrl.dismiss()
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

  loggedIn() : boolean {
    return this.user != null;
  }

  async login() {
    if (this.platform.is('cordova')) {
      await this.nativeGoogleLogin().then(
        (result) => {
          console.log("Native Login Success", this.afAuth.auth.currentUser);
        },
        (error) => {
          console.log("Native Login Error", error);
        }
      );
    } else {
      await this.webGoogleLogin().then(
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
