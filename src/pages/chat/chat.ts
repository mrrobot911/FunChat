import BaseComponent from '../../components/baseComponent';
import Input from '../../components/input/input';

export default class ChatPage extends BaseComponent {
  private readonly login: Input = new Input({
    type: 'text',
    placeholder: 'your login',
  });

  private readonly usersList: BaseComponent = new BaseComponent({
    tag: 'div',
    className: 'users',
  });

  constructor(parent: HTMLElement, className: string) {
    super({ className, parent });
    this.appendChildren([this.usersList]);
  }

  getUsersList() {
    return this.usersList;
  }

  removeLoginPage() {
    this.node.remove();
  }
}
