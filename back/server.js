const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/get_video_info', async (req, res) => {
    try {
        const videoId = req.query.video_id;
        const response = await axios.get(`https://www.youtube.com/get_video_info?video_id=${videoId}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(error.response?.status || 500).send('Failed to fetch video info');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
