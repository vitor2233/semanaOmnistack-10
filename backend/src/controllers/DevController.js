const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        /* Verificar se já existe um usuário cadastrado com o username */
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            /* Chamar api github com o user */
            const apiRes = await axios.get(`https://api.github.com/users/${github_username}`);

            /* Pegar nome avatar e bio do github */
            /* Se nome não existir então pegará o login com o name = login */
            const { name = login, avatar_url, bio } = apiRes.data;

            /* Trim remove espaçamentos antes e depois de uma string */
            const techsArray = parseStringAsArray(techs);

            /* Guardar latitude e longitude */
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            /* Cadastrar dev */
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            //Filtrar conexões a 10km e techs igual a quem pesquisou no mobile
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return res.json(dev);
    },

    async update(req, res) {
        const dev = await Dev.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.json(dev);
    },

    async destroy(req, res){
        await Dev.findByIdAndRemove(req.params.id);

        return res.send();
    },
};