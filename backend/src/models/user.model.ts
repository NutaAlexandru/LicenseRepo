import { Schema, model} from 'mongoose';

export interface User{
    id:string;
    email:string;
    password:string;
    name:string;
    address:string;
    isDemo:boolean;
    balance:number;

}

export const UserSchema=new Schema<User>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},
    name:{type:String,required:true},
    address:{type:String,required:false},
    isDemo:{type:Boolean,required:false},
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
export interface DemoUser {
    id: string;
    email: string;
    name: string;
    address: string;
    isDemo: boolean;
    balance: number;
  }
  
  export const DemoUserSchema = new Schema<DemoUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: false },
    isDemo: { type: Boolean, required: true, default: true },
    balance: { type: Number, default: 99999999, required: true },
  }, {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  });
  
  export const DemoUserModel = model<DemoUser>('DemoUser', DemoUserSchema);



export const UserModel=model<User>('User',UserSchema);
