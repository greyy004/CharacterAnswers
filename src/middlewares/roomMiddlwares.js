import {rooms} from '../stores/roomStore.js';

for(let [code, room] of rooms) {
    console.log(code, room);
}

export const checkRoomExists = (req, res, next) => {
    // console.log('Checking if room exists:', req.params);
};