const axios = require('axios');

const availableLangs = [
  'html', 'python', 'c', 'cpp', 'markdown', 'latex', 'json', 'css',
  'javascript', 'jinja2', 'typescript', 'yaml', 'dockerfile', 'shell', 'r',
  'sql', 'sql-msSQL', 'sql-mySQL', 'sql-mariaDB', 'sql-sqlite', 'sql-cassandra',
  'sql-plSQL', 'sql-hive', 'sql-pgSQL', 'sql-gql', 'sql-gpSQL', 'sql-sparkSQL',
  'sql-esper', 'transformers.js'
];

async function anycoder(prompt, { use_search = false, language = 'html' } = {}) {
  if (!prompt) throw new Error('Prompt is required');
  if (typeof use_search !== 'boolean') throw new Error('Search must be boolean');
  if (!availableLangs.includes(language)) throw new Error(`Available languages: ${availableLangs.join(', ')}`);

  const session_hash = Math.random().toString(36).substring(2);

  const res = await axios.post(`https://akhaliq-anycoder.hf.space/gradio_api/queue/join?`, {
    data: [prompt, null, null, null, null, null, null, use_search, language, null],
    event_data: null,
    fn_index: 7,
    trigger_id: 14,
    session_hash
  });

  const response = await axios.get(`https://akhaliq-anycoder.hf.space/gradio_api/queue/data?session_hash=${session_hash}`);

  let result;
  const lines = response.data.split('\n\n');
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const d = JSON.parse(line.substring(6));
      if (d.msg === 'process_completed') result = d.output.data[0];
    }
  }

  return result;
}

module.exports = function (app) {
  app.get('/ai/anycoder', async (req, res) => {
    const { prompt, language = 'html', search } = req.query;

    if (!prompt) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "prompt" is required'
      });
    }

    const use_search = search === 'true';

    try {
      const code = await anycoder(prompt, { use_search, language });

      return res.status(200).json({
        status: true,
        creator: 'Rasya',
        prompt,
        language,
        search: use_search,
        result: code
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  });
};
