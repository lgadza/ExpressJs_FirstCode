import express, { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";

const { NotFound, Unauthorised, BadRequest } = httpErrors;

const blogPostsRouter = express.Router();
const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (blogPostsList) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsList));

blogPostsRouter.post("/", (req, res, next) => {
  console.log(req.body);
  const newBlogPost = {
    ...req.body,
    createdAt: new Date(),
    _id: uniqid(),
  };
  const blogPostsList = getBlogPosts();
  blogPostsList.push(newBlogPost);
  writeBlogPosts(blogPostsList);
  res.status(201).send({ _id: newBlogPost._id });
});
