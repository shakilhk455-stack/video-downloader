const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'Please provide a video URL' });
    }

    try {
        // Using a reliable multi-platform endpoint
        const response = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
        if (response.data && response.data.code === 0) {
            return res.json({ url: response.data.data.play });
        }

        // Fallback to alternative API
        const altResponse = await axios.get(`https://apis.davidcyriltech.my.id/download?url=${encodeURIComponent(videoUrl)}`);
        if (altResponse.data && altResponse.data.success) {
            return res.json(altResponse.data);
        }

        res.status(500).json({ error: 'Could not fetch video from provider' });
    } catch (error) {
        res.status(500).json({ error: 'Server error processing request' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
