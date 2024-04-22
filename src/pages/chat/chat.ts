import BaseComponent from '../../components/baseComponent';

export default class ChatPage extends BaseComponent {
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
