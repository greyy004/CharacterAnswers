import { createUserTable } from "../models/userModel.js";
import { createMessageTable } from "../models/messageModel.js";
import {
  createRoomTable,
  createRoomUserTable,
  createRoomIndex,
} from "../models/roomModel.js";

export const initdb = async () => {
  await createUserTable();
  await createRoomTable();
  await createRoomUserTable();
  await createRoomIndex();
  await createMessageTable();
  console.log("All tables created successfully.");
};
