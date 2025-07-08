const axios = require('axios');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

async function getTikTokDownloadInfo(url) {
  const jar = new CookieJar();
  const api = axios.create({
    jar,
    withCredentials: true,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    }
  });
  wrapper(api);

  const htmlResponse = await api.get(url);
  const $ = cheerio.load(htmlResponse.data);
  const scriptContent = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
  if (!scriptContent) throw new Error('Script tag not found.');

  const jsonData = JSON.parse(scriptContent);
  const itemStruct = jsonData?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct;
  if (!itemStruct) throw new Error('Video data not found.');

  const videoUrl = itemStruct.video?.downloadAddr || itemStruct.video?.playAddr;
  const videoId = itemStruct.id;

  return {
    videoUrl,
    filename: `${videoId}.mp4`,
    metadata: {
      title: itemStruct.desc,
      author: itemStruct.author?.uniqueId,
      music: itemStruct.music?.title,
      stats: {
        likes: itemStruct.stats?.diggCount,
        shares: itemStruct.stats?.shareCount
      }
    }
  };
}

module.exports = function (app) {
  app.get('/downloader/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ status: false, error: "Parameter 'url' is required" });
    }

    try {
      const { videoUrl, filename } = await getTikTokDownloadInfo(url);
      if (!videoUrl) {
        return res.status(404).json({ status: false, error: 'Video URL not found' });
      }

      const response = await axios.get(videoUrl, {
        responseType: 'stream',
        headers: {
          Referer: url,
          Range: 'bytes=0-'
        }
      });

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      response.data.pipe(res); // Langsung kirim ke client

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message || err
      });
    }
  });
};
