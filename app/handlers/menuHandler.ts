import { Socket } from "socket.io";
import { ICustomer } from "../models/customer.model";
import { ConversationState } from "../models/conversationState.enum";

export const handleMainMenu = async (
  socket: Socket,
  customer: ICustomer,
  msg: string
): Promise<void> => {
  switch (msg) {
    case "4": // Check Balance
      socket.emit(
        "message",
        `Your current wallet balance is: ₦${customer.walletBalance.toFixed(2)}`
      );
      break;
    case "1":
    case "2":
    case "3":
    case "5":
    case "6":
    case "7": // Help & Support
      socket.emit("message", "This feature is coming soon!");
      break;
    case "8": // End session
      socket.emit("message", "Thank you for using MyBank. Goodbye! 👋");
      customer.conversationState = ConversationState.GREETING;
      await customer.save(); // Save the state and exit the function
      socket.disconnect(true); // Forcefully disconnect the client
      return;
    default:
      socket.emit(
        "message",
        "Invalid option. Please choose a number from the menu."
      );
      break;
  }
  // Keep the user in the main menu state for other actions.
  customer.conversationState = ConversationState.MAIN_MENU;
  await customer.save();
};
