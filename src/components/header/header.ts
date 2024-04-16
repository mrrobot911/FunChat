import BaseComponent from '../baseComponent';

export default class Header extends BaseComponent<'header'> {
  private readonly paragraf: BaseComponent<'p'>;

  constructor(className: string, parent: HTMLElement) {
    super({ tag: 'header', className, parent });
    this.paragraf = new BaseComponent({ tag: 'p', content: 'fun chat' });
    this.append(this.paragraf);
  }
}
