import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../src/server';
import * as fileService from '../src/services/fileService';
import * as tokenUtils from '../src/utils/TokenUtils';
import * as filesManager from '../src/utils/filesManager';
import { IFile } from '../src/models/file';

describe('File Routes', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('GET /api/files/profile', () => {
        it('should get the profile picture', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(fileService, 'getFileByIdentifier').resolves({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'jpg',
                filePath: '/uploads/profiles/',
            } as IFile);

            const res = await request(app)
                .get('/api/files/profile')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'jpg',
                filePath: '/uploads/profiles/',
            });
        });

        it('should return 404 if profile picture not found', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(fileService, 'getFileByIdentifier')
                .resolves(undefined);

            const res = await request(app)
                .get('/api/files/profile')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('Profile picture not found');
        });
    });

    describe('GET /api/files/:identifier', () => {
        it('should get a file by identifier', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(fileService, 'getFileByIdentifier').resolves({
                _id: 'file_id',
                identifier: 'identifier',
                fileType: 'jpg',
                filePath: '/uploads/files/',
            } as IFile);

            const res = await request(app)
                .get('/api/files/identifier')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                _id: 'file_id',
                identifier: 'identifier',
                fileType: 'jpg',
                filePath: '/uploads/files/',
            });
        });

        it('should return 404 if file not found', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(fileService, 'getFileByIdentifier')
                .resolves(undefined);

            const res = await request(app)
                .get('/api/files/identifier')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('File not found');
        });
    });

    describe('DELETE /api/files/:fileId', () => {
        it('should delete a file by fileId', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(fileService, 'deleteFileByIdentifier')
                .resolves(undefined);
            sandbox.stub(filesManager, 'removeLocalFile').resolves();

            const res = await request(app)
                .delete('/api/files/file_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('File deleted');
        });

        it('should return 404 if file not found', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox
                .stub(fileService, 'deleteFileByIdentifier')
                .resolves(undefined);

            const res = await request(app)
                .delete('/api/files/file_id')
                .set('Authorization', 'Bearer validToken');

            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('File not found');
        });
    });

    describe('POST /api/files/upload-profile', () => {
        it('should upload a profile picture', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(fileService, 'createFile').resolves({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'jpg',
                filePath: '/uploads/profiles/',
            } as IFile);

            const res = await request(app)
                .post('/api/files/upload-profile')
                .set('Authorization', 'Bearer validToken')
                .attach(
                    'file',
                    Buffer.from('dummy file content'),
                    'profile.jpg',
                );

            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'jpg',
                filePath: '/uploads/profiles/',
            });
        });

        it('should return 400 if file type is invalid', async () => {
            const res = await request(app)
                .post('/api/files/upload-profile')
                .set('Authorization', 'Bearer validToken')
                .attach(
                    'file',
                    Buffer.from('dummy file content'),
                    'profile.txt',
                );

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid file type');
        });
    });

    describe('POST /api/files/upload-media', () => {
        it('should upload a media file', async () => {
            sandbox.stub(tokenUtils, 'getUserIdByToken').resolves('user_id');
            sandbox.stub(fileService, 'createFile').resolves({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'mp4',
                filePath: '/uploads/media/',
            } as IFile);

            const res = await request(app)
                .post('/api/files/upload-media')
                .set('Authorization', 'Bearer validToken')
                .attach('file', Buffer.from('dummy file content'), 'media.mp4');

            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({
                _id: 'file_id',
                identifier: 'user_id',
                fileType: 'mp4',
                filePath: '/uploads/media/',
            });
        });

        it('should return 400 if file type is invalid', async () => {
            const res = await request(app)
                .post('/api/files/upload-media')
                .set('Authorization', 'Bearer validToken')
                .attach('file', Buffer.from('dummy file content'), 'media.exe');

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid file type');
        });
    });
});
