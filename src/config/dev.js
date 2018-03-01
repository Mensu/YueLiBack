import path from 'path';

export default {
  appKeys: ['yueli-app'],
  port: 3009,
  db: {
    host: 'localhost',
    user: 'yueli',
    password: 'yueliapp',
    database: 'yueli',
    port: 3306,
  },
  salt: 'yueli-app',
  MockService: {
    url: 'http://private-aa8865-yueliapi.apiary-mock.com',
  },
  FileService: {
    root: path.resolve(__dirname, '..', '..', 'data', 'fs'),
  },
};
