import * as Yueli from 'yueli'
import * as Koa from 'koa'
import * as Request from 'request'
import * as Multer from 'multer'
import KoaGenericSession from 'koa-generic-session'
import KER from 'koa-express-router'
import * as mysql from 'mysql'

declare global {
  type Context = Koa.Context & Yueli.Context
  type RequestStream = Request.Request
  type ParamData = Yueli.ParamData
  type KoaExpressRouter = KER
  type IMiddleware = Koa.IMiddleware
  type INext = () => Promise<any>
  type Application = Koa
  type MulterInstance = Yueli.MulterInstance
  type MulterOptions = Multer.Options
  type MulterFile = Express.Multer.File
  type RequestOptions = Request.Options
  type MysqlConn = mysql.PoolConnection
  type MysqlPool = mysql.Pool
  type MysqlQueryable = MysqlConn | MysqlPool
  type InsertResult = mysql.InsertResult

  type User = Yueli.Model.User
  type UserEditableProps = Yueli.Model.UserEditableProps
  type UserCredentials = Yueli.Model.UserCredentials
  type UserFollower = Yueli.Model.UserFollower
  type Spot = Yueli.Model.Spot
  type Comment = Yueli.Model.Comment
  type CommentType = Yueli.Model.CommentType
  type Travel = Yueli.Model.Travel
  type TravelEditableProps = Yueli.Model.TravelEditableProps
  type TravelRecord = Yueli.Model.TravelRecord
  type TravelRecordEditableProps = Yueli.Model.TravelRecordEditableProps
  type Feeling = Yueli.Model.Feeling
  type FeelingEditableProps = Yueli.Model.FeelingEditableProps
}

declare module 'yueli' {
  interface Context {
    paramData: ParamData
    sessionOptions: KoaGenericSession.SessionOptions
    setResp(msg?: string, data?: any, extraMsg?: string, status?: string): Promise<void>
    handleError(e: Error): Promise<void>
  }
}
