import { Hono } from "hono";
import { cors } from "hono/cors";
import { Server } from "socket.io";
import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { ChatBot } from "./routes/response.js"; // Import the ChatBot class

config();

// Rate limiting mechanism
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 25;

const rateLimitMap = new Map();

function isRateLimited(socketId) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(socketId)) {
    rateLimitMap.set(socketId, [now]);
    return false;
  }

  const requests = rateLimitMap.get(socketId).filter(time => time > windowStart);
  requests.push(now);
  rateLimitMap.set(socketId, requests);

  return requests.length > MAX_REQUESTS_PER_WINDOW;
}

const app = new Hono();

app.use("*", cors());

const port = process.env.PORT || 3001;

const server = serve({
  fetch: app.fetch,
  port,
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (c) => c.text("Hello World!"));

// Initialize ChatBot with API key
const chatBot = new ChatBot(process.env.API_KEY);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send", async ({ prompt }) => {
    console.log("Received prompt:", prompt);

    if (isRateLimited(socket.id)) {
      console.log("Rate limit exceeded for socket:", socket.id);
      socket.emit("error", "Rate limit exceeded. Please wait before sending more requests.");
      socket.emit("done");
      return;
    }

    try {
      await chatBot.handleChatStream(socket, prompt);
    } catch (error) {
      console.error("Error handling chat stream:", error);
      socket.emit("error", "Failed to process your request");
      socket.emit("done");
    }
  });

  // Handle client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
    rateLimitMap.delete(socket.id); // Clean up rate limit data for disconnected users
  });
});

console.log(`Server running at http://localhost:${port}`);

export { server };