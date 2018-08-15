const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const database = process.env.MONGODB_DATABASE || "test";

class MongooseAdapter {
    constructor() {
        this.models = {};
        mongoose.connect(`${url}/${database}`, {
            useNewUrlParser: true,
            socketTimeoutMS: 0,
            connectTimeoutMS: 0
        });
    }

    getModel(col_name) {
        if(!this.models[col_name]){
            const Any = new Schema({_id: {type: String}}, {strict: false});
            this.models[col_name] = mongoose.model(col_name, Any, col_name);
        }
        return this.models[col_name];
    }

    doPost(col_name, data) {
        return new Promise((resolve, reject) => {
            let Model = this.getModel(col_name);
            let model = new Model(data);
            model.save(function (err) {
                if (err) reject(err);
                resolve(data);
            });
        })
    }

    doGet(col_name, id) {
        return new Promise((resolve, reject) => {
            let Model = this.getModel(col_name);
            Model.findById(id, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }

    doPut(db_name, col_name, id, data) {
        return new Promise((resolve, reject) => {
            let Model = this.getModel(col_name);
            Model.findByIdAndUpdate(id, data, function (err, item) {
                if (err) reject(err);
                resolve(item);
            });
        });
    }


    doDelete(col_name, id) {
        return new Promise((resolve, reject) => {
            let Model = this.getModel(col_name);
            Model.findById(id, function (err, item) {
                if (err) reject(err);
                item.remove(function (err) {
                    if (err) reject(err);
                    resolve(item);
                });
            });
        });
    }

    doGetList(col_name) {
        return new Promise((resolve, reject) => {
            let Model = this.getModel(col_name);
            Model.find({}, function (err, items) {
                if (err) reject(err);
                resolve(items);
            });
        });
    }
}

mongoose_adapter = new MongooseAdapter();
module.exports = mongoose_adapter;
