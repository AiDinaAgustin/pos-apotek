const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("../apidocs.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

const userRoutes = require("./routes/userRoutes");
const outletRoutes = require("./routes/outletRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const receptionRoutes = require('./routes/itemReceptionRoutes')
const historyRoutes = require("./routes/historyRoutes");
const stockCardRoutes = require("./routes/stockCardRoutes");
const emailRoutes = require("./routes/emailRoute");
const itemRequestRoutes = require("./routes/itemRequestRoute");

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/", outletRoutes);
app.use("/", itemRoutes);
app.use("/", orderRoutes);
app.use("/", stockCardRoutes);
app.use("/", receptionRoutes);
app.use("/", historyRoutes);
app.use("/", emailRoutes);
app.use("/", itemRequestRoutes);

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
