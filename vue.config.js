module.exports = {
    devServer: {
        // Setzt voraus, dass Spring Backend auf localhost, Port 9090, laeuft.
        // Von der Kommandozeile erreichbar mit: SERVER_PORT=8080 ./gradlew bootRun
        // oder dauerhaft per Eintrag in applications.property: server.port=9090
        
        proxy: {
                'api': { target: 'http://localhost:8080/', 
                ws: true, 
                secure: false },
                '^/lobby': {
                    target: 'http://localhost:8080/',
                    ws: true,
                    secure: false },
        }
    }
}
