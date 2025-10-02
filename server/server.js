const express = require('express');
const cors = require('cors');
const YTMusic = require('ytmusic-api');

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

(async () => {
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
