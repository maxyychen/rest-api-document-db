// const adapter = require('./adapter_tingodb');
const adapter = require('./adapter_mongoose');
const showdown  = require('showdown');
const converter = new showdown.Converter();
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

const pathPharser = (req) => {
    return {
        db: req.params.db,
        collection: req.params.collection,
        id: req.params.id || null
    }
};


const doGet = async function (req, res, next) {
    console.log("GET-request recieved");
    const par = pathPharser(req);
    const data = await adapter.doGet(par.collection, par.id);
    res.send(data);
    return next();
};

const doGetList = async function (req, res, next) {
    console.log("GETList-request recieved");
    const par = pathPharser(req);
    const data = await adapter.doGetList(par.collection, {});
    res.send(data);
    return next();
};


const doPost = async function (req, res, next) {
    console.log("POST-request recieved");
    try{
        const par = pathPharser(req);
        const obj = req.body;
        const data = await adapter.doPost(par.collection, obj);
        res.send(data);
    }catch(err){
        res.send({error:err.message, data: obj});
    }
    return next();
};


const doPut = async function (req, res, next) {
    console.log("PUT-request recieved");
    try{
        const par = pathPharser(req);
        const obj = req.body;
        const data = await adapter.doPut(par.collection, par.id, obj);
        res.send(data);
    }catch(err){
        res.send({error:err.message, data: obj});
    }
    return next();
};


const doDelete = async function (req, res, next) {
    console.log("DELETE-request recieved");
    const par = pathPharser(req);
    const data = await adapter.doDelete(par.collection, par.id);
    res.send(data);
    return next();
};

const doQueryPost = async function (req, res, next) {
    console.log("Query-POST-request recieved");
    try{
        const par = pathPharser(req);
        const obj = req.body;
        const data = await adapter.doGetList(par.collection, obj);
        res.send(data);
    }catch(err){
        res.send({error:err.message, data: obj});
    }
    return next();
};


const help = async function (req, res, next) {
    fs.readFileAsync("README.md", "utf8").then(function(data) {
        const html = converter.makeHtml(data);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(html),
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();
        return next();
    }).catch(function(e) {
        console.error(e.stack);
        res.status(404).send('Not found');
        return next();
    });
};


module.exports.help = help;
module.exports.doGet = doGet;
module.exports.doGetList = doGetList;
module.exports.doPost = doPost;
module.exports.doPut = doPut;
module.exports.doDelete = doDelete;
module.exports.doQueryPost = doQueryPost;


