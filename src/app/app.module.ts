import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';

// Aws amplify
import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';

// Plugins
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';

// Providers
import { ComicsService } from './providers/comics/comics.service';
import { AuthService } from './providers/auth/auth.service';
import { StorageService } from './providers/storage/storage.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ComponentsModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: 'marvel_visor'
    }),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AmplifyAngularModule
  ],
  providers: [
    {
      provide: AmplifyService,
      useFactory:  () => {
        return AmplifyModules({
          Auth
        });
      }
    },
    Facebook,
    AuthService,
    StorageService,
    ComicsService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
