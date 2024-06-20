import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { config } from "./src/settings/config.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { startConnection } from "./src/settings/database.js";
import { materialRouter } from "./src/routes/material.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";
import { visualRouter } from "./src/routes/visual.routes.js";
import { subcategoryRouter } from "./src/routes/subcategory.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(helmet());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "src", "public");
app.use(express.static(publicPath));


//---------Rutas visualizacion-----//
app.use("/material", visualRouter)




//---------Rutas api-----------//
app.use("/api/auth", authRouter);
app.use("/api/material", materialRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);

app.listen(config.port, async () => {
  await startConnection({
    uri: config.mongo,
    database: config.database,
  });
  console.log("Server is running on port: http://localhost:" + config.port);
});
