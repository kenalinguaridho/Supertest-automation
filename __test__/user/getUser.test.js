const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const generateToken = require('../../lib/loginFlow.js')

const token = generateToken()

describe('Get user profile', () => {

    const mockResponse = async (token = '') => {
        const req = request(url)
            .get(`/users/profile`)
            .set('Accept', 'application/json')

        if (token) {
            req.set('Authorization', `${token}`)
        }

        return req
    }

    it('Get user with valid token success', async () => {
        const response = await mockResponse(token.customer1)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body).toHaveProperty('status')
        expect(response.body.data).toEqual({
            name: "User Customer 1",
            username: "customer1",
            image: null
        })

    })

    it('Get user failed with invalid token', async () => {

        const response = await mockResponse('InvalidToken')

        expect(response.statusCode).toBe(401)

    })

    it('Get user failed without valid token', async () => {

        const response = await mockResponse()

        expect(response.statusCode).toBe(401)

    })

})