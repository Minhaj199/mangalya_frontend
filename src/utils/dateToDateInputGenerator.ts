
export function dateToDateInputGenerator(from:string,input:string|Date){
    if(from==='intoInput'){
        
        const date =new Date (input)
        
        const day=(date.getDate()).toString().padStart(2,'0')
        const month=(date.getMonth()+1).toString().padStart(2,'0')
        const formatedDate=`${date.getFullYear()}-${month}-${day}`
        return  formatedDate
    }else{
        const date =new Date (input)
        const day=(date.getDate()).toString().padStart(2,'0')
        const month=(date.getMonth()+1).toString().padStart(2,'0')
        const formatedDate=`${month}-${day}-${date.getFullYear()}`
        return  formatedDate
    }
}