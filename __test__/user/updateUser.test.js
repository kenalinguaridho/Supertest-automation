const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const generateToken = require('../../lib/loginFlow.js')

const token = generateToken()

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query,
    };
}

describe('Update user test', () => {

    const mockResponse = async (payload, token = '') => {
        const req = request(url)
            .put(`/users/profile`)
            .send(payload)
            .set('Accept', 'application/json')

        if (token) {
            req.set('Authorization', `${token}`)
        }

        return req
    }

    it('Update user data success', async () => {

        const req = mockRequest()

        req.body = {
            name: "Customer 1 - Updated",
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toBe(null)
        expect(response.body.status).toBe('success')

    })

    it('Update user data failed no token', async () => {

        const req = mockRequest()

        req.body = {
            name: "Customer 1 - Updated",
        }

        const response = await mockResponse(req.body)

        expect(response.statusCode).toBe(401)

    })

    it('Update user data failed password or rePassword not provided', async () => {

        const req = mockRequest()

        req.body = {
            name: "Customer 1 - Updated",
            password: "NewPassword"
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.errors).toBe('Password Confirmation Error')
        expect(response.body.details.password).toBe('Both password and rePassword must be provided')

    })

    it('Update user data failed password and rePassword not match', async () => {

        const req = mockRequest()

        req.body = {
            name: "Customer 1 - Updated",
            password: "NewPassword",
            rePassword: "DifferentNewPassword"
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.errors).toBe('Password Confirmation Error')
        expect(response.body.details.password).toBe('Password and rePassword did not match')

    })

    it('Update user failed request body contain empty string', async () => {

        const req = mockRequest()

        req.body = {
            name: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            rePassword: ''
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('Validation error')
        expect(response.body.details).toEqual({
            name: `name can't contain empty string`,
            username: `username can't contain empty string`,
            email: `email can't contain empty string`,
            phone: `phone number can't contain empty string`,
            password: `password can't contain empty string`
        })

    })

    it('Update user failed unique constraint error', async () => {

        const req = mockRequest()

        req.body = {
            username: 'customer2',
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(409)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('unique violation')
        expect(response.body.details).toEqual({
            username: "username is already used"
        })

    })

    it('Update user failed field contain space', async () => {

        const req = mockRequest()

        req.body = {
            username: 'cust omer1',
            email: 'email with space@example.com',
            phone: '0 9 890 7987 97 8'
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('Validation error')
        expect(response.body.details).toEqual({
            username: "username can't contain spaces",
            email: "email can't contain spaces",
            phone: "phone number can't contain spaces"
        })

    })

    it('Update user failed email not valid', async () => {

        const req = mockRequest()

        req.body = {
            username: 'customer1',
            email: 'invalidemail',
            phone: '0898907987978'
        }

        const response = await mockResponse(req.body, token.customer1)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.status).toBe('failed')
        expect(response.body.errors).toBe('Validation error')
        expect(response.body.details).toEqual({
            email: "email field must contain valid email",
        })

    })

})