import express, { response } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const authorsRouter = express.Router();

authorsRouter.post("/", (req, res) => {
  console.log(req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: `url("e.g. https://ui-avatars.com/api/?name=John+Doe")`,
  };
  const authorsList = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsList.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsList));
  res.status(201).send({ id: newAuthor.id });
});
export default authorsRouter;
