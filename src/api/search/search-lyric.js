const { lyrics } = require('../../lib/lyric');

module.exports = function(app) {
    app.get('/search/lyric/search', async (req, res) => {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "query" diperlukan'
            });
        }

        try {
            const result = await lyrics.search(query);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            console.error('Error lyric search:', error.message);
            res.status(500).json({
                status: false,
                error: 'Gagal mencari lirik'
            });
        }
    });
};
