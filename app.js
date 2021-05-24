const express=require('express');
const app=express();

const mongoose= require('mongoose');

const DB = 'mongodb+srv://aman:somaniaman@cluster0.2rxcu.mongodb.net/task?retryWrites=true&w=majority';

mongoose.connect(DB,{ useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
.then(()=>console.log("Connection established sucessfully....")).catch((err)=> console.log(err));


const path=require('path');
const hbs=require('hbs');

const register=require('./register');

const fs = require('fs');


const excelToJson = require('convert-excel-to-json');


const{json}=require('express');
const port=process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine","hbs");


app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/thanks",(req,res)=>{
    res.render("thanks");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/dispstd/:id" ,async(req,res)=>{
	try{

		const id=req.params.id;
	const show= await register.find({_id:id});
	//console.log(show);
    
        res.render('dispstd',{
        	users:show
        });
   } catch(error){
      res.status(404).send("error");
    }
});

app.post("/update/:id" ,async(req,res)=>{

	try{
		const id=req.params.id;
		const update=await register.findByIdAndUpdate(id,{firstName:req.body.fname,
			lastName:req.body.lname,
			mobileNumber:req.body.phn,
			age:req.body.age,
	 		address:req.body.add
	 		});

		res.redirect('/allstds');
   } catch(error){
      res.status(404).send("error");
    }
});

app.get("/delete/:id",async(req,res)=>{
    try{
	const id= req.params.id;
	const del = await register.findByIdAndDelete(id);
	res.redirect("/allstds");
       
    }catch(error){
      res.status(404).send("error");
    }

});


app.get('/allstds',async(req,res)=>{
	try{
	const display= await register.find();
	res.render('allstds',{
		users:display
	});
}catch(error){
      res.status(404).send("error");
  }
});






app.post("/pssd",async(req,res)=>{
	try{
	
		let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb+srv://aman:somaniaman@cluster0.2rxcu.mongodb.net/task?retryWrites=true&w=majority';

// -> Read Excel File to Json Data

const excelData = excelToJson({
    sourceFile: 'customers.xlsx',
    sheets:[{
		// Excel Sheet Name
        name: 'Customers',
		
		// Header Row -> be skipped and will not be present at our result object.
		header:{
            rows: 1
        },
		
		// Mapping columns to keys
        columnToKey: {
        	A: 'firstName',
 			B: 'lastName',
			C: 'mobileNumber',
			D: 'age',
			E: 'gender',
			F: 'emailAddress',
			G: 'password',
			H: 'address'
        }
    }]
});

// -> Log Excel Data to Console
console.log(excelData);

// -> Insert Json-Object to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  
  var dbo = db.db("task");
  
  dbo.collection("records").insertMany(excelData.Customers, (err, res) => {
	if (err) throw err;
	
	console.log("Number of documents inserted: " + res.insertedCount);
	db.close();
  });
});

 res.redirect("/thanks");

 }catch(error){
      res.status(404).send("error");
  }
});


 app.post("/logins",async(req,res)=>{
	 try{
    	const email=req.body.email;
    	const password=req.body.password;

    	const data = await register.findOne({emailAddress:email});
  
  		if(data.password === password){
    		res.status(201).render('std',{
    			id:data._id,
    			fname:data.firstName,
    			lname:data.lastName,
    			phone:data.mobileNumber,
    			age:data.age,
    			email:data.emailAddress

    		});
    	}
    	else
    	{
    		res.status(400).render('login',{
    	error:"**Invalid login credintials"
    });
    	}

    }catch(err){res.status(400).render('login',{
    	error:"**Invalid login credintials"
    })};
 });

	



app.get("*",(req,res)=>{
	res.send("Error 404");
});
app.listen(port,()=>{
	console.log("Server is listening at port:" + port);
});
