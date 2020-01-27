import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor( private storage: Storage ) {

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
