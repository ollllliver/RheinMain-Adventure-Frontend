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
  await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
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
  await fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
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
 
