
const restify = require("restify");
const handler = require('./handler');

const server_name = process.env.SERVER_NAME || "rest-api-document-db";
const server_port = process.env.PORT || 8510;



const server = restify.createServer({
  name: server_name
});

server.get("/", handler.help);
server.post("/query/:db/:collection", handler.doQueryPost);
server.post("/:db/:collection", handler.doPost);
server.get("/:db/:collection/:id", handler.doGet);
server.get("/:db/:collection", handler.doGetList);
server.put("/:db/:collection/:id", handler.doPut);
server.del("/:db/:collection/:id", handler.doDelete);


server.listen(server_port, function () {
  console.log("listening at %s", server_port);
});
