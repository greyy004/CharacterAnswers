import { createRoom} from '../stores/roomStore.js';
export async function createRoomHandler(req, res) {
  try {
    const room = createRoom();

    return res.status(201).json({
      data: {
        message: 'Room created successfully.',
        code: room.code
      }
    });
  } catch (error) {
    console.error('Failed to create room:', error);
    return res.status(500).json({ message: 'Error creating room.' });
  }
}

export const joinRoom = async (req, res) => {

  return res.sendFile('public/html/terminal.html', { root: '.' });
};
