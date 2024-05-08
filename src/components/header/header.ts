import BaseComponent from '../baseComponent';

export default class Header extends BaseComponent<'header'> {
  private readonly paragraf: BaseComponent<'h1'>;

  constructor(className: string, parent: HTMLElement) {
    super({ tag: 'header', className, parent });
    this.paragraf = new BaseComponent({ tag: 'h1', content: 'fun chat' });
    this.append(this.paragraf);
  }
}
