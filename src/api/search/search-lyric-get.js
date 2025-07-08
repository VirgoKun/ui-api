const { lyrics } = require('../../lib/lyric');

module.exports = function(app) {
    app.get('/search/lyric/get', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" diperlukan'
            });
        }

        try {
            const result = await lyrics.getLyrics(url);
            if (!result) {
                return res.status(404).json({
                    status: false,
                    error: 'Lirik tidak ditemukan'
                });
            }

            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            console.error('Error get lyric:', error.message);
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil lirik'
            });
        }
    });
};
