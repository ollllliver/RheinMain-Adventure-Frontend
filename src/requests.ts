export type User = { username: string }
export type UserList = Array<User & { password: string }>

export async function getUser() {
  const request = await fetch('/current.json')
  const user: User = await request.json()
  return user
}

// POST /login -> User wird überprüft in DB und eingeloggt falls erfolgreich 
export async function login(username: string, password: string) {
  const user = {
    username: username,
    password: password
  }
  await fetch('/api/benutzer/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  return user
  /*const request = await fetch('/users.json')
  const usersJson: UserList = await request.json()
  return usersJson.find(s => s.password === password && s.username === username)*/
}

// POST /register -> User wird in der Datenbank angelegt
export async function signup(username:string, password: string) {
  const user = {
    username: username,
    password: password,
    online: false
  }
  await fetch('/api/benutzer/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
  return user
}
 
