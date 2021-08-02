const mongoose= require('mongoose');

mongoose.connect("mongodb://localhost:27017/emp_data",{ useNewUrlParser:true,
	useUnifiedTopology:true,useCreateIndex:true})
.then(()=>console.log("Connection established sucessfully....")).catch((err)=> console.log(err));