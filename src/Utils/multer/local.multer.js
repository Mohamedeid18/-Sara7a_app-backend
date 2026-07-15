import multer from 'multer'
import path from 'node:path'
export const localFileUpload = ()=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(req.file);
            cb(null, path.resolve('uploads/'))
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    return multer({ storage })
}