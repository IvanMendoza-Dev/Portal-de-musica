import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.compoment';
import { ArtistEditComponent } from './components/user-artist-edit.component';
import { UserDetailComponent } from './components/user-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { UserListComponent } from './components/user-list.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { ListRepDetailComponent } from './components/listRep-detail.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'users/:page', component: UserListComponent },
  { path: 'edit-artist/:id', component: ArtistEditComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'add-album/:idUser', component: AlbumAddComponent },
  { path: 'edit-album/:idAlbum', component: AlbumEditComponent },
  { path: 'album/:idAlbum', component: AlbumDetailComponent },
  { path: 'albums/:page', component: AlbumListComponent },
  { path: 'add-song/:idAlbum', component: SongAddComponent },
  { path: 'edit-song/:idSong', component: SongEditComponent },
  { path: 'list-rep/:idUser', component: ListRepDetailComponent },
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
