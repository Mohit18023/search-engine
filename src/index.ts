import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {PORT} from './constants'
const app = express();

// Middlewares
app.use(helmet);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

// 404 route handler
app.all("*", (_, res) => {
  res.status(404).send({
    msg: " The route you are searching for does not exits.",
  });
});

// error handler
// app.use((err, _, res,_) => {
//     console.error(err);
//     res.status(500).send({
//         msg: "There is something wrong with the server"
//     })
// });


app.listen(PORT, ()=>{
    console.log("Server running on port : ",PORT)
})