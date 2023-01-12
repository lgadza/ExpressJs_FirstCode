import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/authors");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorList) =>
  writeJSON(authorsJSONPath, authorList);
// export const getBooks = () => readJSON(booksJSONPath);
// export const writeBooks = (booksArray) => writeJSON(booksJSONPath, booksArray);

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);
export const getBooksJSONReadableStream = () => createReadStream(booksJSONPath);
