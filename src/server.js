import express from "express";
// import { authorsRouter } from "./api/authors/index.js";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./api/blogPosts/index.js";

const server = express();
const port = 3001;
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this is the port", port);
});
