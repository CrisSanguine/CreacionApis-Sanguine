const express = require('express');
const app = express();
const paginate = require('express-paginate'); //Añadi express-paginate
const cors = require('cors'); //Añadi cors


//Aquí pueden colocar las rutas de las APIs
const movieApiRoutes = require('./routes/api.v1/movies.routes')

const genreApiRoutes = require('./routes/api.v1/genres.routes')
app.use(cors());
app.use(express.json());

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));

// añadi paginate
app.use(paginate.middleware(8,50));
//ruta de api (usando las rutas creadas arriba)
app.use('/api/v1/movies', movieApiRoutes)
app.use('/api/v1/genres', genreApiRoutes)

app.use('*', (req,res) => res.status(404).json({
    ok: false,
    status: 404,
    error: 'Not Found'
}))

//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor funcionando en el puerto 3001'));