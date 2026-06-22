import { Socket } from 'phoenix';

export const socket = new Socket(
  'wss://fun-chat-server-dhec.onrender.com/socket'
);

export default socket;
