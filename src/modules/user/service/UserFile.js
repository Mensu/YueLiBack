import { File } from '../../file/service';

export class UserFile extends File {
  /**
   *
   * @param {number} user_id
   * @param {'avatar'|'bg'} type
   */
  constructor(user_id, type) {
    super(`user-${user_id}-${type}`);
    this.type = type;
  }

  download() {
    return super.download(`user-default-${this.type}`);
  }
}

/** @type {{ avatar: 'avatar', bg: 'bg' }} */
const UserFileType = {
  avatar: 'avatar',
  bg: 'bg',
};
UserFile.Type = UserFileType;
