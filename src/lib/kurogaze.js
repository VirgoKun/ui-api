const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://kurogaze.moe';

function formatResult(success, data, code = 200, message = null) {
  return {
    status: success,
    code,
    ...(success ? { result: data } : { error: message || 'Terjadi kesalahan' })
  };
}

exports.search = async function(query) {
  try {
    const res = await axios.get(`${baseUrl}/?s=${encodeURIComponent(query)}`);
    const $ = cheerio.load(res.data);
    const result = [];

    $('.animepost').each((i, el) => {
      result.push({
        title: $(el).find('.animetitle').text().trim(),
        type: $(el).find('.type').text().trim(),
        upload: $(el).find('.bt > span').text().trim(),
        url: $(el).find('a').attr('href'),
        thumb: $(el).find('img').attr('src')
      });
    });

    return formatResult(true, result);
  } catch (err) {
    return formatResult(false, null, 500, err.message);
  }
};

exports.details = async function(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const info = {};

    $('.infodes').find('tr').each((i, el) => {
      const key = $(el).find('td:nth-child(1)').text().trim().replace(':', '');
      const val = $(el).find('td:nth-child(2)').text().trim();
      if (key && val) info[key.toLowerCase()] = val;
    });

    const sinopsis = $('.sinopc').text().trim();
    const episodes = [];

    $('.episodelist ul li').each((i, el) => {
      episodes.push({
        episode: $(el).find('.epl-title').text().trim(),
        upload: $(el).find('.epl-date').text().trim(),
        url: $(el).find('a').attr('href')
      });
    });

    return formatResult(true, {
      title: $('h1.entry-title').text().trim(),
      thumbnail: $('.thumb img').attr('src'),
      sinopsis,
      info,
      episodes
    });
  } catch (err) {
    return formatResult(false, null, 500, err.message);
  }
};

exports.ongoing = async function() {
  try {
    const res = await axios.get(`${baseUrl}/ongoing-anime`);
    const $ = cheerio.load(res.data);
    const result = [];

    $('.animepost').each((i, el) => {
      result.push({
        title: $(el).find('.animetitle').text().trim(),
        type: $(el).find('.type').text().trim(),
        upload: $(el).find('.bt > span').text().trim(),
        url: $(el).find('a').attr('href'),
        thumb: $(el).find('img').attr('src')
      });
    });

    return formatResult(true, result);
  } catch (err) {
    return formatResult(false, null, 500, err.message);
  }
};

exports.schedule = async function() {
  try {
    const res = await axios.get(`${baseUrl}/jadwal-rilis-anime`);
    const $ = cheerio.load(res.data);
    const result = {};

    $('.boxanime').each((i, el) => {
      const day = $(el).find('h2').text().trim();
      const animes = [];

      $(el).find('.listupd > article').each((j, item) => {
        animes.push({
          title: $(item).find('h2').text().trim(),
          url: $(item).find('a').attr('href'),
          thumb: $(item).find('img').attr('src')
        });
      });

      result[day] = animes;
    });

    return formatResult(true, result);
  } catch (err) {
    return formatResult(false, null, 500, err.message);
  }
};
