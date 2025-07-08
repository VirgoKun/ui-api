module.exports = function (app) {
    const { muslimai } = require('../../lib/muslimai');

    app.get('/ai/muslimai', async (req, res) => {
        const { text } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "text" is required'
            });
        }

        try {
            const output = await muslimai(text);

            // Kalau hasilnya error (misalnya dari axios), tangani di sini
            if (output instanceof Error) {
                return res.status(500).json({
                    status: false,
                    error: output.message || 'Internal error from muslimai'
                });
            }

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                question: text,
                result: output.answer,
                sources: output.source
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message || 'Something went wrong'
            });
        }
    });
};
