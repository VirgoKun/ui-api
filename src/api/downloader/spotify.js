module.exports = function (app) {
    const Spotify = require('../../src/lib/spotify'); // path sesuai yang kamu bilang

    app.get('/downloader/spotify', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" is required'
            });
        }

        try {
            const result = await Spotify.download(url);

            if (!result.status || !result.result?.url) {
                return res.status(500).json({
                    status: false,
                    error: 'Gagal mengambil lagu. Pastikan link Spotify valid dan lagu tersedia untuk diunduh.'
                });
            }

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                result: {
                    title: result.result.title,
                    artists: result.result.artists,
                    thumbnail: result.result.thumbnail,
                    url: result.result.url
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                error: 'Internal server error saat mengambil lagu dari Spotify.'
            });
        }
    });
};
