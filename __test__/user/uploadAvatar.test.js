const request = require('supertest')
require('dotenv').config()
const url = process.env.BASE_URL
const generateToken = require('../../lib/loginFlow.js')

const token = generateToken()

describe('Uplaod user avatar', () => {

    it('User success upload avatar should return 200', async () => {
        const response = await request(url)
            .post('/users/avatar')
            .attach('avatar', 'uploads/Screenshot(6).png')
            .set('Accept', 'application/json')
            .set('Authorization', `${token.customer1}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe(null)
        expect(response.body).toHaveProperty('status')
        expect(response.body.status).toBe('success')

    }, 20000)

    it('User upload multiple image should return 400', async () => {
        const response = await request(url)
            .post('/users/avatar')
            .attach('avatar', 'uploads/Screenshot(6).png')
            .attach('avatar', 'uploads/Screenshot(7).png')
            .set('Accept', 'application/json')
            .set('Authorization', `${token.customer1}`)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('MulterError')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toBe('LIMIT_UNEXPECTED_FILE')

    }, 20000)

    it('User non image file return 400', async () => {
        const response = await request(url)
            .post('/users/avatar')
            .attach('avatar', 'uploads/File.txt')
            .set('Accept', 'application/json')
            .set('Authorization', `${token.customer1}`)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('status')
        expect(response.body.status).toBe('failed')
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe('MulterError')
        expect(response.body).toHaveProperty('details')
        expect(response.body.details).toBe('INVALID_FILE_TYPE')

    }, 20000)

})