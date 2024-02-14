import axios from 'axios';

export async function getServiceHistory(username) {
    const response = await axios.get('/api/services', {
        params: {
            username: username
        }
    });
    return response.data;
}

export async function getServices(query, type, sortBy) {
    const response = await axios.get('/api/searchservices', {
        params: {
            query: query,
            type: type,
            sortBy: sortBy
        }
    });
    return response.data;
}

export async function getService(id) {
    const response = await axios.get('/api/service', {
        params: {
            id: id
        }
    });
    return response.data[0];
}

export async function updateService(id, name, description, kategorie, tags, pfad) {
    const response = await axios.put('/api/service/update', {
        params: {
            id: id,
            name: name,
            description: description,
            kategorie: kategorie,
            tags: tags,
            pfad: pfad,
        }
    });
    return response.data;
}

export async function deleteService(id) {
    const response = await axios.delete('/api/service', {
        params: {
            id: id
        }
    });
    return response.data;
}

export async function publishService(username, name, description, category, tags, path) {
    return axios.post("/api/service", {
        params: {
            username: username,
            name: name,
            category: category,
            tags: tags,
            description: description,
            path: path
        }
    }).then(response => response.data);
}