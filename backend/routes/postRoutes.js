const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const Post = require('../models/Post');
const User = require('../models/User'); 
const Notification = require('../models/Notification');
const { minioClient, bucketName } = require('../config/minioClient');

const upload = multer({ dest: 'uploads/' });


router.post('/create', upload.single('file'), async (req, res) => {
    const { content, email, codesnippet, fileExtension } = req.body;

    try {
        let fileName;

        
        if (req.file) {
            
            const originalFileName = req.file.originalname;
            fileName = `${Date.now()}_${originalFileName}`;
            const filePath = req.file.path;
          
            
           await minioClient.fPutObject(bucketName, fileName, filePath);
            fs.unlinkSync(filePath);
          
        } else if (codesnippet) { 
            fileName = `${Date.now()}${fileExtension}`; 
            const filePath = `uploads/${fileName}`;

            fs.writeFileSync(filePath, codesnippet); 

           
            await minioClient.fPutObject(bucketName, fileName, filePath);
            fs.unlinkSync(filePath); 
        }

        console.log('Post data:', { content, email, codesnippet, fileName });

        
        const newPost = new Post({
            content,
            email,
            file: fileName || null,
        });

        await newPost.save();

       
        const users = await User.find({ email: { $ne: email } }); 
        const notifications = users.map(user => ({
            email: user.email,
            postId: newPost._id, 
        }));

       
        await Notification.insertMany(notifications);

        res.status(201).json({ message: 'Post created successfully', post: newPost });

    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Failed to create post' });
    }
});


router.get('/all', async (req, res) => {
    const { email } = req.query;

    try {
        const posts = await Post.find({ email: { $ne: email } }).sort({ createdAt: -1 });

        
        const postsWithFileContent = await Promise.all(posts.map(async (post) => {
            const postObj = { ...post._doc };  
            if (post.file) {
                const fileStream = await minioClient.getObject(bucketName, post.file);
                const fileContent = await new Promise((resolve, reject) => {
                    let data = '';
                    fileStream.on('data', (chunk) => (data += chunk.toString()));
                    fileStream.on('end', () => resolve(data));
                    fileStream.on('error', reject);
                });
                postObj.codesnippet = fileContent;
            } else {
                postObj.codesnippet = null; 
            }
            return postObj; 
        }));

        res.status(200).json({ posts: postsWithFileContent });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error while fetching posts' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const postObj = { ...post._doc }; 
        if (post.file) {
            const fileStream = await minioClient.getObject(bucketName, post.file);
            const fileContent = await new Promise((resolve, reject) => {
                let data = '';
                fileStream.on('data', (chunk) => (data += chunk.toString()));
                fileStream.on('end', () => resolve(data));
                fileStream.on('error', reject);
            });
            postObj.codesnippet = fileContent; 
        } else {
            postObj.codesnippet = null;
        }

        res.status(200).json(postObj);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error while fetching post' });
    }
});

router.delete('/', async (req, res) => {
    const { postId, email } = req.query;
  
    try {
      const deletedNotification = await Notification.findOneAndDelete({ postId, email });
      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found for this user.' });
      }
      res.status(200).json({ message: 'Notification removed for this user.' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Failed to delete notification.' });
    }
  });
  

module.exports = router;


