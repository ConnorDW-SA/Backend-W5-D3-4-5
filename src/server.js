import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./database.js";
import productRouter from "./api/product/index.js";
import userRouter from "./api/user/index.js";
import categoryRouter from "./api/category/index.js";
import reviewRouter from "./api/review/index.js";
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/product", productRouter);
server.use("/user", userRouter);
server.use("/category", categoryRouter);
server.use("/review", reviewRouter);

server.use(badRequestErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(genericErrorHandler);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.log("Server is running on port: ", port);
  console.table(listEndpoints(server));
});
