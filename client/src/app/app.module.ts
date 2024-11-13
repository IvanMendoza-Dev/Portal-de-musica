import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { UserListComponent } from './components/user-list.component';
import { HomeComponent} from './components/home.compoment';
import { ArtistEditComponent } from './components/user-artist-edit.component';
import { UserDetailComponent } from './components/user-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlayerComponent } from './components/player.component';
import { ListRepDetailComponent } from './components/listRep-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    UserListComponent,
    HomeComponent,
    ArtistEditComponent,
    UserDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    AlbumListComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent,
    ListRepDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
