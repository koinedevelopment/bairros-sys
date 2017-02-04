import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FireService } from './../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var jQuery: any;
declare var Materialize: any;

@Component({
  selector: 'app-sorteios',
  templateUrl: './sorteios.component.html',
  styleUrls: ['./sorteios.component.css']
})
export class SorteiosComponent implements OnInit {
  estabelecimento: any;
  estabelecimentos: any;
  carregando:boolean = true;
  formSorteio: FormGroup;
  data: any;
  sorteio: any = {};
  uid: string = null;
  sorteios: any[];
  selectedSorteio: any;
  inscricoes: any[];
  sorteado: any;
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private fireService: FireService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    jQuery('ul.tabs').tabs();
    jQuery('.modal').modal({
      complete: () => this.reset()
    });
    this.route.params.subscribe(
      params => {
        if(!params['id']){
          this.fireService.getEstabelecimentos()
            .subscribe(estabelecimentos => {
              this.estabelecimentos = estabelecimentos;
              this.carregando = false;
            })
        }
        if(params['id'])
        this.uid = params['id'];
          this.fireService.getEstabelecimentoById(params['id'])
            .then(snap => {
              this.estabelecimento = snap.val();
              this.carregando = false;
              this.onSelectEstabelecimento();
            })
      });
      
      this.fireService.getSorteiosPendentes()
        .subscribe(sorteios => {
          this.sorteios = sorteios;
        })
  }
  
  toast(mensagem: string){
    Materialize.toast(mensagem, 2000)
  }

  onSelectEstabelecimento(estabelecimento?:any){
    if(estabelecimento)
      this.estabelecimento = estabelecimento;
    this.formSorteio = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      obj_data: '',
      data: ''
    })
    jQuery('#sorteioModal').modal('open');
  }

  saveSorteio(){
    console.log(this.estabelecimento);
    console.log(this.formSorteio.value);
    let date = new Date(this.formSorteio.value.obj_data.momentObj.toDate());
    console.log(date.getTime());
    this.sorteio['titulo'] = this.formSorteio.value.titulo;
    this.sorteio['descricao'] = this.formSorteio.value.descricao;
    this.sorteio['data'] = this.formSorteio.value.obj_data.formatted;
    this.sorteio['timestamp'] = date.getTime();
    this.sorteio['nome_estabelecimento'] = this.estabelecimento.nome;
    this.sorteio['imagem'] = this.estabelecimento.imagemCapa;
    this.uid? this.sorteio['key_estabelecimento'] = this.uid: this.sorteio['key_estabelecimento'] = this.estabelecimento.$key; 
    this.sorteio['pendente'] = true;

    console.log(this.sorteio);
    this.fireService.saveSorteio(this.sorteio)
      .then(_ => {
        this.toast('Sorteio salvo com sucesso');
        this.formSorteio.reset();
      })
      .catch(err => {
        console.log(err);
      })
  }

  onSelectSorteio(sorteio){
    this.selectedSorteio = {};
    this.inscricoes = [];
    this.sorteado = {};
    jQuery('#sortearModal').modal('open');
    this.selectedSorteio = sorteio;
    this.fireService.getInscricoes(sorteio)
      .subscribe(inscricoes => {
        this.inscricoes = inscricoes;
      })
  }

  sortear(){
    console.log(this.inscricoes);
    if(this.inscricoes.length == 0){
      alert('Ninguém se inscreveu nesse sorteio');
      return;
    }
    if(this.inscricoes.length > 0){
      let resultado = Math.floor((Math.random() * this.inscricoes.length) + 1) - 1;
      this.sorteado['nome'] = this.inscricoes[resultado].nome_usuario;
      this.sorteado['email'] = this.inscricoes[resultado].email_usuario;
      this.sorteado['id'] = this.inscricoes[resultado].id_usuario;
    }
     
  }

  confirmarSorteio(){
    this.fireService.confirmarResultadoSorteio(this.selectedSorteio, this.sorteado)
      .then(_ => {
        this.toast('O resultado do sorteio foi homologado.')
      })
      .catch(err => {
        alert('Ocorreu algum erro');
        console.log(err);
      })
  }

  reset(){
    
  }
  console(){
    console.log(this.formSorteio.value);
    let date = new Date(this.formSorteio.value.obj_data.momentObj.toDate());
    console.log(date.getTime());
    this.sorteio['titulo'] = this.formSorteio.value.titulo;
    this.sorteio['descricao'] = this.formSorteio.value.descricao;
    this.sorteio['data'] = this.formSorteio.value.obj_data.formatted;
    this.sorteio['timestamp'] = date.getTime();
    this.sorteio['nome_estabelecimento'] = this.estabelecimento.nome;
    this.sorteio['imagem'] = this.estabelecimento.imagemCapa;
    this.sorteio['key_estabelecimento'] = this.estabelecimento.$key; 
    console.log(this.sorteio);
  }

}
