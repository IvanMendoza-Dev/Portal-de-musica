import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';

import { GLOBAL } from '../services/global';
import { User } from '../models/user';
import { Album } from '../models/album';

@Component({
    selector: 'user-detail',
    templateUrl: '../views/user-detail.html',
    providers: [UserService, AlbumService]
})

export class UserDetailComponent implements OnInit {

    public title: string;
    public user: User;
    public albums: Album[];
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public alertDetail: string;
    public confirmado: string;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService) {
        this.title = 'Detalles del Artista';
        this.user = new User('', '', '', '','', '', 'ROLE_USER', '', '');
        this.url = GLOBAL.url;
        this.identity = false;
        this.alertDetail = '';
        this.albums = [];
        this.confirmado = '';

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getArtist();
    }

    getArtist() {

        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            if (this.token) {
                this._userService.getUser(this.token, id).subscribe(
                    response => {
                        if (!response.user) {
                            this._router.navigate(['/']);
                        } else {
                            this.user = response.user;

                            //Sacar los albums del artista
                            if(this.token){
                                this._albumService.getAlbums(this.token, response.user._id).subscribe(
                                    response => {
                                        if(!response.albums){
                                            this.alertDetail = 'Este artista no tiene albums';
                                        }else{
                                            this.albums = response.albums;
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

    onDeleteAlbum(id: string) {
        if (this.token) {
            this._albumService.deleteAlbum(this.token, id).subscribe(
                response => {
                    if(!response.album){
                        this.alertDetail = 'Error en el servidor';
                    }
                    this.getArtist();
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