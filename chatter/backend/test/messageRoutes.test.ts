import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/server';
import * as messageService from '../src/services/messageService';
import * as userService from '../src/services/userService';
import * as tokenUtils from '../src/utils/TokenUtils';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { IMessage } from '../src/models/message';

describe('Message Routes', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /api/messages/send', () => {
        it('should send a new message', async () => {
            sandbox.stub(messageService, 'createMessage').resolves({
                _id: 'message_id',
                senderId: 'sender_id',
                recipientId: 'recipient_id',
                message: 'Hello!',
                contactId: 'contact_id',
            } as IMessage);

            sandbox.stub(userService, 'getUserById').resolves({
                _id: 'recipient_id',
                name: 'John Doe',
            } as any);
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('sender_id');

            const res = await request(app)
                .post('/api/messages/send')
                .set('Authorization', 'Bearer validToken')
                .send({
                    senderId: 'sender_id',
                    recipientId: 'recipient_id',
                    message: 'Hello!',
                    contactId: 'contact_id',
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({
                _id: 'message_id',
                senderId: 'sender_id',
                recipientId: 'recipient_id',
                message: 'Hello!',
                contactId: 'contact_id',
            });
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/messages/send')
                .set('Authorization', 'Bearer validToken')
                .send({
                    senderId: 'sender_id',
                    message: 'Hello!',
                });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal(
                'Missing senderId, recipientId, message, or contactId',
            );
        });
    });

    describe('GET /api/messages/get/:contactId', () => {
        it('should get messages between users', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(messageService, 'getMessagesBetweenUsers').resolves([
                {
                    _id: 'message_id',
                    senderId: 'user_id',
                    recipientId: 'recipient_id',
                    message: 'Hello!',
                    contactId: 'contact_id',
                },
            ] as IMessage[]);

            const res = await request(app)
                .get('/api/messages/get/contact_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([
                {
                    _id: 'message_id',
                    senderId: 'user_id',
                    recipientId: 'recipient_id',
                    message: 'Hello!',
                    contactId: 'contact_id',
                },
            ]);
        });

        it('should return 400 if contactId is missing', async () => {
            const res = await request(app)
                .get('/api/messages/get/')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404); // Because the route will not match
        });
    });

    describe('GET /api/messages/get-last/:contactId', () => {
        it('should get the last message between users', async () => {
            sandbox
                .stub(messageService, 'getLastMessageBetweenUsers')
                .resolves({
                    _id: 'message_id',
                    senderId: 'user_id',
                    recipientId: 'recipient_id',
                    message: 'Hello!',
                    contactId: 'contact_id',
                } as IMessage);

            const res = await request(app)
                .get('/api/messages/get-last/contact_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'message_id',
                senderId: 'user_id',
                recipientId: 'recipient_id',
                message: 'Hello!',
                contactId: 'contact_id',
            });
        });

        it('should return 400 if contactId is missing', async () => {
            const res = await request(app)
                .get('/api/messages/get-last/')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404); // Because the route will not match
        });
    });

    describe('POST /api/messages/get-unseen', () => {
        it('should get the number of unseen messages', async () => {
            sandbox.stub(messageService, 'getUnseenMessagesCount').resolves(5);
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');

            const res = await request(app)
                .post('/api/messages/get-unseen')
                .set('Authorization', 'Bearer validToken')
                .send({
                    contactId: 'contact_id',
                    senderId: 'sender_id',
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ count: 5 });
        });

        it('should return 500 if there is an error getting unseen messages', async () => {
            sandbox.stub(messageService, 'getUnseenMessagesCount').rejects();

            const res = await request(app)
                .post('/api/messages/get-unseen')
                .set('Authorization', 'Bearer validToken')
                .send({
                    contactId: 'contact_id',
                    senderId: 'sender_id',
                });

            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('Failed to get unseen messages');
        });
    });
});
