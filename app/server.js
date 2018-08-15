
const restify = require("restify");
const handler = require('./handler');
const bodyParser = require('body-parser');

const server_name = process.env.SERVER_NAME || "rest-api-document-db";
const server_port = process.env.PORT || 8139;



const server = restify.createServer({
  name: server_name
});

server.use(bodyParser.json());

server.get("/", handler.help);
server.post("/query/:collection", handler.doQueryPost);
server.post("/:collection", handler.doPost);
server.get("/:collection/:id", handler.doGet);
server.get("/:collection", handler.doGetList);
server.put("/:collection/:id", handler.doPut);
server.del("/:collection/:id", handler.doDelete);


server.listen(server_port, function () {
  console.log("listening at %s", server_port);
});
