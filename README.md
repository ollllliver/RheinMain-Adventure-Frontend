# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Information
Anfangs habe ich zum "Testen" wie ein Clickdummy einen User mit username: tester password: test in eine 
JSON Datei geschmissen (siehe /public/users.json). Mit dem kann man sich erstmal einloggen. Das registrieren 
hat noch keine Funktion.

### Version
Für das Projekt habe ich die Node version 16.13.0 genutzt. Für alle die eine höher (ab 17 glaube ich) nutzen,
muss der "serve" Befehl in der package.json folgendermaßen aussehen:
"SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve"
