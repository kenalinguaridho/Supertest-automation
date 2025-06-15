const request = require('supertest')
const generateToken = require('../../lib/loginFlow.js')
require('dotenv').config()
const url = process.env.BASE_URL

const token = generateToken()
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('Get all product test', () => {

    const mockResponse = async (page, token = '') => {
        let endpoint = '/products'
        if (page && page > 1) {
            endpoint += `?page=${page}`
        }
        const req = request(url)
            .get(endpoint)
            .set('Accept', 'application/json')

        if (token) {
            req.set('Authorization', `${token}`)
        }

        return req
    }

    it('Get all products without token success', async () => {

        const response = await mockResponse()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body).toHaveProperty('status')
        expect(Array.isArray(response.body.data)).toBe(true)
        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('image');

            // Optional: Pastikan tipe datanya sesuai
            expect(typeof item.id).toBe('string');
            expect(item.id).toMatch(uuidRegex);
            expect(typeof item.name).toBe('string');
            expect(typeof item.price).toBe('number');
            expect(typeof item.image).toBe('string');
        });

    })

    it('Get all products data by pagination success', async () => {

        const page = 1
        const response = await mockResponse(page)
        console.log("Response Header ==>", response.headers);
        

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body).toHaveProperty('status')
        expect(Array.isArray(response.body.data)).toBe(true)
        response.body.data.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('image');

            expect(typeof item.id).toBe('string');
            expect(item.id).toMatch(uuidRegex);
            expect(typeof item.name).toBe('string');
            expect(typeof item.price).toBe('number');
            expect(typeof item.image).toBe('string');
        });
    })

    it('Get all products with pagination out of product count success with empty data array', async () => {
        const page = 5
        const response = await mockResponse(page)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body).toHaveProperty('status')
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBe(0)
        
    })

})