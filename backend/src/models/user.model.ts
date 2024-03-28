import { Schema, model} from 'mongoose';

export interface User{
    id:string;
    email:string;
    password:string;
    name:string;
    address:string;
    isAdmin:boolean;
    balance:number;

}

export const UserSchema=new Schema<User>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},
    name:{type:String,required:true},
    address:{type:String,required:false},
    isAdmin:{type:Boolean,required:false},
    balance: {
        type: Number,
        default: 0,
        required:false // sau o valoare inițială specifică, dacă este cazul
      },
},
{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
}
);

export const UserModel=model<User>('User',UserSchema);
