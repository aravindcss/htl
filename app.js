const express=require('express');
const app=express();

const mongoose= require('mongoose');

require('./conn');

const path=require('path');
const hbs=require('hbs');

const register=require('./register');
const food=require('./food');
const Ngo=require('./ngo');
const Message=require('./message');

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


app.get('/admin',(req,res)=>{
	res.render('admin')
});

app.get('/stdlogin',(req,res)=>{
	res.render('stdregister')
});

// app.get('/stdregister',(req,res)=>{
// 	res.render('stdregister')
// });

//register as ngo
app.post("/ngo",async(req,res)=>{
  try{
  const password = req.body.password;
  const cpassword = req.body.confirmpassword;
  if(password===cpassword){
    const registerEmployee = new Ngo({
         name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender,
        age:req.body.age,
        password:password,
        confirmpassword:cpassword,
    })
const registered =  await registerEmployee.save();
res.status(201).render("stdregister");
  }
  else{
    res.send("password are not matching");
  }
  }
  catch(error){
res.status(404).send("error");
  }
})

//login as ngo
app.post("/stdlogin",async(req,res)=>{
try{
const email = req.body.email;
const password = req.body.password;

  const useremail= await Ngo.findOne({email:email});
  if(useremail.password===password){
    res.status(201).render("ngoprofile",{user:useremail});
  }
  else{
    res.status(404).render("stdregister",{
      error:"invalid login details"
    });
  }
}
catch(error){
  res.status(404).render("stdregister",{
    error:"invalid login credentials"
  })
};
});

//confirm food item to ngo
app.post("/message",async(req,res)=>{
  try{
    // const id=req.params.id;
    const messageadmin = new Message({
      meal_type:req.body.meal_type,
      item_name:req.body.item_name,
      quantity:req.body.quantity,
        rate:req.body.rate,
      total:req.body.total
 })

 const userregistered = await messageadmin.save();
 	// const del = await Message.findOneAndDelete({Identity:id});
 res.render("admin",{user:userregistered});
}
catch(error){
res.status(404).send(error);
}
});

//display foodavailable in ngo
app.get("/userprofile",async(req,res)=>{
  try{
     details = await Message.find();

  res.render("userprofile",{user:details});
 // console.log(details)
 }
 catch(error){
   res.status(404).send("error");
 }
});

//display food available in admin
   app.get("/todolist",async(req,res)=>{
     try{
      // const id = req.params.id;
        details = await food.find();
     res.render("todolist",{user:details});
    // console.log(details)
    }
    catch(error){
      res.status(404).send("error");
    }
   });

//delete food
   app.get("/delete1/:id",function(req,res,next){
       const id= req.params.id,
          del= food.findByIdAndDelete(id);
         del.exec(function(err){
           if(err) throw err;
           res.redirect("/todolist");
         });
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

//delete food
   app.get("/delete/:id",function(req,res,next){
       const id= req.params.id,
          del= Message.findByIdAndDelete(id);
         del.exec(function(err){
           if(err) throw err;
           res.redirect("/userprofile");
         });
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

app.get("/delete2/:id",async(req,res)=>{
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


app.get('/admlogin',(req,res)=>{
	res.render('admlogin')
});

app.post("/administ",(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;
const e="admin@gmail.com";
const p="1234";
if(email==e&&password==p){
  res.render('admin');
}
	else
    	{
    		res.status(400).render('admlogin',{
    	error:"**Invalid login credintials"
    });
    	}

    }catch(err){res.status(400).render('admlogin',{
    	error:"**Invalid login credintials"
    })};
 });






app.post("/pssd",async(req,res)=>{
	try{

		let MongoClient = require('mongodb').MongoClient;

         let url = "mongodb://localhost:27017/";
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

  var dbo = db.db("emp_data");

  dbo.collection("records").insertMany(excelData.Customers, (err, res) => {
	if (err) throw err;

	console.log("Number of documents inserted: " + res.insertedCount);
	db.close();
  });
});

 res.redirect("/admin");

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



app.post("/foods" ,async(req,res)=>{

	 try{
    	const employee= new food({
    		employee_name:req.body.e_name,
			employee_id:req.body.e_id,
			meal_type:req.body.type,
			item_name:req.body.name,
			quantity:req.body.qty,
	    	rate:req.body.amt,
			total:req.body.total
    	})
		const registered=await employee.save();
		res.status(201).render("login");
	 }catch(error){
      res.status(404).send("error");
    }
});















app.get("*",(req,res)=>{
	res.send("Error 404");
});
app.listen(port,()=>{
	console.log("Server is listening at port:" + port);
});
