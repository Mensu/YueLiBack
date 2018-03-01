declare module 'yueli' {
  import KoaSession from 'koa-session'

  interface ParamData {
    [x: string]: any
    body?: any
    query?: any
    session?: KoaSession.Session
    ip?: string
    curUser?: Model.User
    user?: Model.User
    extraMsg?: string
    file?: Express.Multer.File
    files?: Express.Multer.File[] & { [field: string]: Express.Multer.File[] }
  }
}