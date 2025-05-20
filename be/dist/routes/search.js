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
const express_1 = __importDefault(require("express"));
const search_1 = require("../services/search");
const searchAuth_1 = require("../middleware/searchAuth");
const router = express_1.default.Router();
const searchService = new search_1.SearchService();
// Route for semantic search
router.get('/semantic', searchAuth_1.authenticateSearchToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { query, type } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!query) {
            res.status(400).json({ error: 'Query is required' });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const results = yield searchService.semanticSearch(query, userId, type);
        res.json(results);
    }
    catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ error: 'Search failed' });
    }
}));
// Route for generating answers
router.get('/ask', searchAuth_1.authenticateSearchToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { query } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!query) {
            res.status(400).json({ error: 'Query is required' });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const answer = yield searchService.generateAnswer(query, userId);
        res.json({ answer });
    }
    catch (error) {
        console.error('Answer generation failed:', error);
        res.status(500).json({ error: 'Answer generation failed' });
    }
}));
exports.default = router;
