import { createUserTable } from "../models/userModel.js";
import { createRoomTable } from "../models/roomModel.js";
import { createMessageTable } from "../models/messageModel.js";

export const initdb = async () => {
    await createUserTable();
    await createRoomTable();
    await createMessageTable();
    console.log("All tables created successfully.");
}