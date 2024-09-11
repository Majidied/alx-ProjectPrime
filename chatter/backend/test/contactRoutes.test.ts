import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/server';
import * as userService from '../src/services/userService';
import * as contactService from '../src/services/contactService';
import * as contactRequestUtils from '../src/utils/contactReqeust';
import * as tokenUtils from '../src/utils/TokenUtils';
import { describe, beforeEach, afterEach, it } from 'node:test';
import { IContact } from '../src/models/contact';

describe('Contact Routes', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /api/contacts/send-request', () => {
        it('should send a contact request successfully', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(userService, 'userExists').resolves(true);
            sandbox.stub(contactService, 'contactExists').resolves(false);
            sandbox
                .stub(contactRequestUtils, 'checkContactRequest')
                .resolves(false);
            sandbox.stub(contactRequestUtils, 'setContactRequest').resolves();

            const res = await request(app)
                .post('/api/contacts/send-request')
                .set('Authorization', 'Bearer validToken')
                .send({ recipientId: 'recipient_id' });

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Contact request sent');
        });

        it('should return 400 if recipientId is missing', async () => {
            const res = await request(app)
                .post('/api/contacts/send-request')
                .set('Authorization', 'Bearer validToken')
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Missing recipientId');
        });

        it('should return 404 if user does not exist', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(userService, 'userExists').resolves(false);

            const res = await request(app)
                .post('/api/contacts/send-request')
                .set('Authorization', 'Bearer validToken')
                .send({ recipientId: 'unknown_id' });

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('User not found');
        });
    });

    describe('GET /api/contacts/get-requests', () => {
        it('should get contact requests for user', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(contactRequestUtils, 'getContactRequests')
                .resolves([
                    { senderId: 'sender_id', recipientId: 'user_id' } as any,
                ]);

            const res = await request(app)
                .get('/api/contacts/get-requests')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([
                { senderId: 'sender_id', recipientId: 'user_id' },
            ]);
        });

        it('should return 400 if userId is invalid', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves(null);

            const res = await request(app)
                .get('/api/contacts/get-requests')
                .set('Authorization', 'Bearer invalidToken');

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Invalid user ID');
        });
    });

    describe('POST /api/contacts/create', () => {
        it('should create a contact successfully', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(userService, 'userExists').resolves(true);
            sandbox.stub(contactService, 'contactExists').resolves(false);
            sandbox
                .stub(contactRequestUtils, 'removeContactRequest')
                .resolves();
            sandbox.stub(contactService, 'addContact').resolves({
                _id: 'contact_id',
                userId: 'user_id',
                contactId: 'contact_id',
            } as IContact);

            const res = await request(app)
                .post('/api/contacts/create')
                .set('Authorization', 'Bearer validToken')
                .send({ contactId: 'contact_id' });

            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({
                _id: 'contact_id',
                userId: 'user_id',
                contactId: 'contact_id',
            });
        });

        it('should return 400 if contact already exists', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(contactService, 'contactExists').resolves(true);

            const res = await request(app)
                .post('/api/contacts/create')
                .set('Authorization', 'Bearer validToken')
                .send({ contactId: 'existing_contact_id' });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Contact already exists');
        });
    });

    describe('DELETE /api/contacts/delete/:contactId', () => {
        it('should delete a contact successfully', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(contactService, 'removeContact').resolves();

            const res = await request(app)
                .delete('/api/contacts/delete/contact_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Contact removed');
        });

        it('should return 400 if contactId is missing', async () => {
            const res = await request(app)
                .delete('/api/contacts/delete/')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
        });
    });

    describe('DELETE /api/contacts/decline/:senderId', () => {
        it('should decline a contact request successfully', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(contactRequestUtils, 'removeContactRequest')
                .resolves();

            const res = await request(app)
                .delete('/api/contacts/decline/sender_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Contact request declined');
        });

        it('should return 400 if senderId is missing', async () => {
            const res = await request(app)
                .delete('/api/contacts/decline/')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
        });
    });

    describe('GET /api/contacts/get/:id', () => {
        it('should get a contact by ID', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(contactService, 'getContact').resolves({
                _id: 'contact_id',
                userId: 'user_id',
                contactId: 'contact_id',
            } as IContact);

            const res = await request(app)
                .get('/api/contacts/get/contact_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'contact_id',
                userId: 'user_id',
                contactId: 'contact_id',
            });
        });

        it('should return 400 if contactId is missing', async () => {
            const res = await request(app)
                .get('/api/contacts/get/')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
        });
    });
});
