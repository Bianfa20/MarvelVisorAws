import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AmplifyService } from 'aws-amplify-angular';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor( private amplifyService: AmplifyService, private storage: Storage ) {

    this.amplifyService.authStateChange$.subscribe(authState => {
      console.log(authState.user)
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
