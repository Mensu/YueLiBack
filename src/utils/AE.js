import _ from 'lodash';

export const OK = 'OK';
export const BAD_REQUEST = 'BAD_REQUEST';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
export const WRONG_CAPTCHA = 'WRONG_CAPTCHA';
export const NO_PERMISSION = 'NO_PERMISSION';
export const NOT_FOUND = 'NOT_FOUND';
export const UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const INTERNAL_ERROR = 'INTERNAL_ERROR';

/** @type {Object<string, number>} */
const map = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 401,
  WRONG_PASSWORD: 401,
  NO_PERMISSION: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  UNKNOWN_ERROR: 500,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  /**
   * 构造 App 异常
   * @param  {string}        status
   * @param  {string}        msg
   * @param  {Error|string}  [e]
   * @param  {any}           [data]
   */
  constructor(status, msg, e = undefined, data = undefined) {
    const was = _.isObject(e) ? 'error' : typeof e;

    let stack;
    if (e instanceof Error) {
      stack = e.stack.split('\n');
      stack[0] = '--------------------';
      stack = stack.join('\n');
    } else {
      e = e || msg;
    }
    super(String(e));

    // copy properties
    Object.keys(e).forEach((key) => { this[key] = e[key]; });

    /** @type {typeof was} */
    this.was = was;
    /** @type {{ status: string, msg: string, data?: any }} */
    this.info = { status, msg };
    if (data !== undefined) Object.assign(this.info, { data });

    // use this.name to populate stack
    this.name = Reflect.getPrototypeOf(this).constructor.name;
    this.stack = `${this.stack}\n${stack}\nInfo: ${JSON.stringify(this.info)}`;
    // and delete this.name after using
    delete this.name;
  }

  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof AppError)) throw e;
  }

  /**
   *
   * @param {string} status
   */
  static getCode(status) {
    return map[status] || 400;
  }
}

export class SoftError extends AppError {
  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof SoftError)) throw e;
  }
}

export class HardError extends AppError {
  /**
   * 若不是实例，则抛出
   * @param {Error} e
   */
  static throwIfNotInstance(e) {
    if (!(e instanceof HardError)) throw e;
  }
}
