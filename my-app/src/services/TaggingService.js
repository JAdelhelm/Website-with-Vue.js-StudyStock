const axios = require('axios');

export async function getMedium(id) {
    const response = await axios.get('/api/medium', {
        params: {
            medium_id: id
        }
    });
    return response.data[0];
}

export async function getAllTags(){
    const response = await axios.get('/api/summary/tags', {
    });
    return response.data[0];
}

export async function imageTagging(imagesrc){
    //  HTML Image an das backend bringen
    const response = await axios.post('/api/tensorflow', {
        imagesrc: imagesrc
    });
    return response.data;
}

export async function getPricesOfTags(tags){
    const response = await axios.get('/api/prices/tags', {
        tags: tags
    })
    return response.data;
}

