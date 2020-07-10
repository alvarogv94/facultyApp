'use strict'

const express = require('express');
const router = express.Router();
const facultiesService = require('./faculties-service');
const passport = require('passport');
const encryption = require('./encrypt');

router.get('/',passport.authenticate('jwt', { session: false }), function(req, res) {
    facultiesService.getAll((err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        // Si no encuentra ninguna facultad
        if(result == null) {
            res.status(404).send({
                "data": []
            });
        }

        let resultAux = [];
        result.forEach(element => {
            let aux = encryption.decrypt(element.object);
            aux._id = element._id;
            resultAux.push(aux);
        });
        // Si todo ha ido bien
        res.status(200).send({
            "data": resultAux
        });

    });
});

router.post('/', passport.authenticate('jwt', { session: false }), function(req, res) {

    let faculty = req.body;
    let objectFaculty = {object: encryption.encrypt(faculty)};
    facultiesService.add(objectFaculty, (err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        req.app.io.emit('newFaculty', {
            msg: 'A new faculty has been added!',
            data: req.user.email
        });
        // Si todo ha ido bien
        res.status(201).send({
            "data": result,
            "msg": "Facultad creada correctamente!"
        });

    });
});

router.delete('/', passport.authenticate('jwt', { session: false }), function(req, res) {

    facultiesService.removeAll((err) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        // Si todo ha ido bien
        res.status(200).send({
            "msg": "Todas las facultades han sido borradas!"
        });

    });
});

router.get('/get-faculties', passport.authenticate('jwt', { session: false }), function(req, res) {

    // Aqui tendremos las propiedades por las que vamos a buscar las facultades
    let faculty = req.body;
    facultiesService.get(faculty, (err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        // Si no encuentra ninguna facultad
        if(result == null) {
            res.status(404).send({
                "data": []
            });
        }

        // Si todo ha ido bien
        res.status(200).send({
            "data": result
        });

    });
});

router.get('/:_id', passport.authenticate('jwt', { session: false }), function(req, res) {

    let _id = req.params._id;

    facultiesService.getbyId(_id, (err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        // Si no encuentra ninguna facultad
        if(result == null) {
            res.status(404).send({
                "data": []
            });
        }

        let resultAux = [];
        result.forEach(element => {
            let aux = encryption.decrypt(element.object);
            aux._id = element._id;
            resultAux.push(aux);
        });

        // Si todo ha ido bien
        res.status(200).send({
            "data": resultAux
        });
    });
});

router.put('/:_id',passport.authenticate('jwt', { session: false }), function(req, res) {
    let _id = req.params._id;
    let faculty = req.body;

    facultiesService.update(_id, faculty, (err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        if(result == null || result == 0) {
            res.status(404).send({
                "msg": "No se ha encontrado la facultad"
            });
        }
        // Si todo ha ido bien
        res.status(200).send({
            "msg": "Facultad Actualizada",
            "data": result
        });

    });
});

router.delete('/:_id', passport.authenticate('jwt', { session: false }),function(req, res) {
    let _id = req.params._id;

    facultiesService.remove(_id, (err, result) => {
        // si trae error
        if(err) {
            res.status(500).send({
                "msg": err
            });
        }

        if(result == null) {
            // Si no encuentra nada que borrar
            res.status(404).send({
                "msg": "Facultad no encontrada",
                "data": result
            });
        }

        // Si todo ha ido bien
        res.status(200).send({
            "msg": "Facultad borrada",
            "data": result
        });

    });
});

module.exports = router;