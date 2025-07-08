/*
* Base: https://powerbrainai.com/
* Author: Shannz
* Note: chat eyay dari powerbrain
*/

const axios = require('axios');
const qs = require('qs');

async function powerbrain(question) {
    const data = qs.stringify({
        'message': question,
        'messageCount': '1'
    });

    const config = {
        method: 'POST',
        url: 'https://powerbrainai.com/chat.php',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept-language': 'id-ID',
            'referer': 'https://powerbrainai.com/chat.html',
            'origin': 'https://powerbrainai.com',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'priority': 'u=0',
            'te': 'trailers'
        },
        data: data
    };
    const api = await axios.request(config);
    return api.data;
}

//contoh 
//powerbrain("halo kamu siapa?");

module.exports = { powerbrain };
