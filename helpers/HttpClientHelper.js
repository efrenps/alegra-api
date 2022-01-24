import axios from 'axios';
import { jsonToURLEncoded } from './jsonToURLEncoded.js';


export default class HttpClientHelper {
    constructor(baseUrl = '', contentType = 'application/x-www-form-urlencoded') {
        this.baseUrl = baseUrl;
        this.contentType = contentType;
        this.errorMessage = 'There was an error trying to call the web service';

        axios.defaults.headers.post['Content-Type'] = contentType;
    }

    GET(url, config) {
        return new Promise((resolve, reject) => {
            axios.get(`${this.baseUrl}${url}`, config)
                .then((response) => {
                    resolve(response);
                })
                .catch((e) => {
                    console.log(e);
                    reject(this.errorMessage);
                });
        });
    }

    POST(url, data, config = {}) {
        const contentTypeForRequest = config.headers && config.headers['Content-Type'] ? config.headers['Content-Type'] : this.contentType;
        const body = contentTypeForRequest === 'application/x-www-form-urlencoded' ? jsonToURLEncoded(data) : data;
        return new Promise((resolve, reject) => {
            axios.post(`${this.baseUrl}${url}`, body, config)
                .then((response) => {
                    resolve(response);
                })
                .catch((e) => {
                    if (e.response && e.response.data && Array.isArray(e.response.data) && e.response.data.length > 0) {
                        const errors = e.response.data.map(err => err.description);
                        reject(errors.join('\n'));
                    }
                    reject(this.errorMessage);
                });
        });
    }
}
