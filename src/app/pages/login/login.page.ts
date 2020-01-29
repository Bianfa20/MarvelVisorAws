import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  loguedIn: boolean;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private menuCtrl: MenuController 
  ) {
    this.loguedIn = false;
    this.email, this.password = '';
  }

  ngOnInit() {
  }

  login() {
    if (this.email !== '' && this.password !== '') {
      this.loguedIn = true;
      this.authService.login(this.email, this.password).then(res=>{
        this.loguedIn = false;
        switch(res["code"]) {

          case 'loggedIn':
            this.showToast('logueado');
            break;

          case 'UserNotConfirmedException':
            this.showToast('Debe confirmar la cuenta primero');
            break;

          case 'UserNotFoundException':
            this.showToast('Este correo no se encuentra registrado');
            break;

          case 'NotAuthorizedException':
            this.showToast('Contraseña incorrecta');
            break;

        }
      });
    } else {
      this.showToast('No debe haber campos vacios');
    }
  }

  toLogup() {
    this.navCtrl.navigateRoot('/logup');
  }

  loginWithGoogle() {
    // this.authService.loginWithGoogle();
    this.showToast('no funciona');
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  async showToast(message: string) {
    await Toast.show({
      text: message
    });
  }

}
