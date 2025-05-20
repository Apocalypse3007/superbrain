import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_KEY) {
    throw new Error('GOOGLE_AI_KEY is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

export class processor{
    private model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    private embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

    async generateEmbedding(text: string) {
        try {
            const result = await this.embeddingModel.embedContent(text);
            const embedding = result.embedding.values;
            return embedding;
        } catch (error) {
            console.error('Embedding generation failed:', error);
            throw error;
        }
    }

    async generateResponse(context: string, query: string) {
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

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Response generation failed:', error);
            throw error;
        }
    }
}