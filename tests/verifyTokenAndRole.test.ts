import * as express from 'express';
import {NextFunction, Request, Response} from 'express';

const app: express.Express = express();

import * as httpMocks from 'node-mocks-http';
import axios from 'axios';

import { verifyTokenAndRole } from '../src';

describe('verifyTokenAndRole middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks();
    });

    test('without token in header', async () => {
        mockRequest = httpMocks.createRequest();
        mockResponse = httpMocks.createResponse();
        const spy = jest.spyOn(mockResponse, 'send');
        const expectedResponse = "Missing Token!";
        await verifyTokenAndRole('my-role')(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(spy).toBeCalledWith(expectedResponse);
    });

    test('with invalid token in header', async () => {
        mockRequest = httpMocks.createRequest({
            headers: {
                'x-auth-token': '123'
            }
        });
        mockResponse = httpMocks.createResponse();
        const spy = jest.spyOn(mockResponse, 'send');
        const expectedResponse = "Invalid Token!";
        await verifyTokenAndRole('my-role')(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(spy).toBeCalledWith(expectedResponse);
    });

    test('with valid token in header and missing role', async () => {
        const testUserAxiosConfig = {
            method: 'POST',
            url: 'https://auth-api-go.shultzlab.com/login',
            data: {
                "username": "test6",
                "password": "123"
            }
        }

        const results = await axios(testUserAxiosConfig);
        const {token} = results.data;

        mockRequest = httpMocks.createRequest({
            headers: {
                'x-auth-token': token
            }
        });
        mockResponse = httpMocks.createResponse();
        const spy = jest.spyOn(mockResponse, 'send');
        const expectedResponse = "Missing Access!";
        await verifyTokenAndRole('my-role')(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(spy).toBeCalledWith(expectedResponse);
    });

    test('with valid token in header and has role', async () => {
        const testUserAxiosConfig = {
            method: 'POST',
            url: 'https://auth-api-go.shultzlab.com/login',
            data: {
                "username": "test6",
                "password": "123"
            }
        }

        const results = await axios(testUserAxiosConfig);
        const {token} = results.data;

        mockRequest = httpMocks.createRequest({
            headers: {
                'x-auth-token': token
            }
        });
        mockResponse = httpMocks.createResponse();
        await verifyTokenAndRole('my-valid-role')(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

});

