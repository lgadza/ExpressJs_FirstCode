import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveAuthorsAvatars,
  getAuthors,
  writeAuthors,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.userId + originalFileExtension;

      await saveAuthorsAvatars(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/authors/${fileName}`;

      const authors = await getAuthors();

      const index = authors.findIndex((user) => user.id === req.params.userId);
      if (index !== -1) {
        const oldAuthor = authors[index];

        const author = { ...oldAuthor.author, avatar: url };
        const updatedAuthor = { ...oldAuthor, author, updatedAt: new Date() };

        authors[index] = updatedUser;

        await writeAuthors(authors);
      }

      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/multiple",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      console.log("FILES:", req.files);
      await Promise.all(
        req.files.map((file) =>
          saveAuthorsAvatars(file.originalname, file.buffer)
        )
      );
      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
