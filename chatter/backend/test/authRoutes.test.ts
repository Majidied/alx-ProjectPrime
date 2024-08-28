import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../src/server';
import User from '../src/models/user';
import * as TokenUtils from '../src/utils/TokenUtils';
import { after, afterEach, before, describe, it } from 'node:test';

describe('Auth Routes', () => {
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            sandbox.stub(User, 'findOne').resolves(null); // Mock User.findOne
            sandbox.stub(User.prototype, 'save').resolves(); // Mock User.save
            sandbox
                .stub(TokenUtils, 'generateVerificationToken')
                .resolves('token');
            sandbox.stub(TokenUtils, 'sendVerificationEmail').resolves();

            const res = await request(app).post('/api/users/register').send({
                name: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@example.com',
                password: 'password123',
            });

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal(
                'User registered successfully, Please verify your email to confirm registration',
            );
        });

        it('should not register a user if email exists', async () => {
            sandbox
                .stub(User, 'findOne')
                .resolves({ email: 'existing@example.com' } as any); // Mock existing email

            const res = await request(app).post('/api/users/register').send({
                name: 'John Doe',
                username: 'johndoe',
                email: 'existing@example.com',
                password: 'password123',
            });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('User already exists');
        });

        describe('POST /api/users/login', () => {
            it('should log in a user with valid credentials', async () => {
                const mockUser = {
                    _id: 'user_id',
                    email: 'johndoe@example.com',
                    password: 'hashedPassword',
                    matchPassword: sinon.stub().resolves(true),
                };

                sandbox.stub(User, 'findOne').resolves(mockUser as any);
                sandbox.stub(TokenUtils, 'generateToken').returns('authToken');

                const res = await request(app).post('/api/users/login').send({
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal(
                    'User logged in successfully',
                );
                expect(res.body.token).to.equal('authToken');
            });

            it('should not log in a user with invalid credentials', async () => {
                sandbox.stub(User, 'findOne').resolves(null);

                const res = await request(app).post('/api/users/login').send({
                    email: 'johndoe@example.com',
                    password: 'wrongPassword',
                });

                expect(res.status).to.equal(401);
                expect(res.body.error).to.equal('Invalid email or password');
            });
        });

        describe('GET /api/users/profile', () => {
            it('should retrieve user profile for a valid token', async () => {
                sandbox
                    .stub(TokenUtils, 'getUserIdByToken')
                    .resolves('user_id');
                sandbox.stub(User, 'findById').resolves({
                    _id: 'user_id',
                    name: 'John Doe',
                    username: 'johndoe',
                    email: 'johndoe@example.com',
                } as any);

                const res = await request(app)
                    .get('/api/users/profile')
                    .set('Authorization', 'Bearer validToken');

                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('name', 'John Doe');
            });

            it('should return 401 if token is invalid', async () => {
                sandbox.stub(TokenUtils, 'getUserIdByToken').resolves(null);

                const res = await request(app)
                    .get('/api/users/profile')
                    .set('Authorization', 'Bearer invalidToken');

                expect(res.status).to.equal(401);
                expect(res.body.error).to.equal('Unauthorized');
            });
        });
    });
});
