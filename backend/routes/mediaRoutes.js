const express = require('express');
const router  = express.Router();

// NOTE: Keys are read inside each handler (not at module load time)
// so they are always available after dotenv.config() runs in server.js

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/media/videos?category=Tech
// Proxies YouTube Data API v3 search — keeps API key server-side
// ─────────────────────────────────────────────────────────────────────────────
const YT_QUERIES = {
  All:      'NYC youth programs after school opportunities teens',
  Tech:     'NYC youth coding technology bootcamp teens',
  Sports:   'NYC youth sports program teens Bronx Brooklyn',
  Arts:     'NYC youth arts creative program teens',
  Business: 'NYC teen young entrepreneur success story',
  Camps:    'NYC summer camp youth free programs',
};

router.get('/videos', async (req, res) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const category = req.query.category || 'All';
  const query    = YT_QUERIES[category] || YT_QUERIES.All;

  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY is not set in .env');
    return res.status(500).json({ message: 'YouTube API key not configured on server' });
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part',              'snippet');
    url.searchParams.set('q',                query);
    url.searchParams.set('type',             'video');
    url.searchParams.set('maxResults',       '5');
    url.searchParams.set('relevanceLanguage','en');
    url.searchParams.set('regionCode',       'US');
    url.searchParams.set('safeSearch',       'strict');
    url.searchParams.set('key',              YOUTUBE_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('YouTube API error:', response.status, errBody);
      return res.status(response.status).json({
        message: 'YouTube API request failed',
        details: errBody,
      });
    }

    const data = await response.json();

    // Shape the data cleanly so the frontend gets a simple array
    const videos = (data.items || []).map(item => ({
      id:        item.id.videoId,
      title:     item.snippet.title,
      channel:   item.snippet.channelTitle,
      desc:      item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url
                 || item.snippet.thumbnails?.medium?.url
                 || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));

    res.json({ videos, category, query });

  } catch (error) {
    console.error('Videos route error:', error.message);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/media/news?topic=NYC+youth+programs
// Proxies NewsAPI — fixes the CORS block that exists on the free tier
// ─────────────────────────────────────────────────────────────────────────────
router.get('/news', async (req, res) => {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const topic    = req.query.topic || 'NYC youth programs opportunities';
  const pageSize = parseInt(req.query.pageSize, 10) || 15;

  if (!NEWS_API_KEY) {
    console.error('NEWS_API_KEY is not set in .env');
    return res.status(500).json({ message: 'News API key not configured on server' });
  }

  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q',          topic);
    url.searchParams.set('language',   'en');
    url.searchParams.set('sortBy',     'publishedAt');
    url.searchParams.set('pageSize',   String(pageSize));
    url.searchParams.set('apiKey',     NEWS_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('NewsAPI error:', response.status, errBody);
      return res.status(response.status).json({
        message: 'NewsAPI request failed',
        details: errBody,
      });
    }

    const data = await response.json();

    // Filter out removed/deleted articles and ones without images
    const articles = (data.articles || []).filter(
      a => a.title && a.title !== '[Removed]' && a.urlToImage
    );

    res.json({ articles, total: articles.length, topic });

  } catch (error) {
    console.error('News route error:', error.message);
    res.status(500).json({ message: 'Server error fetching news' });
  }
});

module.exports = router;