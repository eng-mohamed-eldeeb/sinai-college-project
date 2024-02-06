import app from "./app.js";
import dotenv from "dotenv";
import connect from "./db/connect.js";
dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./.env" });

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 4000;
connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
