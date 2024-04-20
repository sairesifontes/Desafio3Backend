import express from 'express';
import { promises as fs } from 'fs';

const app = express();
const PORT = 8080;

app.use(express.json());


app.get('/licores', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined;
        const licores = await getLicores(limit);
        res.json(licores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los licores' });
    }
});



app.get('/licores/:id', async (req, res) => {
    const licorId = req.params.id;
    try {
        const licor = await getLicorById(licorId);
        res.json(licor);
    } catch (error) {
        res.status(404).json({ error: 'Licor no encontrado' });
    }
});


//funcion que busca el limite de licores
async function getLicores(limit) {
    const data = await fs.readFile('./data/licores.json', 'utf-8');
    const licores = JSON.parse(data);
    if (limit) {
        return licores.slice(0, limit);
    } else {
        return licores;
    }
}



//Funcion que busca el licor por id
async function getLicorById(licorId) {
    const data = await fs.readFile('./data/licores.json', 'utf-8');
    const licores = JSON.parse(data);
    const id = parseInt(licorId); 
    const licor = licores.find(licor => licor.id === id); 
    if (licor) {
        return licor;
    } else {
        throw new Error('Licor no encontrado');
    }
}



app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
