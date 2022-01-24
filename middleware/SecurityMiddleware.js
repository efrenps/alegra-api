
import SecurityController from '../controllers/SecurityController.js';
import { GRAPHQL_OPERATION } from '../utilities/Enums.js';

const BEARER = 'Bearer ';

const getToken = header => (header || '').replace(BEARER, '');

function badResponse(res, message) {
    res.status(401).json({
        data: {
            login: null,
        },
        errors: [
            {
                message,
            },
        ],
    });
}
function goodResponse(res, login) {
    res.status(200).json({
        data: {
            login,
        },
    });
}

export async function handleLogin(req, res) {
    const input = req.body;
    if (input.username && input.password) {
        try {
            const login = await SecurityController.getOauthUsertoken(input.username, input.password);
            return goodResponse(res, login);
        } catch (error) {
            return badResponse(res, error.message);
        }
    } else {
        return badResponse(res, 'Invalid request');
    }
}
export async function handleCheck(req, res) {
    return res.sendStatus(200);
}

export const authMiddleWare = async (resolve, root, args, context, info) => {
    if (info.operation.operation === GRAPHQL_OPERATION.SUBSCRIPTION) {
        // Its already authenticated
        return resolve(root, args, context, info);
    }

    const response = await SecurityController.verifyOauthToken(context.token);
    if(response && response.allowed) {
        return resolve(root, args, response, info);
    }
    return new Error('UNAUTHENTICATED');
};

export const getSecurityContext = async (token, operation) => {
    return SecurityController.verifyOauthToken(token);
};

export const websocketContext = async (params) => {
    const token = getToken(params.authorization);
    try {
        return getSecurityContext(token, REALTIME);
    } catch (err) {
        new Error('UNAUTHENTICATED');
    }
};

export const getRequestContext = async (req) => {
    const token = getToken(req.headers.authorization);
    return { token, useOauth: true };
};