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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.authUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield user_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = yield user_1.default.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
exports.authUser = authUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const user = yield user_1.default.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.getUserProfile = getUserProfile;
