import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { FileService } from '../../config';

export default class File {
  /**
   *
   * @param {string} filename
   */
  constructor(filename) {
    this.filename = filename;
    this.setPath(filename);
  }

  /**
   * 合成完整的路径
   * @param {string} p
   */
  static resolveFullPath(p) {
    return path.resolve(FileService.root, p);
  }

  /**
   *
   * @param {string} filename
   */
  setPath(filename) {
    this.path = File.resolveFullPath(filename);
  }

  /**
   *
   * @param {Buffer} buffer
   */
  upload(buffer) {
    return promisify(fs.writeFile)(this.path, buffer);
  }

  /**
   *
   * @param {string} fallback
   */
  async download(fallback = null) {
    let { path } = this;
    if (fallback) {
      try {
        await promisify(fs.stat)(this.path);
      } catch (e) {
        path = File.resolveFullPath(fallback);
      }
    }
    return fs.createReadStream(path);
  }
}
