import BaseComponent from '../components/baseComponent';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import WebSocketService from '../services/websoket-service';
import ChatController from './chat-controller';
import LoginController from './login-controller';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent<'section'>;

  private readonly header: Header;

  private readonly footer: Footer;

  private readonly loginController: LoginController;

  private readonly chatController: ChatController;

  private readonly webSocketService = new WebSocketService();

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ tag: 'section', className: 'page' });
    this.header = new Header('header', this.node);
    this.loginController = new LoginController(this.appRoot);
    this.loginController.renderLoginPage();
    this.chatController = new ChatController(this.appRoot);
    this.footer = new Footer('footer', this.node);

    this.appendChildren([
      this.header.getNode(),
      this.appRoot,
      this.footer.getNode(),
    ]);
  }

  addChatPage() {
    this.webSocketService.getSoket().addEventListener('message', (event) => {
      if (event.data.type === 'USER_LOGIN')
        this.chatController.renderChatPage();
    });
  }
}
