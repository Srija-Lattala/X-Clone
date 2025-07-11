import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: false,
        default: ""
    },
    img: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
        },
    ],

    isRepost: {
        type: Boolean,
        default: false
    },
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    repostedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
