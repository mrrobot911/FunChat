interface FormData {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}
export default class WebSocketService {
  private readonly socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:4000');
  }

  getLogin(data: FormData) {
    this.socket.send(JSON.stringify(data));
  }

  getMessage() {
    this.socket.addEventListener('message', (event) => event.data);
  }
}
