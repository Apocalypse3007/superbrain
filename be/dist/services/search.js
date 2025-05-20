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
exports.SearchService = void 0;
const db_1 = require("../db");
const gemini_1 = require("./gemini");
class SearchService {
    constructor() {
        this.geminiService = new gemini_1.GeminiService();
    }
    semanticSearch(query, userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate embedding for the search query
                const queryEmbedding = yield this.geminiService.generateEmbedding(query);
                // Build MongoDB query
                const mongoQuery = {
                    userId,
                    hasEmbedding: true
                };
                if (type) {
                    mongoQuery.type = type;
                }
                // Fetch all relevant documents
                const contents = yield db_1.Contentmodel.find(mongoQuery).lean();
                // Calculate similarity scores
                const scoredContents = yield Promise.all(contents.map((content) => __awaiter(this, void 0, void 0, function* () {
                    const similarity = yield this.geminiService.searchSimilarContent(query, content.embedding);
                    return Object.assign(Object.assign({}, content), { similarity });
                })));
                // Sort by similarity score and return top results
                return scoredContents
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 5); // Return top 5 results
            }
            catch (error) {
                console.error('Semantic search failed:', error);
                throw error;
            }
        });
    }
    generateAnswer(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, get relevant content
                const relevantDocs = yield this.semanticSearch(query, userId);
                // Combine relevant content into context
                const context = relevantDocs
                    .map(doc => `${doc.title}\n${doc.extractedContent}`)
                    .join('\n\n');
                // Generate response using Gemini
                return yield this.geminiService.generateResponse(query, context);
            }
            catch (error) {
                console.error('Answer generation failed:', error);
                throw error;
            }
        });
    }
}
exports.SearchService = SearchService;
