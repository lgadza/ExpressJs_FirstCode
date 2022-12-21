import express from "express";
// import { authorsRouter } from "./api/authors/index.js";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import blogPostsRouter from "./api/blogPosts/index.js";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./api/errorHandler.js";
const server = express();
const port = 3001;

/* 
const loggerMiddleware = (req, res, next) => {
  // console.log(req.headers)
  console.log(`Request method ${req.method} -- url ${req.url} -- ${new Date()}`)
  req.user = "Dan"
  next() // gives the control to whom is coming next (either another middleware or route handler)
}

const policeOfficerMiddleware = (req, res, next) => {
  console.log("Current user:", req.user)
  if (req.user === "Riccardo") {
    res.status(403).send({ message: "Riccardos are not allowed!" }) // Middlewares could decide to end the flow
  } else {
    next()
  }
} */
server.use(express.json());
server.use(cors());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this is the port", port);
});
