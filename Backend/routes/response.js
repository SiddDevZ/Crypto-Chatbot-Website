import { Hono } from 'hono'
import { rateLimiter } from "hono-rate-limiter"
import { GeneralChat } from '@chaingpt/generalchat'

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 150, 
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

export class ChatBot {
    constructor(apiKey) {
        this.generalchat = new GeneralChat({
            apiKey: apiKey
        });
    }

    async handleChatStream(socket, question) {
        try {
            const stream = await this.generalchat.createChatStream({
                question,
                chatHistory: "off"
            });

            let buffer = '';
            stream.on('data', (chunk) => {
                buffer += chunk.toString();
                
                const sentences = buffer.split(/(?<=[\n.!?])/g);
                
                if (sentences.length > 1) {
                    const complete = sentences.slice(0, -1).join('');
                    buffer = sentences[sentences.length - 1];
                    socket.emit('chunk', complete);
                }
            });

            stream.on('end', () => {
                socket.emit('done');
            });

            // Handle stream errors
            stream.on('error', (error) => {
                console.error('Stream error:', error);
                socket.emit('error', 'Stream processing failed');
            });

        } catch (error) {
            console.error("Error creating chat stream:", error);
            socket.emit('error', 'Failed to create chat stream');
            throw error;
        }
    }
}

router.post('/', limiter, async (c) => {
    return c.json({ message: "Please connect via WebSocket for real-time communication" });
})

export default router