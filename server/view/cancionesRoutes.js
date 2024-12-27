let express = require('express');
let cancionesController = require('../controller/cancionesController');
let router = express.Router();

router.get('/', cancionesController.obtenerCancionAleatoria);
router.post('/', cancionesController.guardarCancion);
router.put('/', cancionesController.votarCancion)

module.exports = router;