const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query,
    };
}

describe('Reguster User Test', () => {

    const mockResponse = async (req) => {
        return await request(url)
            .post('/users/register')
            .set('Accept', 'application/json')
            .send(req.body)
            .expect('Content-Type', /json/)
    }

    it('Register user success', async () => {

        const req = mockRequest()

        req.body = {
            name: "Test Customer",
            username: "teStcustomer",
            email: "TestCustomer@example.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            data: {
                name: req.body.name,
                username: req.body.username.toLowerCase(),
                email: req.body.email.toLowerCase(),
                phone: req.body.phone,
                isAdmin: false
            },
            status: "success"
        })

    })

    it('Register user failed unique constraint error', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Customer",
            username: "teStcustomer",
            email: "TestCustomer@example.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(409)
        expect(response.body.status).toBe("failed")
        expect(response.body.errors).toBe("unique violation")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')

    })

    it('Register user failed field not contain space', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Customer",
            username: "teStc ustomer",
            email: "TestCust omer@example.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("failed")
        expect(response.body.errors).toBe("Validation error")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            username: "username can't contain spaces",
            email: "email can't contain spaces"
        })

    })

    it('Register user failed email not valid', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Customer",
            username: "teStcustomer",
            email: "TestCustomerexample.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("failed")
        expect(response.body.errors).toBe("Validation error")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            email: "email field must contain valid email"
        })

    })

    it('Register user failed request body contain empty string', async () => {

        const req = mockRequest()

        req.body = {
            name: "",
            username: "",
            email: "TestCustomer@example.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('Validation error')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            name: "name can't contain empty string",
            username: "username can't contain empty string"
        })

    })

    it('Register user failed request body not complete', async () => {

        const req = mockRequest()

        req.body = {
            email: "TestCustomer@example.com",
            phone: "089891691782",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('notNull Violation')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            name: "name should be in request body",
            username: "username should be in request body"
        })

    })

    it('Register user failed password and rePassword', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Customer",
            username: "teStcustomer",
            email: "TestCustomer@example.com",
            phone: "089891691782",
            password: "kakik",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({
            status: "failed",
            errors: "Password Confirmation Error",
            details: {
                password: "password and rePassword did not match"
            }
        })

    })
})

describe('Register Admin Test', () => {

    const mockResponse = async (req) => {
        return await request(url)
            .post('/users/admin/register')
            .set('Accept', 'application/json')
            .send(req.body)
            .expect('Content-Type', /json/)
    }

    it('Register admin success', async () => {

        const req = mockRequest()

        req.body = {
            name: "Test Admin",
            username: "TestAdmin",
            email: "teStaDMin@example.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            data: {
                name: req.body.name,
                username: req.body.username.toLowerCase(),
                email: req.body.email.toLowerCase(),
                phone: req.body.phone,
                isAdmin: true
            },
            status: "success"
        })

    })

    it('Register admin failed constraint error', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Admin",
            username: "TestAdmin",
            email: "teStaDMin@example.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(409)
        expect(response.body.status).toEqual("failed")
        expect(response.body.errors).toEqual("unique violation")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')

    })

    it('Register admin failed field not contain space', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Admin",
            username: "Test Admin",
            email: "teStaDM in@example.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("failed")
        expect(response.body.errors).toBe("Validation error")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            username: "username can't contain spaces",
            email: "email can't contain spaces"
        })

    })

    it('Register user failed email not valid', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Admin",
            username: "TestAdmin",
            email: "teStaDMinexample.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe("failed")
        expect(response.body.errors).toBe("Validation error")
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            email: "email field must contain valid email"
        })

    })

    it('Register admin failed request body contain empty string', async () => {

        const req = mockRequest()

        req.body = {
            name: "",
            username: "",
            email: "teStaDMin@example.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('Validation error')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            name: "name can't contain empty string",
            username: "username can't contain empty string"
        })

    })

    it('Register admin failed request body not complete', async () => {

        const req = mockRequest()

        req.body = {
            email: "teStaDMin@example.com",
            phone: "089891897993",
            password: "kakiku",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('notNull Violation')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toEqual({
            name: "name should be in request body",
            username: "username should be in request body"
        })

    })

    it('Register admin failed password and rePassword', async () => {
        const req = mockRequest()

        req.body = {
            name: "Test Admin",
            username: "TestAdmin",
            email: "teStaDMin@example.com",
            phone: "089891897993",
            password: "kakik",
            rePassword: "kakiku"
        }

        const response = await mockResponse(req)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({
            status: "failed",
            errors: "Password Confirmation Error",
            details: {
                password: "password and rePassword did not match"
            }
        })

    })
})