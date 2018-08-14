const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URL || 'mongodb://192.168.3.111:27017';


class MongoAdapter {
    constructor() {
        this.ready = false;
        this.dbs = {};
        MongoClient.connect(url, {useNewUrlParser:true}, (err, client)=>{
            if(err){
                console.log(err);
            }
            console.log("Connected successfully to server");
            this.client = client;
            this.ready = true;
        });
    }

    getDb(db_name) {
        if (!this.dbs[db_name]) {
            this.dbs[db_name] = this.client.db(db_name);
        }
        return this.dbs[db_name];
    }

    close() {
        this.client.close();
    }

    doPost(db_name, col_name, data) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb(db_name).collection(col_name);
            collection.insert(data, {w: 1}, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        })
    }

    doGet(db_name, col_name, id) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb(db_name).collection(col_name);
            collection.findOne({_id: id}, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }

    doPut(db_name, col_name, id, data) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb(db_name).collection(col_name);
            collection.update({_id: id}, data, (err, item) => {
                if (err) reject(err);
                resolve(item);
            })
        });
    }


    doDelete(db_name, col_name, id) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb(db_name).collection(col_name);
            collection.remove({_id: id}, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }

    doGetList(db_name, col_name, queryObj) {
        return new Promise((resolve, reject) => {
            let collection = this.getDb(db_name).collection(col_name);
            collection.find(queryObj).toArray((err, items) => {
                if (err) reject(err);
                resolve(items);
            });
        });
    }


}


mongo_adapter = new MongoAdapter();

module.exports = mongo_adapter;
