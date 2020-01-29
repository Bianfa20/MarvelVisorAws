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

    this.amplifyService.authStateChange$.subscribe(authState => {
      console.log(JSON.stringify(authState.user));
    });

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
    /* Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google
    }).then(res => {})
      .catch(err => {}); */
  }

  loginWithFacebook() {
    this.fb.login(['public_profile', 'email']).then((loginres: FacebookLoginResponse) => {
      if (loginres.status === 'connected') {
        this.fb.api('/me?fields=name,email', []).then((profileres: any) => {
          const federatedUser: FederatedUser = {
            name: profileres.name,
            email: profileres.email
          };
          const facebookResponse: FederatedResponse = {
            token: loginres.authResponse.accessToken,
            expires_at: loginres.authResponse.expiresIn * 1000 + Date.now()
          };
          if (!facebookResponse.token) {
            return;
          }
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
    Auth.signUp({
      username: email,
      password: clave,
      attributes: {
        name: username,
        picture: ''
      }
    }).then(data=>console.log(data))
      .catch(err=>console.log(err));

    /* Auth.resendSignUp(email).then(()=>{
      console.log('Codigo envido exitosamente');
    }).catch(err=>console.log(err)) */
    
  }

}
