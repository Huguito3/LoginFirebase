import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.models';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Crear nuevos usuarios
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

  //logar
  //https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
  private URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/';
  private API_KEY = '';
  private userToken: string;
  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logOut() {
    localStorage.removeItem('token');
  }
  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.URL}verifyPassword?key=${this.API_KEY}`, authData
    ).pipe(
      map(resp => {
        console.log('Entro en el mapa de RXJS');
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }
  nuevoUsuario(usuario: UsuarioModel) {

    const authData = {
      //email: usuario.email,
      //password: usuario.password,
      //con el operador spread nos evitamos escribir.. aqui crea las mismas variables que el obj usuario e les asocia ellas.. en este caso 
      //va a copiar la variable nombre tambien pero no hay problema. 
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.URL}signupNewUser?key=${this.API_KEY}`, authData
    ).pipe(
      map(resp => {
        console.log('Entro en el mapa de RXJS');
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );

  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    const hoy = new Date();
    hoy.setSeconds(hoy);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if (this.userToken.length < 2) {
      return false;
    } else if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }

  }
}
