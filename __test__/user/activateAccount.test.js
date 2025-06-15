const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const mockRequest = require('../../lib/mockRequest.js')

describe('Activate user account', () => {

    const mockResponse = async (req) => {
        return await request(url)
            .get(`/users/verify/${req.params.id}`)
            .set('Accept', 'application/json')
    }

    it('Activate user account success', async () => {

        const req = mockRequest()

        req.params.id = 'c789e0cc-1ec6-4470-b097-c02b19f00469'

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(200)

    })

    it('Activate account failed id not found', async () => {

        const req = mockRequest()

        req.params.id = 'f0797e7c-4d1a-486a-b7be-52cfd89991ff'

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('User verify failed')
        expect(response.body.details).toBe('No user found with id f0797e7c-4d1a-486a-b7be-52cfd89991ff')

    })

    it('Activate user account failed user is already activated', async () => {

        const req = mockRequest()

        req.params.id = 'c06fc5ca-d22d-4f34-9b1d-de8a4468c907'

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('User verify failed')
        expect(response.body.details).toBe('User with id c06fc5ca-d22d-4f34-9b1d-de8a4468c907 is already active')

    })
})