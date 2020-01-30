import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AmplifyService } from 'aws-amplify-angular';
import { CognitoHostedUIIdentityProvider, FederatedResponse, FederatedUser } from '@aws-amplify/auth/lib/types';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor(
    private fb: Facebook,
    private amplifyService: AmplifyService,
    private storage: Storage
  ) {
    
    this.initUser();

    this.storage.get('user').then(user => {
      user ? this.user = JSON.parse(user) : this.initUser();
    });

    this.amplifyService.authStateChange$.subscribe(authState => {
      if (authState.user !== null){
        this.user = authState.user.attributes;
        this.storage.set('user', JSON.stringify(authState.user.attributes));
      } else {
        this.initUser();
        this.storage.remove('user');
      }
    });

  }

  initUser() {
    this.user = {
      displayName: null,
      email: null,
      photoURL: ''
    };
  }

  login(email, clave) {

    return new Promise((resolve, reject)=>{
      Auth.signIn({
        username: email,
        password: clave
      }).then(user => resolve({code: 'loggedIn'}))
        .catch(err => resolve(err));
    });

  }

  loginWithGoogle() {
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google
    }).then(res => {})
      .catch(err => {});
  }

  loginWithFacebook() {
    this.fb.login(['public_profile', 'email']).then((loginres: FacebookLoginResponse) => {
      if (loginres.status === 'connected') {
        this.fb.api('/me?fields=name,email', ['public_profile', 'email']).then((profileres: any) => {
          const federatedUser: FederatedUser = {
            name: profileres.name,
            email: profileres.email
          };
          const facebookResponse: FederatedResponse = {
            token: loginres.authResponse.accessToken,
            expires_at: loginres.authResponse.expiresIn * 1000 + new Date().getTime()
          };
          Auth.federatedSignIn('facebook', facebookResponse, federatedUser )
              .then(() => {
                /* Auth.currentAuthenticatedUser().then(currentUser => {
                  this.amplifyService.setAuthState({state: 'signedIn', user: currentUser});
                }); */
              }).catch(e => console.log(JSON.stringify(e)));
        });
      } else {
        console.log('Ocurrió un error');
      }
    }).catch(e => {
      console.log(JSON.stringify(e));
    });
  }

  createUser(email, clave, username){
    return new Promise((resolve, reject) => {
      Auth.signUp({
        username: email,
        password: clave,
        attributes: {
          name: username,
          picture: 'https://www.simplifai.ai/wp-content/uploads/2019/06/blank-profile-picture-973460_960_720-400x400.png'
        }
      }).then(data => {
        Auth.resendSignUp(email).then(() => {
          resolve({code: 'loggedIn'});
        }).catch(err => console.log(err));
      }).catch(err => resolve(err));
    });
  }

  logout() {
    Auth.signOut();
  }

}
