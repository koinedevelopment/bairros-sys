import { FireService } from './../services/fire.service';
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

declare var Materialize: any;
declare var jQuery: any;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  categorias: any[];
  markers: any[] = [];
  formEstabelecimento: FormGroup;
  formInfoGerais: FormGroup;
  formLocalizacao: FormGroup;
  keyEstabelecimento: string;
  estabelecimento: any;
  zoom: number;
  maskTelefone = [ /[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = [ /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  setLocation: boolean = false;
  mapaAberto: boolean = false;
  mapaCarregado: boolean = false;
  imagemCapa: any = null;
  imagemAdicional: any = null;
  urlImagemCapa: any = null;
  urlImagemAdicional: any = null;
  temImagemAdicional:boolean = false;
  loading: boolean = false;

  @ViewChild("search") searchElementRef: ElementRef;

  constructor(
              private fb: FormBuilder, 
              private fireService: FireService, 
              private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.zoom = 1;
    jQuery('.modal').modal();
    jQuery('ul.tabs').tabs();

    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      });
    this.fireService.getEstablecimento()
      .subscribe(estabelecimento => { 
        this.estabelecimento = estabelecimento[0];
        this.setPosition();
        console.log('this.estabelecimento: ', this.estabelecimento);

        if(this.estabelecimento){
          this.formInfoGerais.patchValue({
            nome: this.estabelecimento.nome,
            telefone: this.estabelecimento.telefone,
            celular: {
              numero: this.estabelecimento.celular.numero,
              whatsapp: this.estabelecimento.celular.whatsapp
            },
            frase: this.estabelecimento.frase,
            palavras_chave: this.estabelecimento.palavras_chave
          });
          this.formLocalizacao.patchValue({
            endereco: this.estabelecimento.endereco
          });
          
          this.temImagemAdicional = this.estabelecimento.temImagemAdicional;
        }
          
      })
      
    this.formInfoGerais = this.fb.group({
      nome: ['', Validators.required],
      telefone: '',
      celular: this.fb.group({
        numero: [''],
        whatsapp: false
      }),
      frase: '',
      palavras_chave: '',
    });

    this.formLocalizacao = this.fb.group({
      endereco: '',
      localizacao: this.fb.group({
        latitude: '',
        longitude: ''
      })
    });
  }

  toast(mensagem: string){
    Materialize.toast(mensagem, 2000)
  }

  toggleMap(){
    let confirma1 = confirm('Deseja atualizar a localização do estabelecimento para sua localização atual?'); //Verifica se o cliente quer atualizar a localização do estabelecimento para a localização atua
    if(confirma1){
      this.formEstabelecimento.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
    }
    if(this.mapaAberto){ //Quando o cliente fecha o mapa, o sistema confirma se ele quer realmente alterar a localização
      let confirma2 = confirm('Confirma alteração da localização do estabelecimento?')
      if(confirma2){
        this.formEstabelecimento.patchValue({
          latitude: this.latitude,
          longitude: this.longitude
        });
      }
    }
    this.mapaAberto = !this.mapaAberto;
  }
  openModal(){
    this.setLocation = true;
    jQuery('#modalLocation').modal('open');
    this.setPosition();
    
  }
  onChange($event, tipo){
    
    let fileReader: FileReader = new FileReader();
    
    if(tipo === 'capa'){
      this.imagemCapa = $event.srcElement.files[0];
      fileReader.onload = ($event) => {
          this.urlImagemCapa = $event.target['result'];
      }

      fileReader.readAsDataURL(this.imagemCapa);

    }
    
    if(tipo === 'adicional'){
      
      this.imagemAdicional = $event.srcElement.files[0];
      fileReader.onload = ($event) => {
          this.urlImagemAdicional = $event.target['result'];
      }
      fileReader.readAsDataURL(this.imagemAdicional);
      console.log(this.imagemAdicional);
    }
  }

  setMap(lat:number, lng:number, marker?:boolean){
    let map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      
    });
    let latLng: google.maps.LatLng = new google.maps.LatLng(lat, lng);
    if(marker)
      this.addMarker(map, latLng)

    google.maps.event.addListener(map, 'click', (event) => {
      this.addMarker(map, event.latLng);
    });
  }

  addMarker(map: google.maps.Map, latLng: google.maps.LatLng){
    console.log(latLng.lat());
    this.formLocalizacao.controls['localizacao'].setValue({
      latitude: latLng.lat(),
      longitude: latLng.lng()
    })
    console.log(this.formLocalizacao.controls['localizacao']);
    let marker = new google.maps.Marker({
      position: latLng
    })
    if(this.markers.length == 0){
        this.markers.push(marker);
        this.markers[0].setMap(map);
        
      }

      else{
        let lastMarker = this.markers.length - 1; 
        this.markers[lastMarker].setMap(null);
        this.markers.push(marker);
        this.markers[lastMarker + 1].setMap(map); 
      }  

  }


  setCurrentPosition(){
     navigator.geolocation.getCurrentPosition((position) => {
      
        this.setMap(position.coords.latitude, position.coords.longitude);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.mapaCarregado = true;

      });
  }
  setPosition() {
    if(this.estabelecimento.localizacao){
      this.setMap(this.estabelecimento.localizacao.latitude, this.estabelecimento.localizacao.longitude, true);
      this.latitude = this.estabelecimento.localizacao.latitude;
      this.longitude = this.estabelecimento.localizacao.longitude;
      this.zoom = 15;
      this.mapaCarregado = true;
    }
    else if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
      
        this.setMap(position.coords.latitude, position.coords.longitude);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.mapaCarregado = true;

      });
    }
  }

  mapClick($event){
    console.log($event);

  }

  dragEnd($event){
    console.log($event)
  }

  onSubmitEstabelecimento(){
    console.log(this.formEstabelecimento);
    this.fireService.updateEstabelecimento(this.formEstabelecimento.value, this.estabelecimento.$key, this.imagemCapa, this.imagemAdicional)
      .then( _ => {
        this.toast('Dados alterados');
      })
      .catch(err => {
        console.log(err);
        alert('Ocorreu algum erro. Tente novamente mais tarde');
      })
  }

  onSubmitInfoGerais(){
    console.log('Informações gerais: ', this.formInfoGerais);
    this.fireService.updateEstabelecimentoInfoGerais(this.formInfoGerais.value, this.estabelecimento.$key)
      .then( _ => {
        this.toast('Dados alterados');
      })
      .catch(err => {
        console.log(err);
        alert('Ocorreu algum erro. Tente novamente mais tarde');
      })
  }
  onSubmitImagens(){
    let imagem = {
      imagemCapa: this.imagemCapa,
      imagemAdicional: this.imagemAdicional
    }

    this.loading = true;
    this.fireService.updateImagens(imagem, this.estabelecimento.$key)
      .then(_ => {
        this.loading = false;
        this.toast('Imagens atualizadas');
      })
  }
  onSubmitLocalizacao(){
    console.log('Informações gerais: ', this.formInfoGerais);
    this.fireService.updateEstabelecimentoLocalizacao(this.formLocalizacao.value, this.estabelecimento.$key)
      .then( _ => {
        this.toast('Dados alterados');
      })
      .catch(err => {
        console.log(err);
        alert('Ocorreu algum erro. Tente novamente mais tarde');
      });
  }

  console(){
    console.log(this.formEstabelecimento.value);
  }
}