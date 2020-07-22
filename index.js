var express=require("express");
var app=express();
var mysql=require("mysql");
var bodyParser=require("body-parser");
app.set("view engine","ejs"); 
var method=require("method-override")("_method");
app.use(method);
 app.use(bodyParser.urlencoded({extended:true}));
 var con = mysql.createConnection({
   host: "localhost",
  user: "pradhumn",
  password: "root",
  database:"login"
});
 
  app.get("/",function(req,res){
  
  res.redirect("/create");
 });
  app.get("/create",function(req,res){
  
 	res.render("first_page.ejs");
 });
  function myfunction(){
    var sixdigitsrandom = Math.floor(100000 + Math.random() * 900000);
    return sixdigitsrandom;
  }
 app.post("/create",function(req,res){
	var person={
	PersonID:myfunction(),
  FirstName:req.body.firstname ,
  LastName:req.body.lastname , 
  email:req.body.email ,
  phone:req.body.phone ,
  Address:req.body.address
	};
	con.query('INSERT INTO Persons SET ?',person,function(err,result){
		if(err) res.redirect("/create");
		res.redirect("/all");
	});
});
 app.get("/all",function(req,res){
	 con.query(`SELECT * FROM Persons`, function (err, data) {
    if (err) res.send(err);
    res.render('allusers.ejs', { title: 'User List', userData: data}); 
  });
});
 app.get("/search",function(req,res){
res.render("search.ejs");
});
app.post("/search",function(req,res){
  
 con.query(`SELECT * FROM Persons WHERE phone='${req.body.phone}'`, function (err, data) {
    if (err) res.send(err);
    res.render('userlist.ejs', { title: 'User List', userData: data}); 
  });
});

app.delete('/all', function (req, res) {                                                       
   con.query(`DELETE FROM Persons WHERE PersonID=${req.body.id}` , function (err,data) {
    if (err) res.send(err);
    res.redirect("/all");
  });
});
app.get("/update",function(req,res){
res.render("update.ejs");
});
app.put("/update", function(req,res){
con.query(`update Persons set FirstName=?, LastName=? ,email=? ,phone=? , Address=? where PersonID=?`,[req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address,req.body.id], function(err,result){
if(err) console.log(err);
else
res.redirect("/all");
});
});
app.get("/copy/:id",function(req,res){
 con.query(`SELECT * FROM Persons WHERE PersonID='${req.params.id}'`, function (err, result) {
  if (err) res.send(err);
  var pr=result; 
  con.query('INSERT INTO Persons SET ?',pr,function(err,result){
    if(err) console.log(err)
      res.redirect("/all");
  });

});
});
  app.listen(3000,function(){
 	console.log("hey there");
 }); 