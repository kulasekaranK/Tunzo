const express = require('express');
const cors = require('cors');
const YTMusic = require('ytmusic-api');

const ytdl = require('ytdl-core');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ytmusic = new YTMusic();

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    const searchResults = await ytmusic.search(query);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Failed to search songs.' });
  }
});

app.get('/download', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ error: 'Query parameter "videoId" is required.' });
  }

  try {
    const info = await ytdl.getInfo(videoId);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const downloadUrls = audioFormats.map(format => ({
      quality: format.audioQuality,
      url: format.url
    }));
    res.json({ downloadUrls });
  } catch (error) {
    console.error('Error getting download link:', error);
    res.status(500).json({ error: 'Failed to get download link.' });
  }
});(async () => {
  try {
    await ytmusic.initialize();
    console.log('YTMusic API initialized');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize YTMusic API:', error);
    process.exit(1);
  }
})();
