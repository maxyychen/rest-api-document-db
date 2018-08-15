const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URL || 'mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017';
const database = process.env.MONGODB_DATABASE || "test";

class MongoAdapter {
    constructor() {
        this.ready = false;
        this.dbs = {};
        MongoClient.connect(`${url}/${database}`, {useNewUrlParser:true}, (err, client)=>{
            if(err){
                console.log(err);
                throw err;
            }else{
                console.log("Connected successfully to server");
                this.client = client;
                this.ready = true;
            }
        });
    }

    getDb() {
        if (!this.dbs[database]) {
            this.dbs[database] = this.client.db(database);
        }
        return this.dbs[database];
    }


    doPost(col_name, data) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb().collection(col_name);
            collection.insert(data, {w: 1}, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        })
    }

    doGet(col_name, id) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb().collection(col_name);
            collection.findOne({_id: id}, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }

    doPut(col_name, id, data) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb().collection(col_name);
            collection.update({_id: id}, data, (err, item) => {
                if (err) reject(err);
                resolve(item);
            })
        });
    }


    doDelete(col_name, id) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb().collection(col_name);
            collection.remove({_id: id}, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }

    doGetList(col_name, queryObj) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb().collection(col_name);
            collection.find(queryObj).toArray((err, items) => {
                if (err) reject(err);
                resolve(items);
            });
        });
    }


}


mongo_adapter = new MongoAdapter();

module.exports = mongo_adapter;
