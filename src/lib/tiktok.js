const axios = require('axios');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

async function tiktok(url) {
    const jar = new CookieJar();

    const api = axios.create({
        jar: jar,
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
        }
    });
    wrapper(api);

    try {
        const htmlResponse = await api.get(url);
        const html = htmlResponse.data;

        const $ = cheerio.load(html);
        const scriptContent = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        if (!scriptContent) throw new Error('Script tag not found.');
        const jsonData = JSON.parse(scriptContent);
        const itemStruct = jsonData?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct;
        if (!itemStruct) throw new Error('Video data not found.');

        const videoUrl = itemStruct.video?.downloadAddr || itemStruct.video?.playAddr;

        return {
            result: {
                id: itemStruct.id,
                description: itemStruct.desc,
                author: {
                    username: itemStruct.author?.uniqueId,
                    nickname: itemStruct.author?.nickname,
                    avatar: itemStruct.author?.avatarThumb
                },
                stats: {
                    likes: itemStruct.stats?.diggCount,
                    shares: itemStruct.stats?.shareCount,
                    comments: itemStruct.stats?.commentCount,
                    views: itemStruct.stats?.playCount
                },
                music: {
                    title: itemStruct.music?.title,
                    author: itemStruct.music?.authorName,
                    url: itemStruct.music?.playUrl
                },
                video: {
                    url: videoUrl,
                    cover: itemStruct.video?.cover,
                    duration: itemStruct.video?.duration,
                    width: itemStruct.video?.width,
                    height: itemStruct.video?.height
                }
            }
        };

    } catch (err) {
        throw err;
    }
}

module.exports = { tiktok };
