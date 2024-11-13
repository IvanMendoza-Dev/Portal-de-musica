import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { GLOBAL } from '../services/global';

import { User } from '../models/user';
import { Song } from '../models/song';
import { Album } from '../models/album';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, AlbumService, SongService]
})

export class SongAddComponent implements OnInit {

    public titulo: string;

    public identidad?: User | null;
    public user: User;
    public song: Song;
    public album: Album;

    public identity: boolean;
    public token?: string | null;
    public alertSong: string;
    public url: string;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService, private _songService: SongService) {
        this.titulo = 'Crear nueva canción';
        this.song = new Song('', 0, '', '', '', '');
        this.album = new Album('', '', '', 2000, '', '');
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '', '');
        this.identity = false;
        this.alertSong = '';
        this.url = GLOBAL.url;

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getAlbum();

    }

    onSubmit(){
        console.log(this.album);

        this._route.params.forEach((params: Params) =>{
            let album_id = params['idAlbum'];
            this.song.album = album_id;
        });
        if(this.token){
            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    if (!response.song) {
                        this.alertSong = 'Error en el servidor';
                    } else {
                        this.alertSong = 'La canción se ha creado correctamente';
                        this.song = response.song;
                        this._router.navigate(['/edit-song', this.song._id]);

                    }
                },
                error => {
                    if (error.error instanceof ErrorEvent) {
                        // Error del lado del cliente
                        this.alertSong = `Error: ${error.error.message}`;
                    } else {
                        // El backend devolvió un código de estado de error
                        this.alertSong = error.error.message || `Error ${error.status}: ${error.statusText}`;
                    }
                    console.error('Error:', error);
                }
            );
        }
    }

    getAlbum() {

        this._route.params.forEach((params: Params) => {
            let id = params['idAlbum'];

            if (this.token) {
                this._albumService.getAlbum(this.token, id).subscribe(
                    response => {
                        if (!response.album) {
                            this._router.navigate(['/']);
                        } else {
                            this.album = response.album;
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertSong = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertSong = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error);
                    }
                );

            }
        });
    }

}