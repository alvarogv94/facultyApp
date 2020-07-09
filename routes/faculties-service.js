'use strict'

// creamos un nuevo cliente de mongo
const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectId;
const Faculties = function() {};

// Parametros de conexion de mongoDB
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uriDB = 'mongodb+srv://test:test@if-2020-agv.mzl0e.mongodb.net/universityDB?retryWrites=true&w=majority';
const dbName = 'universityDB';
const collection = 'faculties';

Faculties.prototype.connectDb = function(callback) {
    MongoClient.connect(uriDB, mongoOptions,
        function(err, database) {
            if (err) {
                callback(err);
            }
 
            db = database.db(dbName).collection(collection);
 
            callback(err, database);
        }
    );
};

// Añadimos metodo que añade facultad a la bbdd al prototype de Movies
Faculties.prototype.add = function(faculties, callback) {
    return db.insertOne(faculties, callback);
};

// Metodo que consultamos una facultad por cualquier condicion
Faculties.prototype.get = function(object, callback) {
    return db.find(object).toArray(callback);
}

// Metodo que consultamos una facultad por id
Faculties.prototype.getbyId = function(_id, callback) {
    return db.find({_id: ObjectId(_id)}).toArray(callback);
}

// Metodo que consultamos una facultad
Faculties.prototype.getAll = function(callback) {
    return db.find({}).toArray(callback);
}

// Metodo que actualiza una facultad
Faculties.prototype.update = function (_id, facultiesUpdate, callback) {
    delete facultiesUpdate._id;
    return db.updateOne({_id: ObjectId(_id)}, {$set: facultiesUpdate}, callback);
};



// Metodo que actualiza una facultad
Faculties.prototype.remove = function (_id, callback) {
    return db.deleteOne({_id: ObjectId(_id)}, callback);
};

Faculties.prototype.removeAll = function (callback) {
    return db.deleteMany({}, callback);
};

module.exports = new Faculties();