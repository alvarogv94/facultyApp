'use strict'

// creamos un nuevo cliente de mongo
const MongoClient = require('mongodb').MongoClient;
let db;
let ObjectId = require('mongodb').ObjectId;
const Users = function() {};

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uriDB = 'mongodb+srv://test:test@if-2020-agv.mzl0e.mongodb.net/universityDB?retryWrites=true&w=majority';
const dbName = 'universityDB';
const collection = 'users';

Users.prototype.connectDb = function(callback) {
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

Users.prototype.add = (user) => {
    return addUser(user);
}

async function addUser(user) {
    return db.insertOne(user);
}

Users.prototype.find = (user) => {
    return find(user);
}

async function find(user) {
    return new Promise((resolve, reject) => {
        db.find(user).toArray((err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

module.exports = new Users();