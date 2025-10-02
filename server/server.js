const express = require('express');
const cors = require('cors');
const { YTMusic } = require('ytmusic-api');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const ytmusic = new YTMusic();

ytmusic.initialize().then(() => {
  console.log('YTMusic API initialized');
});

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
