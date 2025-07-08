const { otakuDetail } = require('../../lib/otakudesu');

module.exports = function(app) {
    app.get('/anime/otakudesu/detail', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" diperlukan'
            });
        }

        try {
            const result = await otakuDetail(url);
            if (!result) {
                return res.status(404).json({
                    status: false,
                    error: 'Anime tidak ditemukan atau halaman error'
                });
            }

            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            console.error('Error detail Otakudesu:', error);
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil detail dari Otakudesu'
            });
        }
    });
};
