const { muslimai } = require('../../lib/muslimai'); // pastikan path-nya benar

module.exports = function(app) {
    app.get('/ai/muslimai', async (req, res) => {
        const { text } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                error: 'Query "text" tidak boleh kosong'
            });
        }

        try {
            const result = await muslimai(text);

            // Cek apakah hasilnya error dari axios
            if (result instanceof Error) {
                return res.status(500).json({
                    status: false,
                    error: result.message || 'Terjadi kesalahan saat memproses permintaan'
                });
            }

            res.status(200).json({
                status: true,
                creator: 'Rasya',
                question: text,
                result: result.answer,
                sources: result.source
            });
        } catch (error) {
            console.error("MuslimAI error:", error);
            res.status(500).json({
                status: false,
                error: 'Gagal mengambil jawaban dari MuslimAI'
            });
        }
    });
};
