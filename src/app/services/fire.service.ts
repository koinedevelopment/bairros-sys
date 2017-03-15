import { Injectable } from '@angular/core';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable, Subscription } from 'rxjs/Rx';

@Injectable()
export class FireService {

    estabelecimento: any;
    constructor(public af: AngularFire) {

    }

    saveCategoria(categoria: string, icone?:any): firebase.Promise<any> {
        if(icone){
            let key = '';
            key = firebase.database().ref('categorias/').push({nome: categoria}).key;
            return firebase.storage().ref('icones_categorias/'+key).put(icone)
                .then(snap => {
                    return firebase.database().ref('categorias/'+key).update({iconeUrl: snap.downloadURL});
                })
        }
        else{
            return firebase.database().ref('categorias/').push({nome: categoria});
        }
    }

    getCategorias(): Observable<any>{
        return this.af.database.list('categorias');
    }

    updateCategoria(categoria: any, icone?: any):firebase.Promise<any>{
        if(icone){
            let key = categoria.$key;
            return firebase.storage().ref('icones_categorias/'+key).put(icone)
                .then(snap => {
                    return this.af.database.list('categorias/').update(categoria.$key, {nome: categoria.nome, iconeUrl: snap.downloadURL});
                })
        }
        else
            return this.af.database.list('categorias/').update(categoria.$key, {nome: categoria.nome});
    }

    saveEstabelecimento(estabelecimento){
        estabelecimento['celular'] = {
            numero: '',
            whatsapp: false
        };
        return firebase.database().ref('estabelecimentos').push(estabelecimento)
            .then(estabelecimento => {
                console.log(estabelecimento);
                firebase.database().ref('categorias_estabelecimentos/'+estabelecimento.categoria)
            })
    }

    getEstabelecimentosByKeyCategoria(key: string):Observable<any> {
        return this.af.database.list('estabelecimentos', {
            query: {
                orderByChild: 'categoria',
                equalTo: key
            }
        })
    }

    setEstabelecimento (){
        console.log(firebase.auth().currentUser);
    }

    getEstablecimento():Observable<any> {
        let uid = firebase.auth().currentUser.uid;
        return this.af.database.list('estabelecimentos', {
            query: {
                orderByChild: 'uid',
                equalTo: uid
            }
        })
    }

    getEstabelecimentoById(id: string): firebase.Promise<any>{
        return firebase.database().ref('estabelecimentos/'+id).once('value');
    }

    getEstabelecimentos(){
        return this.af.database.list('estabelecimentos');
    }

    updateValidadeEstabelecimento(estabelecimento): firebase.Promise<any>{
        let categoria_validado = estabelecimento.categoria+'_'+!estabelecimento.validado;
        console.log(estabelecimento, categoria_validado);
        return this.af.database.list('estabelecimentos').update(estabelecimento.$key, { 
            validado: !estabelecimento.validado,
            categoria_validade: categoria_validado
        });
    }

    updateTemImagemAdicional(estabelecimento:any): firebase.Promise<any>{
        return this.af.database.list('estabelecimentos/').update(estabelecimento.$key, {
            temImagemAdicional: !estabelecimento.temImagemAdicional
        })
    }
    updateAtividadeCategoria(categoria: any):firebase.Promise<any>{
        return this.af.database.list('categorias').update(categoria.$key, {
            ativo: !categoria.ativo
        });
    }

    updateEstabelecimento(estabelecimento: any, key: string, imagemCapa?: File, imagemAdicional?: File){
        console.log(estabelecimento.localizacao);
        if(imagemCapa && imagemAdicional){
            let urlCapa: string = '';
            let urlAdicional: string = '';

            return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagemCapa)
                .then(result => {
                    urlCapa = result.downloadURL;
                    return firebase.storage().ref('estabelecimentos/'+key+'/imagemAdicional.jpg').put(imagemAdicional)
                        .then(result2 => {
                            urlAdicional = result2.downloadURL;
                            return firebase.database().ref('estabelecimentos/'+key).update({
                                    nome: estabelecimento.nome,
                                    telefone: estabelecimento.telefone,
                                    celular: {
                                        numero: estabelecimento.celular.numero,
                                        whatsapp: estabelecimento.celular.whatsapp
                                    },
                                    frase: estabelecimento.frase,
                                    palavras_chave: estabelecimento.palavras_chave,
                                    endereco: estabelecimento.endereco,
                                    localizacao: {
                                        latitude: estabelecimento.localizacao.latitude,
                                        longitude: estabelecimento.localizacao.longitude,
                                    },
                                    imagemCapa: urlCapa,
                                    imagemAdicional: urlAdicional
                                })
                        })
                })
        }
        
