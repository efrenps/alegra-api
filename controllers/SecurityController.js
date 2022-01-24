
import dotenv from 'dotenv';
import HttpClientHelper from '../helpers/HttpClientHelper.js';
import AlegraConnection from '../config/AlegraConnection.js';

dotenv.config();
const {
    OAUTH_SERVER,
    OAUTH_ID,
    OAUTH_SECRET,
} = process.env;

export default class SecurityController {
    static async getOauthUsertoken(username, password) {
        const token = Buffer.from(`${OAUTH_ID}:${OAUTH_SECRET}`, 'utf8').toString('base64');
        const headers = { headers: { Authorization: `Basic ${token}` }};

        const http = new HttpClientHelper(OAUTH_SERVER);
        const params = {
            grant_type: 'password',
            username,
            password,
        };
        return http.POST('/oauth/token', params, headers).then(response => response.data).catch((err) => {
            return err;
        });
    }

    static async verifyOauthToken(token) {
        const headers = { headers: { Authorization: `Bearer ${token}` }};

        const http = new HttpClientHelper(OAUTH_SERVER);
        return http.POST('/oauth/token-can', {}, headers).then((response) => {
            return {
                connection: AlegraConnection,
                allowed: true,
                currentUser: {
                    id: response.data.userId,
                    name: response.data.userName,
                    scope: response.data.scope,
                },
                token,
            };
        }).catch((err) => {
            return err;
        });
    }
}