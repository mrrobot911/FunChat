import BaseComponent from '../baseComponent';
import './footer.css';

export default class Footer extends BaseComponent<'footer'> {
  private readonly name = new BaseComponent({
    tag: 'a',
    content: 'KelWin',
    className: 'author',
  });

  private readonly school = new BaseComponent({
    tag: 'a',
    className: 'school',
  });

  private readonly year = new BaseComponent({
    tag: 'p',
    content: '2024',
  });

  private readonly schoolImg = new BaseComponent({
    tag: 'img',
    className: 'logo',
  });

  constructor(className: string, parent: HTMLElement) {
    super({ tag: 'footer', className, parent });
    this.name.setAttribute('href', 'https://github.com/mrrobot911');
    this.school.setAttribute('href', 'https://rollingscopes.com/');
    this.schoolImg.setAttribute(
      'src',
      'https://yt3.googleusercontent.com/ytc/AIdro_kMfq-PBRJfqrsfChsLky3RFSQELg3Te0fSrziu=s900-c-k-c0x00ffffff-no-rj'
    );
    this.schoolImg.setAttribute('alt', 'RS School');
    this.school.append(this.schoolImg);
    this.appendChildren([this.name, this.year, this.school]);
  }
}
