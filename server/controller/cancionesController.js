let Cancion = require('../model/canciones');

exports.guardarCancion = async(req, res) => {
    let {nombre, artista, url_video, votes} = req.body; //Desestructuración
    let cancion = new Cancion({nombre, artista, url_video, votes});
    try{
        await cancion.save();
        res.status(201).json(cancion);
    }catch(error){
        console.error(error);
        res.status(400).json("ERROR AL GUARDAR LA CANCIÓN");
    }
}

exports.obtenerCancionAleatoria = async (req, res) => {
    try {
        const count = await Cancion.countDocuments();
        const random = Math.floor(Math.random() * count);
        const cancion = await Cancion.findOne().skip(random).exec();

        if (!cancion) {
            return res.status(404).json({ message: "Canción no encontrada" });
        }
        res.status(200).json(cancion);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "ERROR: " + error.message });
    }
};

exports.votarCancion = async (req, res) => {
    try {
        console.log('Request body recibido:', req.body);
        
        let { _id, votes } = req.body;
        
        if (!_id) {
            return res.status(400).json({ error: "Se requiere el ID de la canción" });
        }

        let cancionActual = await Cancion.findById(_id);
        
        if (!cancionActual) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }

        let cancion = await Cancion.findByIdAndUpdate(
            _id,
            { $inc: { votes: votes } }, 
            { new: true }
        );

        res.status(200).json(cancion);

    } catch (error) {
        console.error('Error al procesar voto:', error);
        res.status(500).json({ error: "Error interno al procesar el voto" });
    }
}