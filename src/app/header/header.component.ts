import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FireService } from './../services/fire.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  observableAuth: Observable<any>;
  subscription: Subscription;
  isCliente: boolean = false;
  isAdmin: boolean = false;

  constructor(private fireService: FireService, private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.fireService.getPerfilUser(user.uid)
          .then(snap => {
            if(snap.val() === 'estabelecimento')
              this.isCliente = true;
            if(snap.val() === 'administrador')
              this.isAdmin = true;
          })
        this.isAuthenticated = true;
        }
      else{
        this.isAdmin = false;
        this.isCliente = false;
        this.isAuthenticated = false;
      }
      })
  }

  isAuth(){
    
  }

  logout(){
    this.fireService.logout()
      .then( _ => {
        this.router.navigate(['/']);
      });
  }
}
