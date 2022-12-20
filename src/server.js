import express from "express";
// import { authorsRouter } from "./api/authors/index.js";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";

const server = express();
const port = 3001;
server.use(express.json());

server.use("/authors", authorsRouter);

server.listen(port, () => {
  console.log(listEndpoints(server));
  console.log("this is the port", port);
});
