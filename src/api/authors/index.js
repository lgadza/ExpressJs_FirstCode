import express, { response } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
// import { getAuthors } from "../../lib/fs-tools";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log("New****************", authorsJSONPath);

const authorsRouter = express.Router();

authorsRouter.post("/", (req, res) => {
  console.log(req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
    // avatar: `https://ui-avatars.com/api/?name=${req.body.name}`,
  };
  const authorsList = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsList.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsList));
  res.status(201).send({ id: newAuthor.id });
});
authorsRouter.get("/", (req, res) => {
  const authorsList = fs.readFileSync(authorsJSONPath);
  console.log("authorlist:", authorsList);
  const authors = JSON.parse(authorsList);
  res.send(authors);
});
authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorlist = JSON.parse(fs.readFileSync(authorsJSONPath));
  const foundAuthor = authorlist.find((author) => author.id === authorId);
  res.send(foundAuthor);
});
authorsRouter.put("/:authorId", (req, res) => {
  console.log(req.body);
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorList.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthorData = authorList[index];
  const updatedAuthor = {
    ...oldAuthorData,
    ...req.body,
    updatedAt: new Date(),
  };
  authorList[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorList));
  res.send(updatedAuthor);
});
authorsRouter.delete("/:authorId", (req, res) => {
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainAuthors = authorList.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainAuthors));
  res.status(204).send();
});
export default authorsRouter;
