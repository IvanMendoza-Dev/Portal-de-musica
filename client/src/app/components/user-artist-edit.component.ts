import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { User } from '../models/user';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-edit.html',
    providers: [UserService, ArtistService]
})

export class ArtistEditComponent implements OnInit {

    public title: string;
    public user: User;
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public alertEdit: string;
    public filesToUpload: Array<File>;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _artistService: ArtistService) {
        this.title = 'Editar artista';
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '', '');
        this.url = GLOBAL.url;
        this.identity = false;
        this.alertEdit = '';
        this.filesToUpload = [];

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
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertEdit = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertEdit = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error);
                    }
                );

            }
        });
    }

    onSubmit() {
        console.log(this.user);

        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.alertEdit = 'El artista no se ha actualizado';
                } else {

                    if (this.filesToUpload && this.filesToUpload.length > 0) {
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                this._router.navigate(['/user', this.user._id]);

                            }
                        );
                    }
                    this._router.navigate(['/user', this.user._id]);
                    this.alertEdit = 'El artista se ha actualizado correctamente';
                }
            },
            error => {
                if (error.error instanceof ErrorEvent) {
                    // Error del lado del cliente
                    this.alertEdit = `Error: ${error.error.message}`;
                } else {
                    // El backend devolvió un código de estado de error
                    this.alertEdit = error.error.message || `Error ${error.status}: ${error.statusText}`;
                }
                console.error('Error:', error);
            }
        );
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