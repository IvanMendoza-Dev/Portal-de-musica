import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {

    public title: string;
    public user: User;
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public alertUpdate: string;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(private _userService: UserService) {
        this.title = 'Modificar datos';
        this.user = new User('', '', '', '','', '', 'ROLE_USER', '', '');
        this.identity = false;
        this.alertUpdate = '';
        this.filesToUpload = [];
        this.url = GLOBAL.url;       

    }

    ngOnInit() {
        //LocalStorage
        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.identidad) {
            this.user = this.identidad;
        }

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }
    }

    onSubmit() {
        console.log(this.user);

        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.alertUpdate = 'El usuario no se ha actualizado';
                } else {

                    //this.user = response.user;
                    localStorage.setItem('identidad', JSON.stringify(this.user));

                    const identidadNameElement = document.getElementById('identidad_name');
                    if (identidadNameElement) {
                        identidadNameElement.innerHTML = this.user.name;
                    }

                    if(this.filesToUpload  && this.filesToUpload.length > 0){
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identidad', JSON.stringify(this.user));

                                let image_path = this.url + 'get-image-user/' + this.user.image;
                                document.getElementById('image-logged')?.setAttribute('src',image_path);
                            }
                        );
                    }
                    

                    this.alertUpdate = 'El usuario se ha actualizado correctamente';
                }
            },
            error => {
                if (error.error instanceof ErrorEvent) {
                    // Error del lado del cliente
                    this.alertUpdate = `Error: ${error.error.message}`;
                } else {
                    // El backend devolvió un código de estado de error
                    this.alertUpdate = error.error.message || `Error ${error.status}: ${error.statusText}`;
                }
                console.error('Error:', error);
            }
        );
    }



    fileChangeEvent(fileInput : any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
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