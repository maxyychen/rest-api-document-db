
const tingo_adapter = require('./adapter_tingodb');


describe('tingo_adapter', () => {

  const data = {_id:"999", data:"this is data"};
  let rel = {};

  it('should be insert data', async () => {
    rel = await tingo_adapter.doDelete("test","testcol",data._id);
    rel = await tingo_adapter.doPost("test","testcol",data);
    expect(rel[0]).toEqual(data);
  });

  it('should get data from insert', async ()=>{
    rel = await tingo_adapter.doGet("test","testcol", data._id);
    expect(rel).toEqual(data);
  });
  
  it('should modify data', async ()=>{
    const data2 = {data:"new data"}
    rel = await tingo_adapter.doPut("test","testcol", data._id, data2);
    expect(rel).toEqual(1);
    rel = await tingo_adapter.doGet("test","testcol", data._id);
    expect(rel.data).toEqual(data2.data);
  });

  it('should modify delete data', async ()=>{
    rel = await tingo_adapter.doDelete("test","testcol",data._id);
    expect(rel).toEqual(1);
    rel = await tingo_adapter.doGet("test","testcol", data._id);
    expect(rel).toEqual(null);
  });

});
