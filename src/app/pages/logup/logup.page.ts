import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraDirection } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../providers/auth/auth.service';
import { StorageService } from '../../providers/storage/storage.service';
import { Storage } from '@ionic/storage';
const { Toast } = Plugins;

@Component({
  selector: 'app-logup',
  templateUrl: './logup.page.html',
  styleUrls: ['./logup.page.scss'],
})
export class LogupPage implements OnInit {

  stateOne: number;
  picture: string;
  picture64: string;
  username: string;
  email: string;
  password: string;
  passwordC: string;
  message: string;
  loader: boolean;

  constructor( 
    private navCtrl: NavController,
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private storageService: StorageService,
    private menuCtrl: MenuController
  ) {
    this.stateOne = 0;
    this.username, this.email, this.password, this.passwordC = '';
  }

  ngOnInit() {
  }

  backToLogin(){
    this.navCtrl.navigateBack('/login');
  }

  upperState(){
    this.stateOne += 1;
  }

  lowerState(){
    this.stateOne -= 1;
  }

  async takePicture(flag) {

    this.loader = true;

    await Plugins.Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      direction: CameraDirection.Front,
      source: flag ? CameraSource.Camera : CameraSource.Photos,
      correctOrientation: true
    }).then(image => {
      this.picture = 'data:image/jpeg;base64,' + image.base64String;
      this.picture64 = image.base64String;
      this.loader = false;
      this.upperState();
    });

  }

  saveData() {
    this.loader = true;
    if (this.username !== '' && this.email !== '' && this.password !== '' && this.passwordC !== '') {
      if (this.password === this.passwordC) {
        this.authService.createUser(this.email, this.password, this.username).then(res => {
          this.loader = false;
          switch (res['code']) {

            case 'loggedIn':
              this.navCtrl.navigateBack('/login');
              this.showToast('Usuario registrado exitosamente');
              break;

            case 'InvalidParameterException':
              this.message = 'Correo invalido.';
              break;

            case 'UsernameExistsException':
              this.message = 'Este correo ya se encuentra registrado.';
              break;

            case 'InvalidPasswordException':
              this.message = 'La contraseña debe ser mayor a 6 caracteres.';
              break;

          }
        });
      } else {
        this.message = 'Contraseñas no coinciden.';
      }
    } else {
      this.message = 'No debe haber campos vacios.';
    }
  }

 async showToast(message: string) {
    await Toast.show({
      text: message
    });
  }

}
