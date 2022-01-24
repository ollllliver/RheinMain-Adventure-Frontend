import axios, { AxiosPromise } from "axios"
import user from "../../stores/user"

export type User = { username: string }
export type UserList = Array<User & { password: string }>

// GET benutzer/check -> status 200 + User falls vorhanden, 204 falls nicht vorhanden
export async function getUser(): Promise<boolean> {
  return axios.get('/api/benutzer/check').then((u) => {
    console.log("User erkannt", u);
    user.state.benutzername = u.data.benutzername;
    user.state.istEingeloggt = true;
    return true;
  }).catch((e) => {
    console.log(e, "Kein User erkannt");
    return false;
  });
}

// TODO ALLE REQUEST EINFACH SO
// POST benutzer/login -> User wird überprüft in DB und eingeloggt falls erfolgreich 
export function login(benutzername: string, passwort: string): Promise<AxiosPromise> {
  return axios.post('/api/benutzer/login', {
    benutzername: benutzername,
    passwort: passwort
  });
}

// POST /register -> User wird in der Datenbank angelegt
export async function signup(benutzername: string, passwort: string): Promise<AxiosPromise> {
  return axios.post('/api/benutzer/register', {
    benutzername: benutzername,
    passwort: passwort
  });
}

export async function logout(benutzername: string): Promise<AxiosPromise> {


  // logout ist post wenn csrf enabled in backend
  return axios.post('/api/benutzer/logout', {
    benutzername: benutzername,
    passwort: "geheim"
  });
}
