import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  userName : string
  email : string
  password : string,
}

const Userschema = new Schema<IUser>({
  userName : {
    type : String,
    required : true,
    lowercase : true,
  },
  email : {
    type : String,
    required : true,
    unique : true,
  },
  password : {
   type : String,
    required : true,
  }
}, { timestamps: true });

export default model<IUser>("User", Userschema);