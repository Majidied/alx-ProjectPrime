"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdentifier = void 0;
const TokenUtils_1 = require("./TokenUtils");
const getIdentifier = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const messageId = req.headers["x-message-id"];
    if (messageId) {
        return messageId;
    }
    const userId = yield (0, TokenUtils_1.getUserIdByToken)((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (userId) {
        return userId;
    }
});
exports.getIdentifier = getIdentifier;
