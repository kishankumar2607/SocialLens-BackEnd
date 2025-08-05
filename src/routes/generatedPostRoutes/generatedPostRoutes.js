const express = require("express");
const router = express.Router();
const generatedPostController = require("../../controllers/generatedPostController/generatedPostController");

router.post("/save-generated-posts", generatedPostController.saveGeneratedPost);

router.get("/get-generated-posts/:userId", generatedPostController.getAllGeneratedPosts);


module.exports = router;
