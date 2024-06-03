const express = require('express');
const cors = require('cors');
const pouchdb =require('pouchdb');
const fs = require('fs').promises;
const path = require('path');


const app = express();
app.use(cors());
const PORT = 3000;
app.use(express.json());

const DB_URL = 'http://couchdbserver:5984/data';
const COUCH_USER = 'admin';
const COUCH_PASS = 'admin';

const db = new pouchdb(DB_URL, {
    auto_compaction: true,
    auth: {username: COUCH_USER, password: COUCH_PASS}
})

let ciudadesBD = [];

async function getCiudades() {

    try {
        const result = await db.allDocs({ include_docs: true });
        const data = result.rows.map(row => row.doc);
        for (let i = 0; i < data.length; i++) {
            if (!ciudadesBD.includes(data[i].data.name)){
                ciudadesBD.push(data[i].data.name);
            }
        }
        return data;
    } catch (error) {
        throw new Error("Error al obtener datos de la BD: " + error);
    }
}

async function insertarCiudad(data) {
    try {
        const result = await db.put({
            _id: new Date().toISOString(),
            data
        });
        return result;
    } catch (error) {
        throw new Error("Error al insertar una ciudad en la BD: " + error);
    }
}

async function insertarCiudadRandom() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'ciudades.json'), 'utf8');
        const jsonData = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const ciudadaInsertar = jsonData[randomIndex];
        const result = null;
        if (!ciudadesBD.includes(ciudadaInsertar.name)) {
            result = await insertarCiudad(ciudadaInsertar);
            ciudadesBD.push(jsonData[randomIndex].name);
        }
        else {
            console.log("La ciudad ya existe en la BD");
            result = "La ciudad ya existe en la BD";
        }
        return result;
    } catch (error) {
        console.log("Error al insertar nueva ciudad random: " + error.message);
    }
}


app.get('/ciudades', async (req, res) => {
    try {
        const data = await getCiudades();
        res.json(data);
    } catch (error) {
        console.log("Error al obtener datos de la BD: " + error.message);
        res.status(500).send({ error: error.message });
    }
});

app.post('/ciudades', async (req, res) => {
    try {
        const { data } = req.body;
        const result = await insertarCiudad(data);
        res.json(result);
    } catch (error) {
        req.logger.error("Error al insertar un nuevo elemento en la BD: " + error.message);
        res.status(500).send({ error: error.message });
    }
});

// Insertar una nueva ciudad cada 15 segundos
setInterval(insertarCiudadRandom, 15000);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});