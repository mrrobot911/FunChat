import BaseComponent from '../components/baseComponent';
import ChatPage from '../pages/chat/chat';
import WebSocketService from '../services/websoket-service';

export default class ChatController {
  private readonly view: ChatPage;

  private readonly webSocketService = new WebSocketService();

  constructor(private readonly root: BaseComponent<'section'>) {
    this.view = new ChatPage(this.root.getNode(), 'chat');
  }

  renderChatPage() {
    this.root.append(this.view);
  }

  removeChatPage() {
    this.view.getNode().remove();
  }

  destroyChat() {
    this.root.destroy();
  }
}
