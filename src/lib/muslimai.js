/*
* Base: https://www.muslimai.io/
* Author: Shannz
* Note: "Barangsiapa menunjukkan kepada kebaikan, maka ia mendapatkan pahala seperti pahala orang yang mengerjakannya" (HR. Muslim). 
*/

const axios = require('axios');

async function muslimai(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';
    const searchData = {
        query: query
    };
    const headers = {
        'Content-Type': 'application/json'
    };
    try {
        const searchResponse = await axios.post(searchUrl, searchData, { headers: headers });

        const passages = searchResponse.data.map(item => item.content).join('\n\n');

        const answerUrl = 'https://www.muslimai.io/api/answer';
        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer: ${query}\n\n${passages}`
        };

        const answerResponse = await axios.post(answerUrl, answerData, { headers: headers });

        const result = {
            answer: answerResponse.data,
            source: searchResponse.data
        };

        return result;
    } catch (error) {
        return error
        console.error('Error occurred:', error.response ? error.response.data : error.message);
    }
}

//Contoh Penggunaan 
//muslimai("apa itu Al-Qur'an?")

module.exports = { muslimai };