        if(imagemCapa && !imagemAdicional){
            let urlCapa: string = '';

            return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagemCapa)
                .then(result => {
                    urlCapa = result.downloadURL;
                    return firebase.database().ref('estabelecimentos/'+key).update({
                            nome: estabelecimento.nome,
                            telefone: estabelecimento.telefone,
                            celular: {
                                numero: estabelecimento.celular.numero,
                                whatsapp: estabelecimento.celular.whatsapp
                            },
                            frase: estabelecimento.frase,
                            palavras_chave: estabelecimento.palavras_chave,
                            endereco: estabelecimento.endereco,
                            localizacao: {
                                latitude: estabelecimento.localizacao.latitude,
                                longitude: estabelecimento.localizacao.longitude,
                            },
                            imagemCapa: urlCapa
                        })
                })
        }

        if(!imagemCapa && imagemAdicional){
            let urlAdicional: string = '';

            return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagemAdicional)
                .then(result => {
                    urlAdicional = result.downloadURL;
                    return firebase.database().ref('estabelecimentos/'+key).update({
                            nome: estabelecimento.nome,
                            telefone: estabelecimento.telefone,
                            celular: {
                                numero: estabelecimento.celular.numero,
                                whatsapp: estabelecimento.celular.whatsapp
                            },
                            frase: estabelecimento.frase,
                            palavras_chave: estabelecimento.palavras_chave,
                            endereco: estabelecimento.endereco,
                            localizacao: {
                                latitude: estabelecimento.localizacao.latitude,
                                longitude: estabelecimento.localizacao.longitude,
                            },
                            imagemAdicional: urlAdicional
                        })
                })
        }

        else{
            return firebase.database().ref('estabelecimentos/'+key).update({
                nome: estabelecimento.nome,
                telefone: estabelecimento.telefone,
                celular: {
                    numero: estabelecimento.celular.numero,
                    whatsapp: estabelecimento.celular.whatsapp
                },
                frase: estabelecimento.frase,
                palavras_chave: estabelecimento.palavras_chave,
                endereco: estabelecimento.endereco,
                localizacao: {
                    latitude: estabelecimento.localizacao.latitude,
                    longitude: estabelecimento.localizacao.longitude,
                },
            })
        }


    }    
    
    updateEstabelecimentoInfoGerais(estabelecimento: any, key:string){
        return firebase.database().ref('estabelecimentos/'+key).update({
                nome: estabelecimento.nome,
                telefone: estabelecimento.telefone,
                celular: {
                    numero: estabelecimento.celular.numero,
                    whatsapp: estabelecimento.celular.whatsapp
                },
                frase: estabelecimento.frase,
                palavras_chave: estabelecimento.palavras_chave,
            })
    }

    updateEstabelecimentoLocalizacao(estabelecimento: any, key:string){
        return firebase.database().ref('estabelecimentos/'+key).update({
                endereco: estabelecimento.endereco,
                localizacao: {
                    latitude: estabelecimento.localizacao.latitude,
                    longitude: estabelecimento.localizacao.longitude,
                }
            })
    }

    updateImagens(imagens: any, key: string){
        console.log(imagens, key);
        let urlCapa: string = '';
        let urlAdicional: string = '';

        if(imagens.imagemCapa && imagens.imagemAdicional){

            return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagens.imagemCapa)
                .then(result => {
                    urlCapa = result.downloadURL;
                    return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagens.imagemAdicional)
                            .then(result2 => {
                                urlAdicional = result2.downloadURL;
                                return firebase.database().ref('estabelecimentos/'+key).update({
                                    imagemCapa: urlCapa,
                                    imagemAdicional: urlAdicional
                                })
                            })
                })
        }
        else if(imagens.imagemCapa){
            return firebase.storage().ref('estabelecimentos/'+key+'/imagemCapa.jpg').put(imagens.imagemCapa)
                .then(result => {
                    urlCapa = result.downloadURL;
                    return firebase.database().ref('estabelecimentos/'+key).update({
                        imagemCapa: urlCapa
                    })
                })
        }

        else if(imagens.imagemAdicional){
            return firebase.storage().ref('estabelecimentos/'+key+'/imagemAdicional.jpg').put(imagens.imagemAdicional)
                .then(result => {
                    urlCapa = result.downloadURL;
                    return firebase.database().ref('estabelecimentos/'+key).update({
                        imagemAdicional: urlCapa
                    })
                })
        }

    }

    deleteCategoria(categoria):firebase.Promise<any> {
        return firebase.database().ref('categorias/'+categoria.$key).remove();
    }
    
    getDestaques(){
        return this.af.database.list('destaques/');
    }

    saveDestaque(destaque:any):firebase.Promise<any> {
        return this.af.database.list('destaques/').push(destaque)
            .then(_ => {
                return this.af.database.list('estabelecimentos/').update(destaque.key_estabelecimento, {
                    destaque: true
                })
            })
    }

    updateDestaque(destaque):firebase.Promise<any>{
        return this.af.database.list('destaques/').update(destaque.$key, {
            frase: destaque.frase
        });
    }

    deleteDestaque(destaque):firebase.Promise<any>{
        return this.af.database.list('estabelecimentos/').update(destaque.key_estabelecimento, {
            destaque: false
        })
            .then(_ => {
                this.af.database.list('destaques/'+destaque.$key).remove();
            })
    }
    

    saveSorteio(sorteio: any){
        return firebase.database().ref('sorteios/').push(sorteio);
    }

    getSorteiosPendentes(): Observable<any> {
        return this.af.database.list('sorteios', {
            query: {
                orderByChild: 'pendente',
                equalTo: true
            }
        });
    }

    getInscricoes(sorteio){
        return this.af.database.list('inscricoes', {
            query: {
                orderByChild: 'id_sorteio',
                equalTo: sorteio.$key
            }
        });
    }


    confirmarResultadoSorteio(sorteio: any, sorteado: any):firebase.Promise<any>{
        return this.af.database.list('sorteios/').update(sorteio.$key, {pendente: false, ganhador: sorteado});
    }
    //AUTENTICAÇÃO
    isLoggedIn(): boolean{
        let user = firebase.auth().currentUser;
        if(user)
            return true;
        else    
            return false;
    }

    isLoggedInObservable(): Observable<any>{
        return this.af.auth.do(auth => {
            if(auth){
                let subscription: Subscription = this.getEstablecimento()
                                                    .subscribe(estabelecimentos => {
                                                        console.log('estabelecimento');
                                                        this.estabelecimento = estabelecimentos[0];
                                                        if(this.estabelecimento)
                                                            subscription.unsubscribe();
                                                    });
            }
            else
                console.log('Não tem auth');
        });
    }

    isValidado(uid: string): firebase.Promise<any>{
        return firebase.database().ref('usuarios/'+uid+'/key_estabelecimento').once('value')
            .then(snap => {
               return firebase.database().ref('estabelecimentos/'+snap.val()+'/validado').once('value');
            })
    }

    getPerfilUser(uid){
        return firebase.database().ref('usuarios/'+uid+'/perfil').once('value');
    }

    login(user: any){
        return this.af.auth.login({email: user.email, password: user.password}, { provider: AuthProviders.Password, method: AuthMethods.Password})
    }

      
  signupEstabelecimento(user):Promise<any> {
    let promise: Promise<any>;
    let uid: string;

    promise = new Promise((resolve, reject) => {
      this.af.auth.createUser({email: user.email, password: user.password})
        .then(data => {
          uid = data.uid;
          let key = firebase.database().ref('estabelecimentos/').push({
            nome: user.estabelecimento,
            uid: data.uid,
            email: data.auth.email,
            validado: false,
            categoria: user.categoria,
            categoria_validade: user.categoria +'_false', 
            endereco: '',
            descricao: '',
            celular: {
                numero: '',
                whatsapp: false
            },
            frase: '',
            imagemAdicional: '',
            imagemCapa: '',
            localizacao: {
                latitude: '',
                longitude: ''
            },
            telefone: '',
            palavras_chave: ''
          })
            .then(data2 => {
                firebase.database().ref('usuarios/'+uid).set({
                    perfil: 'estabelecimento',
                    key_estabelecimento: data2.key
                })
                .then(data => {
                    resolve(true);
                })
            })
        })
        .catch(err => {
            console.log(err);
            if(err['code'] == "auth/email-already-in-use"){
                alert('Esse email já está sendo utilizando em outra conta. Use outro email para se registrar');
            }
        })
    })
    
    return promise;
  }

  logout(): firebase.Promise<any>{
    console.log('logout')
    return firebase.auth().signOut();
  }


}