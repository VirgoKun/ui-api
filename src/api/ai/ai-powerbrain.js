const { powerbrain } = require('../../lib/powerbrain'); // pastikan path-nya sesuai
module.exports = function(app) {
    app.get('/ai/powerbrain', async (req, res) => {
        const { text } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                error: 'Query "text" tidak boleh kosong'
            });
        }

        try {
            const result = await powerbrain(text);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            console.error("Powerbrain error:", error);
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil data dari PowerBrain'
            });
        }
    });
};
