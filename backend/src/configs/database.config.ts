import {connect,ConnectOptions} from 'mongoose';


export const dbConnect=() =>{
    connect(process.env.MONGO_URI!,{
    } as ConnectOptions).then(
        ()=>console.log("Connected to database"),
        (error)=>console.log("Error connecting to database",error)
    )
}