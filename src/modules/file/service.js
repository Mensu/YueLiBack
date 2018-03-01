import File from './File';

/** @type {{ avatar: 'avatar', bg: 'bg' }} */
const UserFileType = {
  avatar: 'avatar',
  bg: 'bg',
};

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

UserFile.Type = UserFileType;

export class SpotFile extends File {
  /**
   *
   * @param {number} spot_id
   */
  constructor(spot_id) {
    super(`spot-${spot_id}-bg`);
  }
}
