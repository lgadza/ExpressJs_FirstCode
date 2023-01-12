import express from "express";
import multer from "multer";
import { extname } from "path";
import json2csv from "json2csv";
import {
  saveAuthorsAvatars,
  getAuthors,
  writeAuthors,
} from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPostJSONReadableStream } from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import {
  asyncPDFGeneration,
  getPDFReadableStream,
} from "../../lib/pdf-tools.js";

const filesRouter = express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "img/covers",
    },
  }),
}).single("avatar");

filesRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  multer().array("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileExtension;

      await saveAuthorsAvatars(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/blogPosts/${fileName}`;

      const authors = await getAuthors();
      console.log("we are the users", authors);

      const index = authors.findIndex(
        (author) => author.id === req.params.authorId
      );
      if (index !== -1) {
        const oldAuthor = authors[index];

        const author = { ...oldAuthor.author, avatar: url };
        const updatedAuthor = { ...oldAuthor, author, updatedAt: new Date() };

        authors[index] = updatedAuthor;

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

filesRouter.post(
  "/:authorId/uploadCover",
  multer().single("postCover"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileExtension;

      await saveAuthorsAvatars(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/authors/${fileName}`;

      const authors = await getAuthors();

      const index = authors.findIndex(
        (author) => author.id === req.params.authorId
      );
      if (index !== -1) {
        const oldAuthor = authors[index];

        const author = { ...oldAuthor.author, avatar: url };
        const updatedAuthor = { ...oldAuthor, author, updatedAt: new Date() };

        authors[index] = updatedAuthor;

        await writeAuthors(authors);
      }

      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);
filesRouter.get("/pdf", (req, res, next) => {
  console.log("firing");
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogpost.pdf");
    const source = getPDFReadableStream([
      {
        asin: "0345546792",
        title: "The Silent Corner: A Novel of Suspense (Jane Hawk)",
        img: "https://images-na.ssl-images-amazon.com/images/I/91dDIYze1wL.jpg",
        price: 7.92,
        category: "horror",
      },
      {
        asin: "0735218994",
        title: "Celtic Empire (Dirk Pitt Adventure)",
        img: "https://images-na.ssl-images-amazon.com/images/I/91xI4GjM7jL.jpg",
        price: 17.32,
        category: "horror",
      },
    ]);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

filesRouter.get("/postCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=authors.csv");

    const source = getPostJSONReadableStream();
    const transform = new json2csv.Transform({
      fields: ["name", "username"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

filesRouter.get("/asyncPDF", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    await asyncPDFGeneration(authors);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
