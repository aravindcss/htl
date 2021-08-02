const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  name:{
    type:String,
required:true,
},

email:{
  type:String,
    required:true,
    unique:true,
},

phone:{
  type:Number,
},

gender:{
  type:String,
},
age:{
  type:Number,
},

password:{
  type:String,
  required:true,
},

confirmpassword:{
  type:String,
    required:true,
},


})


const Ngo = new mongoose.model("Ngo",employeeSchema);
module.exports= Ngo;
