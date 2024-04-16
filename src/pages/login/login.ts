import BaseComponent from '../../components/baseComponent';
import Input from '../../components/input/input';

class Login extends BaseComponent {
  private readonly form: BaseComponent<'form'> = new BaseComponent({
    tag: 'form',
    className: 'login-form',
  });

  private readonly login: Input = new Input({
    type: 'text',
    placeholder: 'your login',
  });

  private readonly password: Input = new Input({
    type: 'password',
    placeholder: 'your password',
  });

  private readonly submit: Input = new Input({
    type: 'submit',
    defaultValue: 'login',
  });

  constructor(parent: HTMLElement, className: string) {
    super({ className, parent });
    this.form.addListener('submit', (e?: Event) => {
      if (e) e.preventDefault();
    });
    this.form.appendChildren([this.login, this.password, this.submit]);
  }

  renderLoginPage() {
    this.append(this.form);
  }

  removeLoginPage() {
    this.node.remove();
  }
}

export default Login;
