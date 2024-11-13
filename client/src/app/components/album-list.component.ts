import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { User } from '../models/user';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [UserService, AlbumService]
})

export class AlbumListComponent implements OnInit {
    public title: string;
    public albums: Album[];
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public next_page: number;
    public prev_page: number;
    public alertList: string;
    public confirmado: string;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService) {
        this.title = 'Albumes';
        this.albums = [];

        this.url = GLOBAL.url;
        this.identity = false;
        this.next_page = 1;
        this.prev_page = 1;

        this.alertList = '';
        this.confirmado = '';

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getAlbums();
    }

    getAlbums() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page']; //Con el +  lo convierto en number
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }
            }
            if (this.token) {
                this._albumService.getAlbumsAll(this.token, page).subscribe(
                    response => {
                        if (!response.albums) {
                            this._router.navigate(['/']);
                        } else {
                            this.albums = response.albums;
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertList = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertList = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error.error.message);
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
                    this.getAlbums();
                },
                error => {
                    if (error.error instanceof ErrorEvent) {
                        // Error del lado del cliente
                        this.alertList = `Error: ${error.error.message}`;
                    } else {
                        // El backend devolvió un código de estado de error
                        this.alertList = error.error.message || `Error ${error.status}: ${error.statusText}`;
                    }
                    console.error('Error:', error);
                }
            );

        }
    }
}