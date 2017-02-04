import { SorteiosComponent } from './sorteios/sorteios.component';
import { DestaqueComponent } from './destaque/destaque.component';
import { AdminGuard } from './services/admin.guard';
import { ClienteGuard } from './services/cliente.guard';
import { LoginComponent } from './login/login.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { EstabelecimentoComponent } from './estabelecimento/estabelecimento.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const appRoutes : Routes = [
    { path: '', component: ClienteComponent, canActivate: [ClienteGuard] },
    { path: 'login', component: LoginComponent},
    { path: 'cliente', component: ClienteComponent, canActivate: [ClienteGuard] },
    { path: 'estabelecimentos', component: EstabelecimentoComponent, canActivate: [AdminGuard] },
    { path: 'categorias', component: CategoriasComponent, canActivate: [AdminGuard] },
    { path: 'destaque', component: DestaqueComponent, canActivate: [AdminGuard] },
    { path: 'sorteios', component: SorteiosComponent, canActivate: [AdminGuard] },
    { path: 'sorteios/:id', component: SorteiosComponent, canActivate: [AdminGuard] }


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
