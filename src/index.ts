import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./constants";
import sqlite3 from "sqlite3";
import { join } from "path";

const db = new sqlite3.Database(join(__dirname, "..", "./database.sqlite3"));

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

app.get("/query", (req, res) => {
  const { query } = req.query;

  const sql_query = `SELECT url , title FROM crawl_result WHERE content LIKE '%${query}%' OR title LIKE '%${query}%' OR headings LIKE '%${query}%' LIMIT 10`;
  db.all(sql_query, (err, rows) => {
    if (err) {
      return res.status(500).send({
        msg: "There was some error",
      });
    }
    console.log(rows)
    return res.send(rows);
  });
});

// 404 route handler
app.all("*", (_, res) => {
  res.status(404).send({
    msg: " The route you are searching for does not exits.",
  });
});

// error handler
const errorHandler : ErrorRequestHandler = (err,_,res,__) => {
  console.error(err);
  res.status(500).send({
    msg: "There are something wrong",
  })
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on port : ", PORT);
});
