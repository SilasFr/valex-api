import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(json());

app.use(router);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("running on 5000");
});
