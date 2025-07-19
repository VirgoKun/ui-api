const kuroGaze = require('../../lib/kurogaze'); // Pastikan path benar

module.exports = function(app) {
  // 🔍 Search Anime
  app.get('/anime/kurogaze/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ status: false, error: 'Parameter ?query= wajib diisi' });
    }
    const result = await kuroGaze.search(query);
    res.status(result.code).json(result);
  });

  // 📄 Detail Anime
  app.get('/anime/kurogaze/detail', async (req, res) => {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ status: false, error: 'Parameter ?url= wajib diisi' });
    }
    const result = await kuroGaze.details(url);
    res.status(result.code).json(result);
  });

  // 🔁 Ongoing Anime
  app.get('/anime/kurogaze/ongoing', async (req, res) => {
    const result = await kuroGaze.ongoing();
    res.status(result.code).json(result);
  });

  // 🗓️ Jadwal Anime
  app.get('/anime/kurogaze/schedule', async (req, res) => {
    const result = await kuroGaze.schedule();
    res.status(result.code).json(result);
  });
};
