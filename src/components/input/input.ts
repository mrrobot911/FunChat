import BaseComponent from '../baseComponent';

export type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface LoginInput {
  type: HTMLInputTypeAttribute;
  defaultValue?: string;
  placeholder?: string;
}

export default class Input extends BaseComponent<'input'> {
  private type: HTMLInputTypeAttribute;

  private placeholder: string;

  private defaultValue: string;

  private value: string;

  constructor({ type, defaultValue = '', placeholder = '' }: LoginInput) {
    super({ tag: 'input' });
    this.type = type;
    this.placeholder = placeholder;
    this.defaultValue = defaultValue;
    this.value = '';
    this.setAttribute('type', this.type);
    this.setAttribute('placeholder', this.placeholder);
    this.setAttribute('value', this.defaultValue);
    this.addListener('input', (event?: Event) => {
      const target = event?.target as HTMLInputElement;
      this.value = target.value;
    });
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string) {
    this.value = value;
    this.setAttribute('value', value);
  }
}
