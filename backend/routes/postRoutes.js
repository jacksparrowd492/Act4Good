// postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


router.get("/getAllPosts", postController.getAllPosts);

router.get("/getPostById/:postId", postController.getPostById);

router.get("/getMyPosts", postController.getMyPosts);

router.post("/createPost", postController.createPost);

router.put("/updatePost/:postId", postController.updatePost);

router.delete("/deletePost/:postId", postController.deletePost);

module.exports = router;
