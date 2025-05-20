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
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
if (!process.env.GOOGLE_AI_KEY) {
    throw new Error('GOOGLE_AI_KEY is not defined in environment variables');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
class GeminiService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        this.embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    }
    generateEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.embeddingModel.embedContent(text);
                const embedding = yield result.embedding;
                return embedding.values;
            }
            catch (error) {
                console.error('Error generating embedding:', error);
                throw error;
            }
        });
    }
    searchSimilarContent(query, embeddings) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cosine similarity calculation
            const dotProduct = embeddings.reduce((acc, val, i) => acc + val * embeddings[i], 0);
            const magnitude1 = Math.sqrt(embeddings.reduce((acc, val) => acc + val * val, 0));
            const magnitude2 = Math.sqrt(embeddings.reduce((acc, val) => acc + val * val, 0));
            return dotProduct / (magnitude1 * magnitude2);
        });
    }
    generateResponse(query, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `Based on the following context, please answer the query:
            
            Context: ${context}
            
            Query: ${query}
            
            Please provide a relevant and concise response based on the context provided.`;
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return response.text();
            }
            catch (error) {
                console.error('Error generating response:', error);
                throw error;
            }
        });
    }
}
exports.GeminiService = GeminiService;
