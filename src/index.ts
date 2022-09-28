import {Request, Response, NextFunction} from 'express';
import axios from "axios";

const authUrl = 'https://auth-api-go.shultzlab.com';

const getTokenFromHeader = (req: Request, res: Response) => {
    const token = req.get('x-auth-token');

    if (!token) {
        return res.status(401).send('Missing Token!');
    }

    return token;
}

const verifyTokenCall = async (token: string) => {
    const config = {
        method: 'GET',
        url: authUrl + "/verify",
        headers: {
            'x-auth-token': token
        }
    }

    try {
        const results = await axios(config);
        if (results.status === 200 && results.data.message === 'success') {
            return 200;
        } else {
            return 403;
        }
    } catch (e: any) {
        return 403;
    }
}

const verifyRole = async (token: string, role: string) => {
    const config = {
        method: 'GET',
        url: `${authUrl}/roles/${role}`,
        headers: {
            'x-auth-token': token
        }
    }

    try {
        const results = await axios(config);
        if(results.status === 200 && results.data.hasRoleAlready){
            return 200;
        }else{
            return 403;
        }
    } catch (e: any) {
        return 401;
    }
}

// Verify Token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req, res);
    const tokenCode = await verifyTokenCall(token.toString());
    if(tokenCode === 403){
        return res.status(403).send('Invalid Token!');
    }
    next();
}

// Verify Token and Role
export const verifyTokenAndRole = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    // Get token
    const token = getTokenFromHeader(req, res);

    // Check token
    const tokenCode = await verifyTokenCall(token.toString());
    if(tokenCode === 403){
        return res.status(403).send('Invalid Token!');
    }

    // Check role
    const roleCode = await verifyRole(token.toString(), role);
    if(roleCode === 401){
        return res.status(401).send('Invalid Token!');
    }else if(roleCode === 403){
        return res.status(403).send('Missing Access!');
    }

    next();
}