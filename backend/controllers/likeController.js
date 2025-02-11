// likeController.js

const Like = require('../models/Like');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const secretKey = 'jwtSecret';
exports.toggleLike = async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
    }
    let userId;
    try {
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            jwt.verify(req.headers['authorization'].substring(7), secretKey, async (error, decodedToken) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    userId = decodedToken.user.id;
                    const existingLike = await Like.findOne({ postId, userId });

                    if (existingLike) {
                        await existingLike.deleteOne();
                        const likedIndex = post.likes.indexOf(userId);
                        post.likes.splice(likedIndex, 1);
                        post.isLiked = false;
                        await post.save();
                        res.status(200).json({ success: true, message: 'Post unliked successfully' });
                    }
                    else {
                        const newLike = new Like({ postId, userId });
                        await newLike.save();
                        post.likes.push(userId);
                        post.isLiked = true;
                        await post.save();
                        res.status(200).json({ success: true, message: 'Post liked successfully' });
                    }
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
