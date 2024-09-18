const express = require("express");
const app = express();
const cors = require("cors");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
app.use(express.json());
app.use(
    cors({
      origin: ["http://192.168.1.4:3000", "http://localhost:3000"],
    })
  );
  
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.listen(5000,'0.0.0.0', () => console.log("server rning in port 5000"));
