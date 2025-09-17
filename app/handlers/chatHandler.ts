import { Socket } from "socket.io";
import { Customer, ICustomer } from "../models/customer.model";
import { ConversationState } from "../models/conversationState.enum";
import { hashPin } from "../middleware/auth";
import { partnerBankApi } from "../services/banking.service";
import { handleMainMenu } from "./menuHandler";

export const handleMessage = async (socket: Socket, msg: string) => {
  if (!socket.data.whatsappId) {
    return socket.emit("message", "Session not found. Please 'join' again.");
  }

  // Use the customer object from the socket's data.
  // This can be a temporary object or a full Mongoose document.
  let customer: Partial<ICustomer> | ICustomer = socket.data.customer;

  // A state machine to handle the conversation flow.
  switch (customer.conversationState) {
    case ConversationState.GREETING:
      if (msg.toLowerCase() === "yes") {
        customer.conversationState = ConversationState.COLLECTING_NAME;
        socket.emit(
          "message",
          "Great! Let’s set up your wallet 🎉\n1️⃣ Please type your Full Name (as it appears on your ID)."
        );
      } else {
        socket.emit(
          "message",
          "No problem. Let me know when you're ready to proceed."
        );
      }
      break;

    case ConversationState.COLLECTING_NAME:
      customer.fullName = msg.trim();
      customer.conversationState = ConversationState.ASK_FOR_BVN_OR_NIN;
      socket.emit(
        "message",
        "Do you have a BVN or NIN? Please type 'BVN' or 'NIN'."
      );
      break;

    case ConversationState.ASK_FOR_BVN_OR_NIN:
      if (msg.toLowerCase() === "bvn") {
        customer.conversationState = ConversationState.COLLECTING_BVN;
        socket.emit("message", "Please type your 11-digit BVN.");
      } else if (msg.toLowerCase() === "nin") {
        customer.conversationState = ConversationState.COLLECTING_NIN;
        socket.emit("message", "Please type your NIN.");
      } else {
        socket.emit("message", "Invalid input. Please type 'BVN' or 'NIN'.");
      }
      break;

    case ConversationState.COLLECTING_PIN:
      // Basic validation for PIN length.
      if (msg.length === 4 && /^\d+$/.test(msg)) {
        customer.pin = await hashPin(msg);
        customer.conversationState = ConversationState.CREATING_ACCOUNT;
        socket.emit("message", "✅ Processing your details… please wait.");

        // Create account and save the customer to the database for the first time.
        try {
          const accountDetails = await partnerBankApi.createVirtualAccount({
            fullName: customer.fullName!,
            bvn: customer.bvn! || "",
            nin: customer.nin! || ""
          });
          customer.accountNumber = accountDetails.accountNumber;

          // Create the customer in the database
          const newCustomer = await Customer.create({
            ...customer,
            conversationState: ConversationState.ACCOUNT_CREATED,
          });

          socket.emit(
            "message",
            `🎉 Congratulations! Your MyBank Account is ready.\nHere are your details:\nAccount Number: ${
              newCustomer.accountNumber
            }\nBank: ${
              accountDetails.bankName
            }\nWallet Balance: ₦${newCustomer.walletBalance.toFixed(
              2
            )}\n\nTo fund your wallet, simply transfer money to this account number.\nYou’ll receive instant alerts when money enters ✅`
          );

          // Transition to main menu
          newCustomer.conversationState = ConversationState.MAIN_MENU;
          await newCustomer.save();
          socket.data.customer = newCustomer; // Update socket data with the saved customer

          setTimeout(() => {
            socket.emit(
              "message",
              `\nWhat would you like to do today?\n1️⃣ Send Money\n2️⃣ Buy Airtime/Data\n3️⃣ Pay Bills\n4️⃣ Check Balance\n5️⃣ Transaction History\n6️⃣ Loan / Capital Access\n7️⃣ Help & Support\n8️⃣ End session`
            );
          }, 2000);
        } catch (error) {
          customer.conversationState = ConversationState.COLLECTING_PIN; // Revert state
          console.error("Account creation failed:", error);
          socket.emit(
            "message",
            "Sorry, we couldn't create your account at this time. Please try again later."
          );
        }
      } else {
        socket.emit("message", "Invalid PIN. Please enter a 4-digit PIN.");
      }
      break;

    case ConversationState.COLLECTING_BVN:
      // Basic validation for BVN length.
      if (msg.length === 11 && /^\d+$/.test(msg)) {
        customer.bvn = msg;
        customer.conversationState = ConversationState.COLLECTING_PIN;
        socket.emit(
          "message",
          "For your security, choose a 4-digit PIN.\nThis will be used to confirm money transfers."
        );
      } else {
        socket.emit(
          "message",
          "Invalid BVN. Please enter a valid 11-digit BVN."
        );
      }
      break;

    case ConversationState.COLLECTING_NIN:
      // Basic validation for NIN length.
      if (msg.length === 11 && /^\d+$/.test(msg)) {
        customer.nin = msg;
        customer.conversationState = ConversationState.COLLECTING_PIN;
        socket.emit(
          "message",
          "For your security, choose a 4-digit PIN.\nThis will be used to confirm money transfers."
        );
      } else {
        socket.emit(
          "message",
          "Invalid NIN. Please enter a valid 11-digit NIN."
        );
      }
      break;

    case ConversationState.MAIN_MENU:
      handleMainMenu(socket, customer as ICustomer, msg);
      break;

    default:
      socket.emit(
        "message",
        "I'm not sure how to handle that. Let's start over."
      );
      customer.conversationState = ConversationState.GREETING;
      break;
  }
};
