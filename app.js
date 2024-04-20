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

async function getLicores(limit) {
    const data = await fs.readFile('./data/licores.json', 'utf-8');
    const licores = JSON.parse(data);
    if (limit) {
        return licores.slice(0, limit);
    } else {
        return licores;
    }
}


async function getLicorById(licorId) {
    const data = await fs.readFile('./data/licores.json', 'utf-8');
    const licores = JSON.parse(data);
    const id = parseInt(licorId); // Convertir el ID de string a número
    const licor = licores.find(licor => licor.id === id); // Usar el mismo tipo de dato para la comparación
    if (licor) {
        return licor;
    } else {
        throw new Error('Licor no encontrado');
    }
}



app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
