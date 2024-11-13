import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

import { GLOBAL } from '../services/global';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { User } from '../models/user';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {

    public titulo: string;
    
    public identidad?: User | null;
    public album: Album;
    public user: User;

    public identity: boolean;
    public token?: string | null;
    public alertAlbum: string;
    public url: string;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService) {
        this.titulo = 'Crear nuevo Album';
        this.album = new Album('','','',2000,'','');
        this.user = new User('', '', '', '','', '', 'ROLE_USER', '', '');
        this.identity = false;
        this.alertAlbum = '';
        this.url = GLOBAL.url;

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getArtist();

    }

    onSubmit(){
        console.log(this.album);

        this._route.params.forEach((params: Params) =>{
            let user_id = params['idUser'];
            this.album.user = user_id;
        });
        if(this.token){
            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    if (!response.album) {
                        this.alertAlbum = 'Error en el servidor';
                    } else {
                        this.alertAlbum = 'El album se ha creado correctamente';
                        this.album = response.album;
                        this._router.navigate(['/edit-album', this.album._id]);

                    }
                },
                error => {
                    if (error.error instanceof ErrorEvent) {
                        // Error del lado del cliente
                        this.alertAlbum = `Error: ${error.error.message}`;
                    } else {
                        // El backend devolvió un código de estado de error
                        this.alertAlbum = error.error.message || `Error ${error.status}: ${error.statusText}`;
                    }
                    console.error('Error:', error);
                }
            );
        }
    }

    getArtist() {

        this._route.params.forEach((params: Params) => {
            let id = params['idUser'];

            if (this.token) {
                this._userService.getUser(this.token, id).subscribe(
                    response => {
                        if (!response.user) {
                            this._router.navigate(['/']);
                        } else {
                            this.user = response.user;
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertAlbum = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertAlbum = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error);
                    }
                );

            }
        });
    }

}