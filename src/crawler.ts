import axios from "axios";
import { parse } from "node-html-parser";
import { join } from "path";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(join(__dirname, "..", "/database.sqlite3"));

// setup the initial tables
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS crawl_result (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            headings TEXT NOT NULL,
            paragraphs TEXT NOT NULL
        );
    `);
});

const crawlAndIndex = async () => {
  try {
    const http_response = await axios.get(
      "https://en.wikipedia.org/wiki/Node.js"
    );
    const p = parse(http_response.data);
    const all_href: Array<string> = p
      .querySelectorAll("a")
      .map((ele) => {
        return ele.getAttribute("href") || " ";
      })
      .map((href) => {
        if (href && href.startsWith("/")) {
          return `https://en.wikipedia.org${href}`;
        }
        return href;
      });

    for (let i = 0; i < all_href.length; i++) {
      try {
        const content = await axios.get(all_href[i]);
        const parsed_content = parse(content.data);
        const title = parsed_content.querySelector("title")?.text;
        const headings = parsed_content
          .querySelectorAll("h1, h2, h3, h4, h5, h6")
          .map((ele) => ele.text);
        //const paragraphs = parsed_content.querySelectorAll('p').map(ele => ele.text);
        const cw = db.prepare(
          `INSERT INTO crawl_result (url, title, headings, content) VALUES (?,?,?,?)`,
          all_href[i],
          title,
          headings.join("|"),
          parsed_content.text
        );
        cw.finalize();
      } catch (err) {
        console.error(err);
        console.error("there was some error during fetching the content");
      }
    }
    console.log(all_href);

    // const all_links = all_a.filter(ele => ele.startsWith('/url?q=')).map(ele => ele.slice(7, ele.indexOf('&sa=U&ved=2')));
    // console.log(all_links);
  } catch (error) {
    console.error(error);
  }
};

crawlAndIndex();
