import axios from 'axios';

const getReponse = response => ({
	status: response.status,
	headers: response.headers,
	data: response.data
});

const makeRequest = async options => {
	return await axios(options)
		.then(getReponse)
		.catch(err => getReponse(err.response));
};

export default class Http {
	static get(url, headers = {}) {
		return makeRequest({ method: 'GET', url, headers });
	}

	static post(url, headers = {}, data = {}) {
		return makeRequest({ method: 'POST', url, headers, data });
	}

	static put(url, headers = {}, data = {}) {
		return makeRequest({ method: 'PUT', url, headers, data });
	}

	static delete(url, headers = {}) {
		return makeRequest({ method: 'DELETE', url, headers });
	}
}
