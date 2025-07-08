const { otakuDesu } = require('../lib/otakudesu');

module.exports = function(app) {
    app.get('/anime/otakudesu/search', async (req, res) => {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "query" diperlukan'
            });
        }

        try {
            const results = await otakuDesu(query);
            res.status(200).json({
                status: true,
                results
            });
        } catch (error) {
            console.error('Error scraping Otakudesu:', error);
            res.status(500).json({
                status: false,
                error: 'Gagal mencari data di Otakudesu'
            });
        }
    });
};
