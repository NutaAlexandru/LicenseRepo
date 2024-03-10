import { Schema, model} from 'mongoose';

export interface User{
    id:string;
    email:string;
    password:string;
    name:string;
    address:string;
    isAdmin:boolean;
}

export const UserSchema=new Schema<User>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},
    name:{type:String,required:true},
    address:{type:String,required:false},
    isAdmin:{type:Boolean,required:false},
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

export interface googleUser{
    id:string;
    email:string;
    name:string;
}

export const googleUserSchema=new Schema<googleUser>({
    email:{type:String,required:true},
    name:{type:String,required:true},
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

export const GoogleUserModel=model<googleUser>('GoogleUser',googleUserSchema);