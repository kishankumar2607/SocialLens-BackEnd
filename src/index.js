const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
require("./helper/connection")
const app = express();
const server = require("./server")

app.use(server);

const port = process.env.PORT || 7000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});