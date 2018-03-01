import * as Multer from 'multer'

declare module 'yueli' {
  interface MulterInstance {
    /** Accept a single file with the name fieldName. The single file will be stored in ``ctx.paramData.file``. */
    single(fieldName?: string): IMiddleware;
    /** Accept an array of files, all with the name fieldName. Optionally error out if more than maxCount files are uploaded. The array of files will be stored in ``ctx.paramData.files``. */
    array(fieldName: string, maxCount?: number): IMiddleware;
    /** Accept a mix of files, specified by fields. An object with arrays of files will be stored in ``ctx.paramData.files``. */
    fields(fields: Multer.Field[]): IMiddleware;
    /** Accepts all files that comes over the wire. An array of files will be stored in ``ctx.paramData.files``. */
    any(): IMiddleware;
  }
}
