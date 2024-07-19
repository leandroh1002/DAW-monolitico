# From es para elegir que imagen vamos a usar para instalar la aplicacion

FROM node:18.19.0-slim

# ahora se va a elegir el directorio, tiene que ver con el contenedor de docker
WORKDIR /app

#ahora copiamos los archivos
COPY . . 

# Iniciar el entorno
RUN npm install

# inicia el contenedor
CMD ["npm", "start"]
