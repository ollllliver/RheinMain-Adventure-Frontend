module.exports = {
    devServer: {
        // Setzt voraus, dass Spring Backend auf localhost, Port 8080, laeuft.
        // Von der Kommandozeile erreichbar mit: SERVER_PORT=8080 ./gradlew bootRun
        // oder dauerhaft per Eintrag in applications.property: server.port=8080

        proxy: {
            '^/api': {
                target: 'http://localhost:8080',
                secure: false,
                ws: true,
                logLevel: 'debug'
            },
            '^/gltf': {
                target: 'http://localhost:8080',
                secure: false,
                ws: true,
                logLevel: 'debug'
            },
        }
    }
}
