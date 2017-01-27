import { Router } from '@angular/router';
import { FireService } from './../services/fire.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

declare var jQuery: any;
declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  formSignup: FormGroup;
  categorias: any[];
  constructor(public formBuilder: FormBuilder, public fireService: FireService, public router: Router) {
    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      })

    this.formLogin = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })

    this.formSignup = this.formBuilder.group({
      'email': ['', Validators.required],
      'estabelecimento': ['', Validators.required],
      'categoria': ['', Validators.required],
      'password': ['', Validators.required],
      'password_confirm': ['', Validators.required]
    })  

  }

  ngOnInit() {
    this.router.navigate(['/cliente']);
    jQuery('.modal').modal();
  }

  ngOnDestroy(){
    
  }

  toast(mensagem: string){
    Materialize.toast(mensagem, 2000);
  }

  onSubmitLogin(){
    let user = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };
    let perfil: string = '';

    this.fireService.login(user)
      .then(result => {
        console.log(result);
        this.fireService.isValidado(result.uid)
          .then(snap =>{
              this.fireService.getPerfilUser(result.uid)
                .then(snap2 => {
                  if(snap2.val() === 'administrador')
                    this.router.navigate(['/estabelecimentos']);
                  if(snap2.val() === 'estabelecimento' && snap.val())
                    this.router.navigate(['/cliente']);
                  
                  if(snap2.val() === 'estabelecimento' && !snap.val()){
                    this.fireService.logout();
                    this.router.navigate[''];
                    alert('Seu estabelecimento ainda não foi validado. Se você está com o cadastro em dia, entre em contato com o administrador.');
                  }
                })
            
          });
        this.formLogin.reset();
      })
      .catch(err => {
        if(err['code'] == "auth/wrong-password"){
          alert('Senha incorreta.');
          this.formLogin.controls['password'].reset();
        }

        else if(err['code'] == "auth/user-not-found"){
          alert('Usuário não cadastrado.');
          this.formLogin.reset();
        }

        else if(err['code'] == "auth/invalid-email"){
          alert('Digite um email válido.');
          this.formLogin.reset();
        }
        else if(err['code'] == "auth/email-already-in-use"){
          alert('O email digitado já foi cadastrado em nossa base de dados. Por favor, utilize outro email ou insira a senha correta.');
          this.formLogin.reset();
        }
        else if(err['code'] == "auth/network-request-failed"){
          alert('Houve algum problema com sua conexão. Tente novamente mais tarde.');
          this.formLogin.reset();
        }

        
        console.log(err);
      })
  }
  
  onSubmitSignup(){
    console.log(); 
    if(this.formSignup.value.password != this.formSignup.value.password_confirm){
      alert('As senhas não coincidem.');
      this.formSignup.controls['password_confirm'].reset();
    }
    else{
      let signup = {
        email: this.formSignup.value.email,
        estabelecimento: this.formSignup.value.estabelecimento,
        password: this.formSignup.value.password,
        categoria: this.formSignup.value.categoria
      }
      this.fireService.signupEstabelecimento(signup)
        .then(() => {
          this.toast('Usuário criado com sucesso.');
          this.router.navigate(['estabelecimentos']);
        })
        .catch(err => {
          if(err['code'] == "auth/email-already-in-use"){
            alert('O email digitado já foi cadastrado em nossa base de dados. Por favor, utilize outro email ou insira a senha correta.');
            this.formSignup.reset();
          }
        })
    }  
  }
}
