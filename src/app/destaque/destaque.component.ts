import { FireService } from './../services/fire.service';
import { Component, OnInit } from '@angular/core';

declare var jQuery: any;
declare var Materialize: any;

@Component({
  selector: 'app-destaque',
  templateUrl: './destaque.component.html',
  styleUrls: ['./destaque.component.css']
})
export class DestaqueComponent implements OnInit {

  destaques: any[];
  selectedDestaque: any;
  editFrase: boolean = false;
  fraseDestaque: string = '';
  constructor(private fireService: FireService) {
    this.fireService.getDestaques()
      .subscribe(destaques => {
        this.destaques = destaques;
      })
  }

  ngOnInit() {
    jQuery('.modal').modal({
      complete: () => {
        this.editFrase = false;
        this.fraseDestaque = '';
      }
    });
  }

  toast(mensagem: string){
    Materialize.toast(mensagem, 2000)
  }

  toggleFrase(){
    this.editFrase = true;
  }
  onSelectDestaque(destaque:any){
    this.fraseDestaque = destaque.frase;
    this.selectedDestaque = destaque;
    jQuery('#editDestaque').modal('open');
  }

  deleteDestaque(){
    let confirma = confirm('Tem certeza que deseja excluir esse destaque?');
    if(confirma)
      this.fireService.deleteDestaque(this.selectedDestaque)
        .then( _ => {
          this.toast('Destaque excluído');
          jQuery('#editDestaque').modal('close');
        })
        .catch(err => {
          console.log(err);
          alert('Ocorreu algum erro. Tente novamente mais tarde');
        })
  }

  updateDestaque(){
    this.selectedDestaque.frase = this.fraseDestaque;
    this.fireService.updateDestaque(this.selectedDestaque)
      .then( _ => {
        this.toast('Informações atualizadas');
      })
      .catch(err => {
        console.log(err);
        alert('Ocorreu algum erro. Tente novamente mais tarde');
      })
  }
}
