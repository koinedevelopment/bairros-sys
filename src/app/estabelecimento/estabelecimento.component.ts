import { FireService } from './../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

declare var Materialize: any;
declare var jQuery: any;

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.component.html',
  styleUrls: ['./estabelecimento.component.css']
})
export class EstabelecimentoComponent implements OnInit {
  estabelecimentos: any[];
  formEstabelecimento: FormGroup;
  maskTelefone = [ /[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  selectedEstabelecimento: any = null;
  destaque: boolean = false;
  fraseDestaque: string = '';
  constructor(private fb: FormBuilder, private fireService: FireService) { }

  ngOnInit() {
    jQuery('.modal').modal({
      complete: () => this.destaque = false
    });
    
    this.fireService.getEstabelecimentos()
      .subscribe(estabelecimentos => {
        console.log(estabelecimentos);
        this.estabelecimentos = estabelecimentos;
      });
    this.formEstabelecimento = this.fb.group({
      nome: ['', Validators.required],
      telefone: '',
      celular: this.fb.group({
        numero: [''],
        whatsapp: false
      }),
      validado: false,
      categoria: ['', Validators.required]
    })
  }

  toast(mensagem: string){
    Materialize.toast(mensagem, 2000)
  }
  onSubmitEstabelecimento(){
    this.fireService.saveEstabelecimento(this.formEstabelecimento.value)
      .then( _ => {
        this.toast('Estabelecimento cadastrado com sucesso.');
        this.formEstabelecimento.reset();
      })
      .catch(err => {
        console.log(err);
        alert('Ocorreu algum erro. Tente novamente mais tarde');
      })
  }

  onSelectEstabelecimento(estabelecimento){
    this.selectedEstabelecimento = estabelecimento;
    console.log(this.selectedEstabelecimento);
    jQuery('#editEstabelecimento').modal('open');
  }

  onSelectDestaque(checkbox){
    this.destaque = checkbox.checked;
    if(!this.destaque)
      this.fraseDestaque = '';
  }

  saveDestaque(){
    if(this.destaque){
      let obj_destaque = { 
        key_estabelecimento: this.selectedEstabelecimento.$key,
        nome_estabelecimento: this.selectedEstabelecimento.nome,
        frase: this.fraseDestaque
      };
      this.fireService.saveDestaque(obj_destaque)
        .then(_ => {
          this.toast('Dados salvos com sucesso.');
        })
        .catch(err => {
          alert('Ocorreu algum erro');
          console.log(err);
        })
    }
  }

  onChangeImagemAdicional(){
    this.fireService.updateTemImagemAdicional(this.selectedEstabelecimento)
      .then(_ => {
        this.toast('Dados alterados.')
      })
      .catch(err => {
        alert('Ocorreu algum erro.');
        console.log(err);
      })
  }

  onChangeValidade(){
    this.fireService.updateValidadeEstabelecimento(this.selectedEstabelecimento)
      .then(_ => {
        this.toast('Dados alterados.')
      })
      .catch(err => {
        alert('Ocorreu algum erro.');
        console.log(err);
      })
  }


  console(){
    console.log(this.formEstabelecimento.value);
  }
}
