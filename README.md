# App con Docker Compose
La aplicación muestra ciudades turísticas recomendadas, y le permite al usuario agregar su propia recomendación (con atracciones para visitar).

## Funcionamiento app
Se trata de una app simple multi-contenedor, los cuales se administran a través de docker-compose. Está conformada por tres contenedores:
- Base de Datos (CouchDB)
- Backend (Node y Express)
- Frontend (HTML, CSS y JS)

## ¿Cómo ejecutar la app?
1. Clonar el repositorio: `https://github.com/sosasanti/tpdocker`
2. Construir y correr contenedores: `docker-compose up --build`
3. Acceder al cliente web en `http://localhost:8080`


### Dependencias necesarias
Docker
