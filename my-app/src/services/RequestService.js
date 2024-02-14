const axios = require('axios');

export async function checkRequestStatus(userid, offerid) {
    const response = await axios.get('/api/request', {
        params: {
            userid: userid,
            offerid: offerid
        }
    });
    return response.data;
}

export async function getRequests(username) {
    const response = await axios.get('/api/requests', {
        params: {
            username: username
        }
    });
    return response.data;
}

export async function acceptRequest(userid, angebotid) {
    const response = await axios.put('/api/request', {
        params: {
            userid: userid,
            angebotid: angebotid
        }
    });
    return response.data;
}

export async function declineRequest(userid, angebotid) {
    const response = await axios.delete('/api/request', {
        params: {
            userid: userid,
            angebotid: angebotid
        }
    });
    return response.data;
}