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

    // List of alternative free APIs
    const apis = [
        async () => {
            const response = await axios.post('https://co.wuk.sh/api/json', { url: videoUrl }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }
            });
            return response.data;
        },
        async () => {
            const response = await axios.get(`https://apis.davidcyriltech.my.id/download?url=${encodeURIComponent(videoUrl)}`);
            return response.data;
        }
    ];

    for (const api of apis) {
        try {
            const data = await api();
            if (data && (data.url || data.downloadUrl || data.picker)) {
                return res.json(data);
            }
        } catch (err) {
            continue; // Try next API if one fails
        }
    }

    res.status(500).json({ error: 'Could not process the video from any available sources' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
