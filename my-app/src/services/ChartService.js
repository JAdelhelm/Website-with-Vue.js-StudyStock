const axios = require('axios');

export async function getDownloadChart(user_id) {
    const response = await axios.get('/api/downloadchart', {
        params: {
            userid: user_id
        }
    });
    return response.data;
}

export async function getDownloadedOffers(user_id) {
    const response = await axios.get('/api/downloadOffers', {
        params: {
            userid: user_id
        }
    });
    return response.data;
}

export async function getDownloadedMedium(item_id) {
    const response = await axios.get('/api/downloadMedium', {
        params: {
            itemid: item_id
        }
    });
    return response.data;
}


