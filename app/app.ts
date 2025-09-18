import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/db";
import { handleMessage } from "./handlers/chatHandler";
import { handleMainMenu } from "./handlers/menuHandler";
import { Customer } from "./models/customer.model";
import config from "./config/config";

// --- Server Setup ---
const httpServer = createServer();
const io = new Server(httpServer);

const PORT = config.port;

// --- Socket.IO Connection Handling ---
io.on("connection", (socket) => {
  console.log(`A user connected via Socket.IO: ${socket.id}`);

  // Event to join a room based on whatsappId
  socket.on("join", async (whatsappId: string) => {
    socket.data.whatsappId = whatsappId;
    console.log(`Socket ${socket.id} joined with whatsappId: ${whatsappId}`);

    // Check if customer exists.
    let customer = await Customer.findOne({ whatsappId });
    if (!customer) {
      // If not, start the registration flow with an in-memory customer object.
      console.log(
        `New customer registration started for whatsappId: ${whatsappId}`
      );
      socket.data.customer = {
        whatsappId,
        bvn: "", // Initialize bvn field
        nin: "", // Initialize nin field
        conversationState: "GREETING",
      };
      socket.emit(
        "message",
        "Hello! 👋 Welcome to MyBank. To get started, we need to set up your wallet. Shall we begin? (yes/no)"
      );

      // Handle incoming messages for a new customer
      socket.on("message", (msg: string) => {
        handleMessage(socket, msg);
      });
    } else {
      // If the customer exists, they are a returning user. Go to the main menu.
      socket.data.customer = customer;
      socket.emit(
        "message",
        `Welcome back! What would you like to do today?\n1️⃣ Send Money\n2️⃣ Buy Airtime/Data\n3️⃣ Pay Bills\n4️⃣ Check Balance\n5️⃣ Transaction History\n6️⃣ Loan / Capital Access\n7️⃣ Help & Support\n8️⃣ End session`
      );

      // Handle incoming messages for an existing customer
      socket.on("message", (msg: string) => {
        handleMainMenu(socket, customer, msg);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export default start;
