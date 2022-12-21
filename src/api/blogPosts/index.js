import express, { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { title } from "process";

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
blogPostsRouter.get("/", (req, res, next) => {
  const blogPostsList = getBlogPosts();

  if ((req.query && req.query.title) || req.query.category) {
    blogPostsList.filter(
      (blogPost) =>
        blogPost.title === req.query.title ||
        blogPost.category === req.query.category
    );
  } else {
    res.send(blogPostsList);
  }
});
blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPostsList = getBlogPosts();
    const foundBlogPost = blogPostsList.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
      next(NotFound(`Blog Post id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.put("/:blogPostId", (req, res, next) => {
  try {
    console.log(req.body);
    const blogPostsList = getBlogPosts();
    const index = blogPostsList.findIndex(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldBlogPost = blogPostsList[index];

      const editedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };
      blogPostsList[index] = editedBlogPost;
      writeBlogPosts(blogPostsList);
      res.send(editedBlogPost);
    } else {
      next(NotFound(`Blog Post with id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
  try {
    const blogPostList = getBlogPosts();
    const remainingBlogPost = blogPostList.filter(
      (blogPost) => blogPost._id !== req.params.blogPostId
    );
    if (blogPostList.length !== remainingBlogPost.length) {
      writeBlogPosts(remainingBlogPost);
      res.status(204).send();
    } else {
      next(
        NotFound(`The Blog Post with id ${req.params.blogPostId} not found :(`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default blogPostsRouter;
