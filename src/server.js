import express from "express";
import { join } from "path";
// import { authorsRouter } from "./api/authors/index.js";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import filesRouter from "./api/files/index.js";
import blogPostsRouter from "./api/blogPosts/index.js";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./api/errorHandler.js";
const server = express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");
server.use(express.json());
server.use(cors());
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Author";
  next();
};
server.use(express.static(publicFolderPath));
server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);
server.use("/authors", filesRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this is the port", port);
});
