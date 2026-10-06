const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    try {
        const videoUrl = req.body.url;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Please provide a video URL' });
        }

        const response = await axios.post('https://co.wuk.sh/api/json', {
            url: videoUrl
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });
