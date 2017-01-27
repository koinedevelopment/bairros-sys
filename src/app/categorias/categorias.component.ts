import { Observable, Subscription } from 'rxjs/Rx';
import { FireService } from './../services/fire.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var jQuery: any;
declare var Materialize: any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[];
  selectedCategoria: any;
  icone: any;
  iconeEdit: any;

  selecionouIcone = false;
  nomeCategoria: string = '';

  @ViewChild('icone') iconeLabel : ElementRef;
  @ViewChild('pathWrapper') pathWrapper : ElementRef;

  constructor(private fireService: FireService) { }


  ngOnInit() {
    jQuery('.modal').modal({
      complete: this.resetEdit
    });
    this.fireService.getCategorias()
      .subscribe(categorias => {
        this.categorias = categorias;
      });
      console.log(this.iconeLabel);
  }

  toast(mensagem: string){
    Materialize.toast(mensagem, 2000)
  }

  resetEdit(){
    this.selectedCategoria = null;
    this.iconeEdit = null;
    console.log('Reset Edit', this.selectedCategoria, this.iconeEdit)
  }

  onSelectCategoria(categoria){
    this.iconeEdit = categoria.iconeUrl;
    this.selectedCategoria = categoria;
    jQuery('#editCategoria').modal('open');
  }

  onChange(event){
    console.log(this.iconeLabel);
    let fileReader: FileReader = new FileReader();
    this.icone = event.srcElement.files[0];
    console.log(this.icone);
    fileReader.onload = () => {
        //this.iconeSelecionado = fileReader.result;
        this.selecionouIcone = true;
      }
      fileReader.readAsDataURL(this.icone);
      console.log(this.icone);
  }

  onChangeEdit(event){
    console.log(this.iconeLabel);
    let fileReader: FileReader = new FileReader();
    this.iconeEdit = event.srcElement.files[0];
    console.log(this.iconeEdit);
    fileReader.onload = () => {
        //this.iconeSelecionado = fileReader.result;
        this.selecionouIcone = true;
      }
      fileReader.readAsDataURL(this.iconeEdit);
      console.log(this.iconeEdit);
  }

  onChangeAtividade(categoria: any){
    this.fireService.updateAtividadeCategoria(categoria)
      .then(_ => {
        this.toast('Dados alterados.')
      })
      .catch(err => {
        alert('Ocorreu algum erro.');
        console.log(err);
      })
  }

  onSubmitCategoria(){
    this.fireService.saveCategoria(this.nomeCategoria, this.icone)
      .then(_ => {
        this.nomeCategoria = '';
        this.icone = null;
        this.pathWrapper.nativeElement.value = '';
        this.toast('Categoria salva com sucesso');
      })
      .catch(err => {
        console.log(err);
      })
  }

  onSubmitEdit(){
    jQuery('#editCategoria').modal('open');
    if(this.iconeEdit)
      this.fireService.updateCategoria(this.selectedCategoria, this.iconeEdit)
        .then(_ => {
          this.resetEdit();
          this.pathWrapper.nativeElement.value = '';
          this.toast('Categoria atualizada com sucesso')
        })
        .catch(err => {
          console.log(err);
          alert('Ocorreu algum erro durante o processo. Tente novamente mais tarde.');
        })  
    
    else 
      this.fireService.updateCategoria(this.selectedCategoria)
        .then(_ => {
        this.toast('Categoria atualizada com sucesso')
        })
        .catch(err => {
          console.log(err);
          alert('Ocorreu algum erro durante o processo. Tente novamente mais tarde.');
        })
  }

  onDeleteCategoria(){
    let observable: Subscription = this.fireService.getEstabelecimentosByKeyCategoria(this.selectedCategoria.$key)
      .subscribe(estabelecimentos => {
        console.log(estabelecimentos);
        if(estabelecimentos.length > 0){
          let confirma = confirm('A categoria que você quer você quer excluir possui '+estabelecimentos.length+' cadastrados. Tem certeza dessa operação?');
          if(confirma)
            this.fireService.deleteCategoria(this.selectedCategoria)
              .then(_ => {
                jQuery('#editCategoria').modal('close');
                this.toast('Categoria excluída com sucesso.');
                this.resetEdit();
                observable.unsubscribe();
              });
            else  
              return;
        }
        else{
          this.fireService.deleteCategoria(this.selectedCategoria)
            .then(_ => {
              jQuery('#editCategoria').modal('close');
              this.toast('Categoria excluída com sucesso.');
              this.resetEdit();
              observable.unsubscribe();
            });
        }

      });
  }

}
