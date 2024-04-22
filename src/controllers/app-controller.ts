import BaseComponent from '../components/baseComponent';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import LoginController from './login-controller';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent<'section'>;

  private readonly header: Header;

  private readonly footer: Footer;

  private readonly loginController: LoginController;

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ tag: 'section', className: 'page' });
    this.header = new Header('header', this.node);
    this.loginController = new LoginController(this.appRoot);
    this.loginController.renderLoginPage();
    this.footer = new Footer('footer', this.node);

    this.appendChildren([
      this.header.getNode(),
      this.appRoot,
      this.footer.getNode(),
    ]);
  }
}
