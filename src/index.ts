import {Express, Request, Response, NextFunction} from 'express';
import axios from "axios";

const authUrl = 'https://auth-api-go.shultzlab.com/verify';

// Verify Token
export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<Promise<Response> | Promise<void>> {
    const header = req.get('x-auth-token');

    if (!header) {
        return res.status(401).send('Missing Token!');
    }

    const config = {
        method: 'GET',
        url: authUrl,
        headers: {
            'x-auth-token': header
        }
    }

    try {
        const results = await axios(config);
        if (results.status === 200 && results.data.message === 'success') {
            next();
        } else {
            return res.status(403).send('Invalid Token!');
        }
    } catch (e: any) {
        return res.status(403).send('Invalid Token!');
    }
}