import BaseComponent from '../components/baseComponent';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Login from '../pages/login/login';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  private readonly header: Header;

  private readonly form: Login;

  private readonly footer: Footer;

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ className: 'page' });
    this.header = new Header('header', this.node);
    this.footer = new Footer('footer', this.node);
    this.form = new Login(this.appRoot.getNode(), 'login');

    this.form.renderLoginPage();

    this.appendChildren([
      this.header.getNode(),
      this.appRoot,
      this.footer.getNode(),
    ]);
  }
}
