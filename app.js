const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.get("/", (req, res) => res.send("Hello World"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/users", users);