import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { ListRepService } from '../services/listRep.service';

import { GLOBAL } from '../services/global';
import { User } from '../models/user';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { ListRep } from '../models/listRep';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService, ListRepService]
})

export class AlbumDetailComponent implements OnInit {

    public title: string;
    public user: User;
    public album: Album;
    public identidad?: User | null;
    public songs: Song[];
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public alertDetail: string;
    public confirmado: string;
    public listRep: ListRep;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService, private _songService: SongService, private _listRepService: ListRepService) {
        this.title = 'Detalles del Album';
        this.user = new User('', '', '', '', '', '', '', '', '');
        this.album = new Album('', '', '', 2000, '', '');
        this.songs = [];
        this.identity = false;
        this.url = GLOBAL.url;
        this.alertDetail = '';
        this.confirmado = '';
        this.listRep = new ListRep('', '', '');
    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getAlbum();
    }

    getAlbum() {

        this._route.params.forEach((params: Params) => {
            let id = params['idAlbum'];

            //Sacar el album
            if (this.token) {
                this._albumService.getAlbum(this.token, id).subscribe(
                    response => {
                        if (!response.album) {
                            this.alertDetail = 'No existe este album';
                        } else {
                            this.album = response.album;
                            let usuario = JSON.stringify(this.album.user);
                            this.user = JSON.parse(usuario);

                            //Sacar las canciones del album
                            if (this.token) {
                                this._songService.getSongs(this.token, this.album._id).subscribe(
                                    response => {
                                        if (!response.songs) {
                                            this.alertDetail = 'Este album no tiene canciones';
                                        } else {
                                            this.songs = response.songs;
                                        }
                                    },
                                    error => {
                                        if (error.error instanceof ErrorEvent) {
                                            // Error del lado del cliente
                                            this.alertDetail = `Error: ${error.error.message}`;
                                        } else {
                                            // El backend devolvió un código de estado de error
                                            this.alertDetail = error.error.message || `Error ${error.status}: ${error.statusText}`;
                                        }
                                        console.error('Error:', error);
                                    }
                                );
                            }
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertDetail = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertDetail = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error);
                    }
                );
            }
        });
    }

    onDeleteConfirm(id: string) {
        this.confirmado = id;
    }

    onDeleteSong(id: string) {
        if (this.token) {
            this._songService.deleteSong(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this.alertDetail = 'Error en el servidor';
                    }
                    this.getAlbum();
                },
                error => {
                    if (error.error instanceof ErrorEvent) {
                        // Error del lado del cliente
                        this.alertDetail = `Error: ${error.error.message}`;
                    } else {
                        // El backend devolvió un código de estado de error
                        this.alertDetail = error.error.message || `Error ${error.status}: ${error.statusText}`;
                    }
                    console.error('Error:', error);
                }
            );

        }
    }

    startPlayer(song: Song) {
        let song_player = JSON.stringify(song);


        console.log(this.album);
        let file_path = this.url + 'get-file-song/' + song.file;
        let image_path = this.url + 'get-image-album/' + this.album.image;

        localStorage.setItem('sound_song', song_player);
        document.getElementById("mp3-source")?.setAttribute("src", file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        const playSongTitleElement = document.getElementById('play-song-title');
        if (playSongTitleElement) {
            playSongTitleElement.innerHTML = song.name + ' - ' || ''; // Asegúrate de manejar el caso en que song.name sea null o undefined
        } else {
            console.error('No se encontró el elemento con el ID "play-song-title"');
        }

        const playSongUserElement = document.getElementById('play-song-user');
        if (playSongUserElement) {
            playSongUserElement.innerHTML = this.user.name || ''; // Asegúrate de manejar el caso en que song.name sea null o undefined
        } else {
            console.error('No se encontró el elemento con el ID "play-song-user"');
        }

        const playImageAlbumElement = document.getElementById('play-image-album');
        if (playImageAlbumElement) {
            playImageAlbumElement.setAttribute("src", image_path); // Asegúrate de manejar el caso en que song.name sea null o undefined
        } else {
            console.error('No se encontró el elemento con el ID "play-song-title"');
        }


    }

    addListRep(song: Song) {
        console.log(song);

        if (this.token) {

            this.listRep.song = song._id;
            if (this.identidad) {
                this.listRep.user = this.identidad._id;

                this._listRepService.saveList(this.token, this.listRep).subscribe(
                    response => {
                        if (!response.listRep) {
                            this.alertDetail = 'Error en el servidor';
                        } else {
                            this.alertDetail = 'La Lista se ha creado correctamente';
                            this.listRep = response.listRep;
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertDetail = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertDetail = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error);
                    }
                );
            }

        }
    }
}