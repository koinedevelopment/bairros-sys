import { AdminGuard } from './services/admin.guard';
import { ClienteGuard} from './services/cliente.guard';
import { FireService } from './services/fire.service';
import { routing } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DatePickerModule } from 'ng2-datepicker';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { EstabelecimentoComponent } from './estabelecimento/estabelecimento.component';
import { HeaderComponent } from './header/header.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteComponent } from './cliente/cliente.component';
import { LoginComponent } from './login/login.component';
import { DestaqueComponent } from './destaque/destaque.component';
import { SorteiosComponent } from './sorteios/sorteios.component';

const config = {
    apiKey: "AIzaSyA3MLge8e6_dGgcYjs8L4MAEeWVTT-QSjE",
    authDomain: "bairros-59d57.firebaseapp.com",
    databaseURL: "https://bairros-59d57.firebaseio.com",
    storageBucket: "bairros-59d57.appspot.com",
    messagingSenderId: "638539267125"
  };

@NgModule({
  declarations: [
    AppComponent,
    EstabelecimentoComponent,
    HeaderComponent,
    CategoriasComponent,
    ClienteComponent,
    LoginComponent,
    DestaqueComponent,
    SorteiosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AngularFireModule.initializeApp(config),
    ReactiveFormsModule,
    TextMaskModule,
    DatePickerModule
  ],
  providers: [
    FireService,
    ClienteGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
