import { StorageProvider } from './../providers/storage/storage';
import { AuthProvider } from './../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private authProvider: AuthProvider,
    private toastCtrl: ToastController,
    private storageProvider: StorageProvider,
  ) {
    this.setRootPage();
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Modules', component: 'ModulesPage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  setRootPage() {
    this.storageProvider.getUserId().then(uid => {
      if(uid) {
        this.authProvider.user.uid = uid;
        console.log("uid from authP", this.authProvider.user.uid);
        this.rootPage = 'HomePage'
      } else {
        console.log("there is no uid", this.authProvider.user.uid);
        this.rootPage = 'LoginPage';
      }
    });
  }

  logout() {
    this.authProvider.logout().then((d) => {
      console.log("logged out", d);

      this.storageProvider.clear().then(d => {
        this.nav.setRoot('LoginPage');
      }).catch(e => {
        console.error(e);
      });
      
    }).catch(e => {
      console.error("Error : ", e);
    });
  }
}
