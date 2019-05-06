import { Injectable } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, firestore } from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Squadron } from '../services/xwing-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
              public loadingCtrl: LoadingController) { 
      this.afAuth.authState.subscribe(
          (user) => {
              this.user = user;
          }
      )
  }

  timestamp() {
    return Date.now();
  }

  async pushSquadron(uuid: string, squadron: Squadron) {
    if (!this.loggedIn()) {
      return;
    }

    // If squadron has no user ID, assign one now
    if (!squadron.uid) {
      squadron.uid = this.user.uid;
    }

    // If squadron had pre-existing user ID that doesn't match
    // currently logged in user, don't push the squadron
    if (squadron.uid != this.user.uid) {
      return;
    }

    // If the squadron state is exactly the same, don't push
    let squadronCopy = JSON.parse(JSON.stringify(squadron));
    delete squadronCopy.timestamp;
    let squadronSerialized = JSON.stringify(squadronCopy);
    if (JSON.stringify(squadronSerialized) == this.pushes[uuid]) {
      return;
    }
    
    // Update squadron timestamp
    squadron.timestamp = this.timestamp();

    // Save serialized squadron for comparison later
    this.pushes[uuid] = squadronSerialized;

    // Push squadron to firebase
    let doc = this.afStore.doc("squadrons/" + uuid);
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


  snapshotToSquadron(snapshot: DocumentSnapshot<any>) : Squadron {
    if (!snapshot.exists) {
      return null;
    }
    let data = snapshot.data();
    let squadron: Squadron = {
      name: data.name,
      faction: data.faction,
      damagedeck: data.damagedeck,
      damagediscard: data.damagediscard,
      pilots: data.pilots,
      timestamp: data.timestamp,
      uid: data.uid
    }
    return squadron;
  }

  async retrieveSquadron(uuid: string) : Promise<Squadron> {
    let doc = this.afStore.doc("squadrons/" + uuid);
    return await doc.get().pipe(
      map(snapshot => this.snapshotToSquadron(<DocumentSnapshot<any>>snapshot))
    ).toPromise();
  }

  getSquadronSubscription(uuid: string) : Observable<Squadron> {
    return this.afStore.doc("squadrons/" + uuid).snapshotChanges().pipe(
      map(action => this.snapshotToSquadron(action.payload))
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

  loggedIn() : boolean {
    if (!this.user) {
      return false;
    }
    if (!this.user.uid) {
      return false;
    }
    if (this.user.uid.length == 0) {
      return false;
    }
    return true;
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
