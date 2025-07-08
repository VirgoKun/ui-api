module.exports = function (app) {
  const { tiktok } = require('../../lib/tiktok');

  app.get('/downloader/tiktok', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "url" is required'
      });
    }

    try {
      const result = await tiktok(url);

      if (!result || !result.result) {
        return res.status(500).json({
          status: false,
          error: 'Failed to fetch TikTok data'
        });
      }

      return res.status(200).json({
        status: true,
        creator: 'Rasya',
        result: result.result
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        error: 'Something went wrong, make sure the TikTok link is public.'
      });
    }
  });
};
