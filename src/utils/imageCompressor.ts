import imageCompression from 'browser-image-compression'
import { handleAlert } from './alert/SweeAlert'
export const compressImage=async(file:File)=>{
const option={
    maxSizeMB:1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
}
try {
    const compressedFile=await  imageCompression(file,option)
    return  compressedFile
} catch (error) {
    if(error instanceof Error){
        throw new Error(error.message||'error on image compression')
    }else{
        
        throw new Error('error on image compression')
        
    }

}
}