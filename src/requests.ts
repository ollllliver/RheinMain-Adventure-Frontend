import router from "./router"
import user from "./stores/user"

export type User = { username: string }
export type UserList = Array<User & { password: string }>

// GET benutzer/check -> status 200 + User falls vorhanden, 204 falls nicht vorhanden
export async function getUser() {
  await fetch('/api/benutzer/check', {
    method: 'GET'
  })
    .then(async response => {
      if (response.ok) {
        if (response.status === 200) {
          const u = await response.json()
          console.log("User erkannt", u)
          user.state.benutzername = u.benutzername
          user.state.istEingeloggt = true;
          return true
        } else {
          console.log("Kein User erkannt")
          return false
        }
      }
    })
}

// POST benutzer/login -> User wird überprüft in DB und eingeloggt falls erfolgreich 
export async function login(benutzername: string, passwort: string) {
  const user = {
    benutzername: benutzername,
    passwort: passwort
  }
  await fetch('/api/benutzer/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((async response => {
      const data = await response.json();
      if (response.ok)
        console.log("Erfolgreich eingeloggt: ", data)
    }))
    .catch(error => {
      throw Error(error.text)
    })
  return user
}


// POST /register -> User wird in der Datenbank angelegt
export async function signup(benutzername: string, passwort: string) {
  const user = {
    id: 1,
    benutzername: benutzername,
    passwort: passwort
  }
  await fetch('/api/benutzer/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((async response => {
      const data = await response.json();
      if (response.ok)
        console.log("Erfolgreich registriert: ", data)
      router.push('/')
    }))
    .catch(error => {
      throw Error(error.text)
    })
  return user
}

export async function logout(benutzername: string) {
  const user = {
    id: 1,
    benutzername: benutzername,
    passwort: "geheim"
  }
  await fetch('/api/benutzer/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then((async response => {
      const data = await response.json();
      if (response.ok)
        console.log("Erfolgreich ausgeloggt: ", data)
      router.push('/')
    }))
    .catch(error => {
      throw Error(error.text)
    })
}
