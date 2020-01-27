import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private storage: Storage
  ) { }

  ngOnInit() {}

  logout() {
    console.log('Prueba cerrar sesión')
  }

  deleteUser() {
    console.log('Prueba eliminar usuario')
  }

  clearDataBase() {
    console.log('limpiando base de datos')
  }

  async showToast(message: string) {
    await Toast.show({
      text: message
    });
  }

}
