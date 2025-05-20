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
exports.processor = void 0;
const generative_ai_1 = require("@google/generative-ai");
if (!process.env.GOOGLE_AI_KEY) {
    throw new Error('GOOGLE_AI_KEY is not defined in environment variables');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
class processor {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        this.embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    }
    generateEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.embeddingModel.embedContent(text);
                const embedding = result.embedding.values;
                return embedding;
            }
            catch (error) {
                console.error('Embedding generation failed:', error);
                throw error;
            }
        });
    }
    generateResponse(context, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `
                Context: ${context}
                
                Question: ${query}
                
                Instructions:
                - Use the provided context to answer the question
                - If the context doesn't contain relevant information, say so
                - Be concise but informative
                - Cite specific pieces of content when possible
            `;
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return response.text();
            }
            catch (error) {
                console.error('Response generation failed:', error);
                throw error;
            }
        });
    }
}
exports.processor = processor;
