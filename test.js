import { handleMessage } from './src/controllers/messageController.js';
(async ()=> {
  console.log(await handleMessage({message: "hi", sender: "test"}));
})();
