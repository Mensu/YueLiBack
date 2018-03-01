import * as mysql from 'mysql'

declare module 'mysql' {
  interface Connection {
    queryAsync(query: mysql.Query): Promise<any>
    queryAsync(options: string | mysql.QueryOptions): Promise<any>
    queryAsync(options: string, values: any): Promise<any>

    beginTransactionAsync(options?: QueryOptions): Promise<void>
    beginTransactionAsync(): Promise<void>;

    commitAsync(options?: QueryOptions): Promise<void>
    commitAsync(): Promise<void>

    rollbackAsync(options?: QueryOptions): Promise<void>
    rollbackAsync(): Promise<void>
  }
  interface Pool {
    queryAsync(query: mysql.Query): Promise<any>
    queryAsync(options: string | mysql.QueryOptions): Promise<any>
    queryAsync(options: string, values: any): Promise<any>

    getConnectionAsync(): Promise<mysql.PoolConnection>
  }

  interface InsertResult {
    insertId: number
  }
}
