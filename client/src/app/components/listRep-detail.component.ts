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
    selector: 'listRep-detail',
    templateUrl: '../views/listRep-detail.html',
    providers: [UserService, SongService, ListRepService, AlbumService]
})

export class ListRepDetailComponent implements OnInit {

    public title: string;
    public user: User;
    public identidad?: User | null;
    public songs: Song[];
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public alertDetail: string;
    public confirmado: string;
    public listReps: ListRep[];
    public album: Album;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _songService: SongService, private _listRepService: ListRepService, private _albumService: AlbumService) {
        this.title = 'Detalles de la lista de Reproducción';
        this.user = new User('', '', '', '', '', '', '', '', '');
        this.songs = [];
        this.identity = false;
        this.url = GLOBAL.url;
        this.alertDetail = '';
        this.confirmado = '';
        this.listReps = [];
        this.album = new Album('', '', '', 2000, '', '');
    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getList();
        if(this.identidad != null){
            this.user=this.identidad;
        
        }
    }

    getList() {

        this._route.params.forEach((params: Params) => {
            let id = params['idUser'];

            //Sacar el album
            if (this.token) {

                this._listRepService.getLists(this.token, id).subscribe(
                    response => {
                        if (!response.listReps) {
                            this.alertDetail = 'No existe lista';
                        } else {

                            this.listReps = response.listReps;

                            //Sacar las canciones de la lista
                            // Obtener las canciones de las listas
                            this.listReps.forEach(listRep => {
                                if (this.token) {

                                    this._songService.getSong(this.token, listRep.song).subscribe(
                                        response => {

                                            if (!response.song) {
                                                this.alertDetail = 'Este album no tiene canciones';

                                            } else {
                                                console.log(response.song);
                                                this.songs.push(response.song);
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

    onDeleteList(song: string) {
        if (this.token) {
            this._listRepService.deleteList(this.token, song).subscribe(
                response => {
                    if (!response.listRep) {
                        this.alertDetail = 'Error en el servidor';
                    }
                    this.listReps = [];
                    this.songs = [];

                    this.getList();
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


    getAlbum(idAlbum: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            //Sacar el album
            if (this.token) {
                this._albumService.getAlbum(this.token, idAlbum).subscribe(
                    response => {
                        if (!response.album) {
                            this.alertDetail = 'No existe este album';
                            reject('No existe este album');
                        } else {
                            this.album = response.album;
                            resolve();
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
                        reject(error);
                    }
                );
            }
        });
    }
    
    async startPlayer(song: Song) {
        try {
            await this.getAlbum(song.album);
    
            let song_player = JSON.stringify(song);
    
            let file_path = this.url + 'get-file-song/' + song.file;
            let image_path = this.url + 'get-image-album/' + this.album.image;
    
            localStorage.setItem('sound_song', song_player);
            document.getElementById("mp3-source")?.setAttribute("src", file_path);
            (document.getElementById("player") as any).load();
            (document.getElementById("player") as any).play();
    
            const playSongTitleElement = document.getElementById('play-song-title');
            if (playSongTitleElement) {
                playSongTitleElement.innerHTML = song.name + ' - ' || '';
            } else {
                console.error('No se encontró el elemento con el ID "play-song-title"');
            }
    
            const playSongUserElement = document.getElementById('play-song-user');
            if (playSongUserElement) {
                playSongUserElement.innerHTML = this.user.name || '';
            } else {
                console.error('No se encontró el elemento con el ID "play-song-user"');
            }
    
            const playImageAlbumElement = document.getElementById('play-image-album');
            if (playImageAlbumElement) {
                playImageAlbumElement.setAttribute("src", image_path);
            } else {
                console.error('No se encontró el elemento con el ID "play-song-title"');
            }
        } catch (error) {
            console.error('Error:', error);
            // Maneja el error aquí si es necesario
        }
    }
    
}