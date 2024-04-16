import BaseComponent from '../baseComponent';

export default class Footer extends BaseComponent<'footer'> {
  constructor(className: string, parent: HTMLElement) {
    super({ tag: 'footer', className, parent });
  }
}
