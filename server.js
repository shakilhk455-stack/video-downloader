const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;
    
    if (!videoUrl) {
        return res.status(400).send("Please provide a valid video link.");
    }

    try {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        const ytdlp = spawn('yt-dlp', ['-o', '-', videoUrl]);

        ytdlp.stdout.pipe(res);

        ytdlp.stderr.on('data', (data) => {
            console.error(`yt-dlp stderr: ${data}`);
        });

        ytdlp.on('error', (err) => {
            console.error('Failed to start subprocess:', err);
            if (!res.headersSent) {
                res.status(500).send("Could not process this video link. Please verify if the post is public.");
            }
        });

    } catch (error) {
        console.error('Error:', error);
        if (!res.headersSent) {
            res.status(500).send("Internal server error occurred.");
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const