const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
    async index(req, res) {
        /* Buscar devs em raio de 10km
           Filtrar por techs
        */
        const { latitude, longitude, techs } = req.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                // Achar dentro de techsArray
                $in: techsArray,
            },
            location: {
                //achar perto da latitude e longitude
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    //Distancia máxima em metros
                    $maxDistance: 10000,
                },
            },
        });
        
        return res.json({ devs });
    }
}