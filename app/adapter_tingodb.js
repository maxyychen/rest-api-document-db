

const Engine = require('tingodb')();
const fs = require('fs');

const tingo_data_path = process.env.TINGO_DATA_FOLDER || "./tingo_data";

const check_path = (path) =>{
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};


class TingoAdapter {
  constructor(){
    check_path(tingo_data_path);
    this.dbs = {};
  }

  getDb(db_name) {
    if(!this.dbs[db_name]){
      const dbpath = `${tingo_data_path}/${db_name}`;
      check_path(dbpath);
      this.dbs[db_name] = new Engine.Db(dbpath, {});
    }
    return this.dbs[db_name];
  }

  doPost(db_name, col_name, data){
    return new Promise((resolve, reject)=>{
      let collection = this.getDb(db_name).collection(col_name);
      collection.insert(data, {w:1}, function(err, result) {
        if(err) reject(err);  
        resolve(result);
      });
    })
  }

  doGet(db_name, col_name, id){
    return new Promise((resolve, reject)=>{
      let collection = this.getDb(db_name).collection(col_name);
      collection.findOne({_id: id}, function(err, item) {
        if(err) reject(err);  
        resolve(item);
      });
    });
  }

  doPut(db_name, col_name, id, data){
    return new Promise((resolve, reject)=>{
      let collection = this.getDb(db_name).collection(col_name);
      collection.update({_id: id}, data, (err,item)=>{
        if(err) reject(err);  
        resolve(item);
      })
    });
  }


  doDelete(db_name, col_name, id){
    return new Promise((resolve, reject)=>{
      let collection = this.getDb(db_name).collection(col_name);
      collection.remove({_id: id}, function(err, item) {
        if(err) reject(err);  
        resolve(item);
      });
    });
  }

  doGetList(db_name, col_name, queryObj){
    return new Promise((resolve, reject)=>{
      let collection = this.getDb(db_name).collection(col_name);
      collection.find(queryObj).toArray((err, items) => {
        if(err) reject(err);  
        resolve(items);
      });
    });
  }


}


tingo_adapter = new TingoAdapter();

// const main = async ()=>{
  // rel = await tingo_adapter.doPost("test","testcol",{_id:"111",data:"data"});
  // rel = await tingo_adapter.doGet("test","testcol", "111");
  // rel = await tingo_adapter.doPut("test","testcol", "111", {data: "new data"});
  // rel = await tingo_adapter.doGetList("test","testcol", {id: "1"});
  // rel = await tingo_adapter.doDelete("test","testcol","111");
  // console.log(rel);
// }
// main();
module.exports = tingo_adapter;
