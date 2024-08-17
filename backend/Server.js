const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid').v4;
const cors = require('cors');
const User = require('./models/user');
const Message = require('./models/messages');
const Session = require('./models/session');
const Post = require('./models/posts');
const Comment = require('./models/comment');
const http = require('http');
const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'ThisIsNotASecureSecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    rolling: true,
}));


mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true });

const authenticateSession = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const userSession = await findSessionBySessionToken(authHeader.substring(7, authHeader.length));

            if (userSession && userSession.isValid) {
                req.session = userSession;
                return next();
            }
        }

        return res.status(403).json({ error: 'User not authenticated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const findSessionBySessionToken = async (sessionToken) => {
    try {
        return await Session.findOne({sessionToken});
    } catch (error) {
        console.error('Error finding session by userId:', error);
        throw error;
    }
};

app.post('/signup', async (req, res) => {
    try {
        const { username, password, realname, profilePicture } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { realname }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ username, password, realname, profilePic: profilePicture });
        await newUser.save();

        req.session.userId = newUser._id;

        const sessionToken = uuid();
        const session = new Session({
            userId: newUser._id,
            sessionToken: sessionToken,
            isValid: true,
        });
        await session.save();
        res.status(201).json({ message: 'User registered successfully', sessionId: sessionToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;

        const sessionToken = uuid();
        const session = new Session({
            userId: user._id,
            sessionToken: sessionToken,
            isValid: true,
        });
        await session.save();
        res.status(200).json({ message: 'Login successful', sessionId: sessionToken, username: user.username, realname: user.realname, profilePic: user.profilePic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = ( findSessionBySessionToken(token)).userId;

        Session.findOneAndDelete({userId: userId});
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Logout successful' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/user/:username', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = ( findSessionBySessionToken(token)).userId;

        const username = req.params.username;
        const { realname, avatar } = req.body;

        const user = await User.findOneAndUpdate({ username }, { realname, avatar }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/postsGet', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;

        const posts = await Post.find({}).populate('poster', 'username profilePic');

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/postGet/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId).populate('poster', 'username profilePic');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ post: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/postsByUser/:username', async (req, res) => {
    try {
        const username = req.params.username;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ poster: user._id }).populate('poster', 'username profilePic');

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/postCreate', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;
        const text = req.body.post;

        const post = new Post({
            poster: userId,
            postText: text
        });
        await post.save();
        res.status(200).json({ message: 'Post created successfully', postId: post._id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/post/:postId/upvote', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.upvotes.includes(userId)) {
            await Post.updateOne({ _id: postId }, { $pull: { upvotes: userId } });
        } else {
            await Post.updateOne({ _id: postId }, { $addToSet: { upvotes: userId } });
        }

        const updatedPost = await Post.findById(postId);

        res.status(200).json({ message: 'Upvote successful', post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/post/:postId/downvote', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.downvotes.includes(userId)) {
            await Post.updateOne({ _id: postId }, { $pull: { downvotes: userId } });
        } else {
            await Post.updateOne({ _id: postId }, { $addToSet: { downvotes: userId } });
        }

        const updatedPost = await Post.findById(postId);

        res.status(200).json({ message: 'Downvote successful', post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/messagePost', authenticateSession, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;

        const { senderUsername, receiverUsername, text } = req.body;
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }

        const message = new Message({
            sender: userId,
            receiver: receiverUsername,
            message: text
        });
        await message.save();
        res.status(200).json({ message: 'Message sent successfully', messageId: message._id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/messagesGet', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;

        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        });

        res.status(200).json({ messages: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/post/:postId/comments', async (req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await Comment.find({ post: postId }).populate('sender', 'username');

        if (!comments) {
            return res.status(404).json({ error: 'No comments found for this post' });
        }

        res.status(200).json({ comments: comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/post/:postId/comment', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7, authHeader.length);
        const userId = (await findSessionBySessionToken(token)).userId;

        const postId = req.params.postId;
        const comment = req.body.comment;
        const newComment = new Comment({ post: postId, comment: comment, sender: userId });

        await newComment.save();

        res.status(201).json({ comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/commentsGet/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('sender', 'username');

        if (!comments) {
            return res.status(404).json({ error: 'No comments found for this post' });
        }

        res.status(200).json({ comments: comments.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});