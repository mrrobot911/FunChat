import BaseComponent from '../components/baseComponent';
import Input from '../components/input/input';
import LoginPage from '../pages/login/login';
import WebSocketService from '../services/websoket-service';

export default class LoginController {
  private readonly view: LoginPage;

  private readonly webSocketService = new WebSocketService();

  constructor(private readonly root: BaseComponent<'section'>) {
    this.view = new LoginPage(this.root.getNode(), 'login');
    this.addFormListener();
  }

  addFormListener() {
    this.view.getFormElement().addListener('submit', (e) => {
      e?.preventDefault();
      const loginElement = this.view.getFormElement().getChildren()[0];
      const passwordElement = this.view.getFormElement().getChildren()[1];
      const login =
        loginElement instanceof Input ? loginElement.getValue() : '';

      const password =
        passwordElement instanceof Input ? passwordElement.getValue() : '';
      const data = {
        id: '1',
        type: 'USER_LOGIN',
        payload: {
          user: {
            login,
            password,
          },
        },
      };
      this.webSocketService.getLogin(data);
      this.view.cleareForm();
      this.removeLoginPage();
    });
  }

  renderLoginPage() {
    this.root.append(this.view);
  }

  removeLoginPage() {
    this.view.getNode().remove();
  }

  destroyLogin() {
    this.root.destroy();
  }
}
