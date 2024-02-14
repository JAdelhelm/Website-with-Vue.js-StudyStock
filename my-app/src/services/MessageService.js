const axios = require('axios');

export async function getMessages(receiverid, senderid) {
    const response = await axios.get('/api/message', {
        params: {
            receiverid: receiverid,
            senderid: senderid
        }
    });
    return response.data;
}

export async function getUnreadMessages(userid) {
    const response = await axios.get('/api/unreadmessages', {
        params: {
            userid: userid,
        }
    });
    return response.data[0].ungelesen;
}

export async function readMessages(receiverid, senderid) {
    const response = await axios.put('/api/message', {
        params: {
            receiverid: receiverid,
            senderid: senderid
        }
    });
    return response.data;
}