const axios = require('axios');

export async function getAngebote(searchInput, sortBy, price, type) {
    const response = await axios.get('/api/angebote', {
        params: {
            query: searchInput,
            sortBy: sortBy,
            price: price,
            type: type
        }
    });
    return response.data;
}

export async function getAngebot(id) {
    const response = await axios.get('/api/angebot', {
        params: {
            id: id
        }
    });
    return response.data[0];
}

export async function getDownloadHistory(id) {
    const response = await axios.get('/api/downloads', {
        params: {
            userid: id
        }
    });
    return response.data;
}

export async function getUploadHistory(id) {
    const response = await axios.get('/api/inventory', {
        params: {
            userid: id
        }
    });
    return response.data;
}

export async function getOfferHistory(id) {
    const response = await axios.get('/api/offers', {
        params: {
            userid: id
        }
    });
    return response.data;
}

export async function acceptOffer(id) {
    const response = await axios.put('/api/offer/accept', {
        params: {
            angebotid: id
        }
    });
    return response.data;
}

export async function declineOffer(id) {
    const response = await axios.delete('/api/offer/decline', {
        params: {
            angebotid: id
        }
    });
    return response.data;
}

export async function deleteOffer(id) {
    const response = await axios.delete('/api/offer', {
        params: {
            angebotid: id
        }
    });
    return response.data;
}

export async function lockOffer(id) {
    const response = await axios.put('/api/offer/lock', {
        params: {
            angebotid: id
        }
    });
    return response.data;
}


export async function download(itemid, quality) {
    const response = await axios.get('/api/download', {
        responseType: 'blob',
        params: {
            itemid: itemid,
            quality: quality
        }
    });
    return response;
}

export async function downloadAngebot(userid, itemid) {
    const response = await axios.post('/api/file/download', {
        responseType: 'blob',
        params: {
            userid: userid,
            itemid: itemid
        }
    });
    return response;
}

// getUser für das Profil ändern
export async function getUser(userid) {
    const response = await axios.get("/api/profil", {
        params: {
            userid: userid,
        }
    });
    return response.data[0];
}

// getBenutzer, um Benutzer anzuzeigen
export async function getBenutzer(userid) {
    const response = await axios.get("/api/user", {
        params: {
            userid: userid,
        }
    });
    return response.data[0];
}

export function submitFile(username, userid, upload) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("userid", userid);
    formData.append("file", upload);

    const headers = {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        "Accept": "*/*",
    };
    return axios.post("/api/file/upload", formData, {
        headers
    }).then(response => response.data);
}

export async function publishFile(itemid, username, name, description, category, tags, price, license) {
    axios.post("/api/offer/create", {
        params: {
            itemid: itemid,
            username: username,
            price: price,
            license: license,
            name: name,
            category: category,
            tags: tags,
            description: description
        }
    }).then((res) => {
        res.data.files; // binary representation of the file
        res.status; // HTTP status
    });
}

export async function getPendingOffers(id) {
    const response = await axios.get('/api/pendingoffers', {
        params: {
            angebotid: id
        }
    });
    return response.data;
}

export async function deleteMedium(id) {
    const response = await axios.delete('/api/medium', {
        params: {
            id: id
        }
    });
    return response.data;
}