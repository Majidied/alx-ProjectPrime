import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/server';
import * as userService from '../src/services/userService';
import { getUserStatus } from '../src/utils/userStatus';
import { afterEach, beforeEach, describe, it } from 'node:test';

describe('User Routes', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /api/users/search', () => {
        it('should return user details when username is found', async () => {
            const mockUser = {
                _id: 'user_id',
                name: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@example.com',
            };

            sandbox
                .stub(userService, 'getUserByUsername')
                .resolves(mockUser as any);

            const res = await request(app)
                .post('/api/users/search')
                .send({ username: 'johndoe' });

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'user_id',
                name: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@example.com',
            });
        });

        it('should return 404 if username is not found', async () => {
            sandbox.stub(userService, 'getUserByUsername').resolves(null);

            const res = await request(app)
                .post('/api/users/search')
                .send({ username: 'unknown' });

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('User not found');
        });

        it('should return 400 if username is missing', async () => {
            const res = await request(app).post('/api/users/search').send({});

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Missing username');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user details when user is found', async () => {
            const mockUser = {
                _id: 'user_id',
                name: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@example.com',
            };

            sandbox.stub(userService, 'getUserById').resolves(mockUser as any);

            const res = await request(app).get('/api/users/user_id');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'user_id',
                name: 'John Doe',
                username: 'johndoe',
                email: 'johndoe@example.com',
            });
        });

        it('should return 404 if user is not found', async () => {
            sandbox.stub(userService, 'getUserById').resolves(null);

            const res = await request(app).get('/api/users/unknown_id');

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('User not found');
        });

        it('should return 400 if user ID is missing', async () => {
            const res = await request(app).get('/api/users/');

            expect(res.status).to.equal(404);
        });
    });

    describe('GET /api/users/user-status/:id', () => {
        it('should return user status when user ID is valid', async () => {
            sandbox.stub(getUserStatus as any, 'getUserStatus').resolves(true);

            const res = await request(app).get(
                '/api/users/user-status/user_id',
            );

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ isOnline: true });
        });

        it('should return 404 if user ID is not found', async () => {
            sandbox.stub(getUserStatus as any, 'getUserStatus').resolves(false);

            const res = await request(app).get(
                '/api/users/user-status/unknown_id',
            );

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ isOnline: false });
        });

        it('should return 400 if user ID is missing', async () => {
            const res = await request(app).get('/api/users/user-status/');

            expect(res.status).to.equal(404);
        });
    });
});
