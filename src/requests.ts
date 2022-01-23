import axios from "axios"
import router from "./router"
import user from "./stores/user"

export type User = { username: string }
export type UserList = Array<User & { password: string }>

// GET benutzer/check -> status 200 + User falls vorhanden, 204 falls nicht vorhanden
export async function getUser() {
  return axios.get('/api/check');
}

// TODO ALLE REQUEST EINFACH SO
// POST benutzer/login -> User wird überprüft in DB und eingeloggt falls erfolgreich 
export function login(benutzername: string, passwort: string) {
  return axios.post('/api/login', {
    benutzername: benutzername,
    passwort: passwort
  });
}



// POST /register -> User wird in der Datenbank angelegt
export async function signup(benutzername: string, passwort: string) {
  return axios.post('/api/register', {
    benutzername: benutzername,
    passwort: passwort
  });
}

export async function logout(benutzername: string) {


  // logout ist post wenn csrf enabled in backend
  return axios.post('/api/logout', {
    benutzername: benutzername,
    passwort: "geheim"
  });
}
