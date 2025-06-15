const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const mockRequest = require('../../lib/mockRequest')

describe('Login user test', () => {

    const mockResponse = async (req) => {
        return await request(url)
            .post('/users/login')
            .set('Accept', 'application/json')
            .send(req.body)
            .expect('Content-Type', /json/)
    }

    it('Login user by email success', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customer1@example.com",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('authToken')

    })

    it('Login user by username success', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customer1",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('authToken')

    })

    it('Login user by phone success', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "0898918979183",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('authToken')

    })

    it('Login failed user by email not exist', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "nonexistscustomer@example.com",
            password: "wrongpassword"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

    it('Login failed user by phone not exist', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "0",
            password: "wrongpassword"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

    it('Login failed user by username not exist', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "nonexistscustomer",
            password: "wrongpassword"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

    it('Login failed user account by email not active', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customernotverified@example.com",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User is not verified')

    })

    it('Login failed user account by phone not active', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "0898918976652",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User is not verified')

    })

    it('Login failed user account by username not active', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customernotverified",
            password: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User is not verified')

    })

    it('Login failed user found by email and wrong password', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customer1@example.com",
            password: "kakik"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

    it('Login failed user found by username and wrong password', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "customer1",
            password: "kakik"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

    it('Login failed user found by phone and wrong password', async () => {

        const req = mockRequest()

        req.body = {
            userLogin: "0898918979183",
            password: "kakik"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(404)
        expect(response.body.errors).toBe('Login failed')
        expect(response.body.details).toBe('User not found')

    })

})