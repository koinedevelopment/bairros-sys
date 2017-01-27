import { FireService } from './fire.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable()
export class ClienteGuard implements CanActivate {

    constructor(private fireService: FireService, private router: Router) { }

    canActivate():boolean | Promise<boolean> | Observable<boolean> {
        let observable: Observable<boolean> = new Observable(observer => {
            this.fireService.isLoggedInObservable()
                .subscribe(user => {
                    console.log('Cliente guard: ', user)
                    if(user){
                        this.fireService.getPerfilUser(user.auth.uid)
                            .then(snap => {
                                console.log(snap.val());
                                if(snap.val() === 'estabelecimento')
                                    observer.next(true);
                                else{
                                    observer.next(false);
                                }
                            })
                    }
                    else{
                        observer.next(false);
                        this.router.navigate(['login'])
                    }
                })

        })
        return observable;
    }
}