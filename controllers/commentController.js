//business logic
const Post=require('../models/postModel');
const Comment=require('../models/commentModel');

exports.createComment=async (req,res)=>{
    try{
        //fetch data from req body
        const{post,user,body}=req.body;
        //create a comment object
        const comment=new Comment({
            post,user,body
        });

        //save the new comment into the database
        const savedComment=await comment.save();

        //find the post by id, add the new comment to its comments array
        const updatedPost=await Post.findByIdAndUpdate(post,{$push:{comments: savedComment._id}},{new:true})
                .populate("comments")//populate the comment array with comment document (If we want to show actual comments then we can execute populate other wise it will show only object)
                .exec();
        
        res.json({
            post:updatedPost,
        })

    }catch(error){
        return res.status(500).json({
            error:"Error while creating comment",
        })
    }
}