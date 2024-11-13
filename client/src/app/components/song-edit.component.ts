import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { AlbumService } from '../services/album.service';

import { GLOBAL } from '../services/global';

import { Album } from '../models/album';
import { User } from '../models/user';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-edit.html',
    providers: [UserService, AlbumService, SongService]
})

export class SongEditComponent implements OnInit {

    public titulo: string;

    public identidad?: User | null;
    public album: Album;
    public song: Song;

    public identity: boolean;
    public token?: string | null;
    public alertSong: string;
    public url: string;
    public filesToUpload: Array<File>;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _albumService: AlbumService, private _songService: SongService) {
        this.titulo = 'Editar Canción';
        this.song = new Song('',1,'','','','');
        this.album = new Album('','','',2000,'','');
        this.identity = false;
        this.alertSong = '';
        this.url = GLOBAL.url;
        this.filesToUpload = [];

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getSong();

    }

    onSubmit() {
        console.log(this.album);

        this._route.params.forEach((params: Params) => {
            let idSong = params['idSong'];
            if (this.token) {
                this._songService.editSong(this.token, idSong, this.song).subscribe(
                    response => {
                        if (!response.song) {
                            this.alertSong = 'Error en el servidor';
                        } else {
                            this.alertSong = 'La canción se ha editado correctamente';
                            this.song = response.song;

                            if (this.filesToUpload && this.filesToUpload.length > 0) {
                                this.makeFileRequest(this.url + 'upload-file-song/' + idSong, [], this.filesToUpload).then(
                                    (result: any) => {
                                        this.song.file = result.file;
                                        this._router.navigate(['/album', this.song.album]);
                                    }
                                );
                            }
                            this._router.navigate(['/album', this.song.album]);
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

    getSong() {

        this._route.params.forEach((params: Params) => {
            let id = params['idSong'];

            if (this.token) {
                this._songService.getSong(this.token, id).subscribe(
                    response => {
                        if (!response.song) {
                            this._router.navigate(['/']);
                        } else {
                            this.song = response.song;

                            let album = JSON.stringify(this.song.album);
                            this.album = JSON.parse(album);
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append('file', files[i], files[i].name);
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