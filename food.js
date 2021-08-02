const mongoose=require('mongoose');

const foodSchema= new mongoose.Schema({
	employee_name:{
		type:String,
		required:true
	},
	employee_id:{
		type:String,
		required:true
	},
	meal_type:{
		type:String
	},
	item_name:{
		type:String
	},
	quantity:{
		type:Number,
		required:true
	},
	// rate:{
	// 	type:Number,
	// 	required:true
	// },
	// total:{
	// 	type:Number,
	// 	required:true
	// }
	//

});



const foodie= new mongoose.model("Food_item",foodSchema);

module.exports=foodie;
