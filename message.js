const mongoose=require('mongoose');

const foodSchema= new mongoose.Schema({

	meal_type:{
		type:String,
			required:true,
	},
	item_name:{
		type:String,
			required:true,
	},
	quantity:{
		type:Number,
	required:true,
	},
	rate:{
		type:Number,

	},
	total:{
		type:Number,

	}


});



const Message= new mongoose.model("Message",foodSchema);

module.exports=Message;
