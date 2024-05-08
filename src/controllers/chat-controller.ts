import BaseComponent from '../components/baseComponent';
import ChatPage from '../pages/chat/chat';

export default class ChatController {
  constructor(private readonly root: BaseComponent<'section'>) {}

  renderChatPage() {
    this.root.append(new ChatPage(this.root.getNode(), 'chat'));
  }

  destroyChat() {
    this.root.destroy();
  }
}
