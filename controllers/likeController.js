const Post = require('../models/postModel');
const Like = require('../models/likeModel');

exports.likePost = async (req, res) => {
    try {
        const { post, user } = req.body;

        // Create and save a new Like document
        const like = new Like({
            post,
            user,
        });

        const savedLike = await like.save();

        // Update the Post document by pushing the new like's _id into the likes array
        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $push: { likes: savedLike._id } },
            { new: true } // Return the updated document
        )
            .populate('likes') // Populate the likes field to show the full Like documents
            .exec();

        // Respond with the updated post
        res.json({
            post: updatedPost,
        });
    } catch (error) {
        // Handle errors with a clear message
        return res.status(400).json({
            error: "Error while liking post",
        });
    }
};


exports.unlikePost = async (req, res) => {
    try {
        const { post, like } = req.body;
        const deletedLike = await Like.findOneAndDelete({ post: post, _id: like });

        const updatedPost = await Post.findByIdAndUpdate(post, { $pull: {likes:deletedLike._id} }, { new: true });

        res.json({
            post: updatedPost
        })
    } catch (error) {
        return res.status(400).json({
            error:"Error while unliking post"
        })
    }
}