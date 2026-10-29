const Comentario = require('../models/noSql/comentario');

module.exports = {
    async getCreate(req, res) {
        res.render('comentario/comentarioCreate');
    },
    async postCreate(req, res) {
        new Comentario({
            titulo: req.body.titulo,
            texto: req.body.texto,
            autor: req.body.autor
        }).save().then(() => {
            res.redirect('/home');
        }).catch((err) => {
            console.log(err);
        });
    },
    async getList(req, res) {
        await Comentario.find().then(comentarios => {
            res.render('comentario/comentarioList', { comentarios: comentarios.map(comentario => comentario.toJSON()) });
        }).catch((err) => {
            console.log(err);
        });
    }
}   