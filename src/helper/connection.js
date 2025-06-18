const mongoose = require("mongoose");
const db = mongoose.connection;

const uri = process.env.URI;

// Database connection with MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

db.once("open", () => {
  console.log("Database is open");
});

db.on("error", (err) => {
  console.error("Database connection error:", err);
});

db.on("close", () => {
  console.log("Database is closing...");
});
