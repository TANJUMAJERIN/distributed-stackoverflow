// minioClient.js

const Minio = require('minio');

// Initialize MinIO client
const minioClient = new Minio.Client({
    endPoint: 'minio', // Updated to connect from Docker to host
    port: 9000,                       // Default port
    useSSL: false,                    // Set to true if using SSL
    accessKey: 'minioadmin',          // Replace with your MinIO access key
    secretKey: 'minioadmin'           // Replace with your MinIO secret key
});

const bucketName = 'post-files';
minioClient.bucketExists(bucketName, (err) => {
    if (err) {
        if (err.code === 'NoSuchBucket') {
            minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
                if (err) console.log('Error creating bucket:', err);
                else console.log(`Bucket "${bucketName}" created successfully`);
            });
        } else {
            console.error('Error checking bucket existence:', err);
        }
    }
});

module.exports = { minioClient, bucketName };
