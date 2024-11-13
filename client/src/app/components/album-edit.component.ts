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
    selector: 'album-edit',
    templateUrl: '../views/album-edit.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumEditComponent implements OnInit {

    public titulo: string;

    public identidad?: User | null;
    public album: Album;
    public user: User;

    public identity: boolean;
    public token?: string | null;
    public alertAlbum: string;
    public url: string;
    public filesToUpload: Array<File>;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService) {
        this.titulo = 'Editar Album';
        this.album = new Album('', '', '', 2000, '', '');
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '', '');
        this.identity = false;
        this.alertAlbum = '';
        this.url = GLOBAL.url;
        this.filesToUpload = [];

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getAlbum();

    }

    onSubmit() {
        console.log(this.album);

        this._route.params.forEach((params: Params) => {
            let idAlbum = params['idAlbum'];
            if (this.token) {
                this._albumService.editAlbum(this.token, idAlbum, this.album).subscribe(
                    response => {
                        if (!response.album) {
                            this.alertAlbum = 'Error en el servidor';
                        } else {
                            this.alertAlbum = 'El album se ha editado correctamente';
                            this.album = response.album;

                            if (this.filesToUpload && this.filesToUpload.length > 0) {
                                this.makeFileRequest(this.url + 'upload-image-album/' + idAlbum, [], this.filesToUpload).then(
                                    (result: any) => {
                                        this.album.image = result.image;
                                        this._router.navigate(['/user', this.album.user]);
                                    }
                                );
                            }
                            this._router.navigate(['/user', this.album.user]);
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

                            let usuario = JSON.stringify(this.album.user);
                            this.user = JSON.parse(usuario);
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);

            if (token) {
                xhr.setRequestHeader('Authorization', token);
            }

            xhr.send(formData);

        });
    }

}