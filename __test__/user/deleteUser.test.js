const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const generateToken = require('../../lib/loginFlow.js')

const token = generateToken()

describe('Delete user test', () => {

    const mockResponse = async (token = '') => {
        const req = request(url)
            .delete(`/users`)
            .set('Accept', 'application/json')

        if (token) {
            req.set('Authorization', `${token}`)
        }

        return req
    }

    it('Delete user account with valid token success', async () => {

        const response = await mockResponse(token.deleteduser)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body).toHaveProperty('status')
        expect(response.body.data).toBe(null)
        expect(response.body.status).toBe('success')

    })

    it('Delete user account failed user is deleted', async () => {

        const response = await mockResponse(token.deleteduser)

        expect(response.statusCode).toBe(401)

    })

    it('Delete user account failed without valid token', async () => {

        const response = await mockResponse()

        expect(response.statusCode).toBe(401)

    })

    it('Delete user account failed with no token', async () => {

        const response = await mockResponse()

        expect(response.statusCode).toBe(401)

    })


})