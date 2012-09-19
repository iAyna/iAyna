

var $ = jQuery.noConflict();
var myslider = null; 
var checkcustomer = false;
var catId = "";
var searchW ="";
if (navigator.userAgent.match(/(BlackBerry)/)) {
$(document).ready(function() { document.body.style.height = screen.height + 'px';});
}

$(window).load(function() {
	  
	//Change Language Button
	var loc = document.location +""; 
	var langloc = "";
	if( loc.indexOf("/en/") > -1 )
		langloc = loc.replace("/en/" , "/ar/");
	else
		langloc = loc.replace("/ar/" , "/en/");
		
	$("#changeLangButton").attr("href",langloc);

	$('.panels_slider').flexslider({
	animation: "slide",
	directionNav: false,
	controlNav: true, 
	animationLoop: false,
	slideToStart: 1,
	animationDuration: 300, 
	slideshow: false,	 
	start:function(slider){
		myslider  =slider;
	},
	after: function(slider) {
        if(slider.currentSlide == 0 || slider.currentSlide ==2)
		{
			document.getElementById("home").style.height = "auto";
			$("#home > .ui-page").css("height","auto");
			
		}else
		{ 
			document.getElementById("home").style.height =   "100%";
			$("#home > .ui-page").css("height","100%");
		}
      }
	});
	
	var langTmp = getParameterByName("lang");
	if(langTmp == "ar")
	{
		myslider.flexAnimate(myslider.getTarget('next'), true);	
	}
	else if(langTmp == "en")
	{
		myslider.flexAnimate(myslider.getTarget('prev'), true);	
	}
	
});
function seeView(target)
{
	if(myslider)
	{
		 myslider.flexAnimate(myslider.getTarget(target), true);	
	}	
}

function seeEng()
{
	if(myslider)
	{
		if (myslider.currentSlide == 1)
		{ 
			myslider.flexAnimate(myslider.getTarget('prev'), true);	
		}
		else if (myslider.currentSlide == 2)
		{ 
			myslider.flexAnimate(0, true);	
			//myslider.flexAnimate(myslider.getTarget('prev'), true);			
		}
	}
}


function seeArc()
{
	if(myslider)
	{
		if (myslider.currentSlide == 0)
		{ 
			myslider.flexAnimate(2, true);		
		}
		else if (myslider.currentSlide == 1)
		{ 
			myslider.flexAnimate(myslider.getTarget('next'), true);		
		}
	}
}

function findlang(sender)
{
	var a = $(sender).attr("action");
	var re = /[a-zA-Z0-9 _]+/;
	var v = $("#searchtext").val();
	
	if(v.length < 3)
	{
		return false;	
	}
	
	if(!re.test(v))
	{
		a = a.replace("en/search","ar/search");
		
		$(sender).attr("action",a)
	}
}

function openshare()
{
	var h = $("#share_cont").html();
}

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
$(window).load(function() {
   $("body").removeClass("home");
   $("body").addClass("homeiphone");
  // $("#sharebutton"

});
}

if(!navigator.userAgent.match(/Android/i)) {
$(window).load(function() {
   $("#sharebutton").hide();

});
}

/* API handler */



function getCustomerPage(id , date)
{
	
	$.getJSON("http://www.iayna.com/api/getcustomerpage/" + id,{lastupdate:date}, function(data){
		insertCustomerPage(data);
	});
}
/**********************************************************************************************************************************************/
/* Database handler */
var iAynaDB = null;
var nullDataHandler = null ;
//var errorHandler = null;

function errorHandler(e)
{
	alert("error in DB : " + e.msg );	
}

function initDatabase() {  
    try {  
        if (!window.openDatabase) {  
            alert('Databases are not supported in this browser.');  
        } else {  
            var shortName = 'iayna';  
            var version = '1.0';  
            var displayName = 'iAyna';  
            var maxSize = 204800000; //  bytes  
            iAynaDB = openDatabase(shortName, version, displayName, maxSize); 			
			createTables();  
        }  
    } catch(e) {  
  
        if (e == 2) {  
            console.log("Invalid database version.");  
        } else {  
            console.log("Unknown error "+e+".");  
        }  
        return;  
    }  
}  

function createTables(){  
    iAynaDB.transaction(  
        function (transaction) {  
		
			//transaction.executeSql('DROP TABLE categories ', [], nullDataHandler, errorHandler); 
		    //transaction.executeSql('DROP TABLE customers ', [], nullDataHandler, errorHandler); 
		    //transaction.executeSql('DROP TABLE tblreferences ', [], nullDataHandler, errorHandler); 
		    //transaction.executeSql('DROP TABLE tblsettings ', [], nullDataHandler, errorHandler); 
            transaction.executeSql('CREATE TABLE IF NOT EXISTS categories(id INTEGER NOT NULL PRIMARY KEY, name TEXT ,namear TEXT , isparent INTEGER, pid INTEGER , image TEXT , lastdate TEXT);', [], nullDataHandler, errorHandler);          	 
			transaction.executeSql('CREATE TABLE IF NOT EXISTS customers (id INTEGER NOT NULL PRIMARY KEY,name TEXT ,namear TEXT , cid INTEGER , content TEXT, contentar TEXT, lastdate TEXT);', [], nullDataHandler, errorHandler);  
			transaction.executeSql('CREATE TABLE IF NOT EXISTS tblreferences(id INTEGER NOT NULL PRIMARY KEY,name TEXT ,namear TEXT , cid INTEGER , content TEXT, contentar TEXT, lastdate TEXT);', [], nullDataHandler, errorHandler);      
			transaction.executeSql('CREATE TABLE IF NOT EXISTS tblsettings(skey TEXT NOT NULL PRIMARY KEY,value TEXT);', [], nullDataHandler, errorHandler);      
		}  
    );   
}

/********************************************************/
/*                     Categories                       */
/********************************************************/
function checkCategories()
{
	if(iAynaDB != null)
	iAynaDB.transaction(  
        function (transaction) {  
            transaction.executeSql("SELECT * FROM tblsettings where skey = 'categories_last_update'", [],  
                function (transaction, results)
				{
					if(results.rows.length > 0 )
					{  
						var row= results.rows.item(0);						
						loadHomeCats();						
						getCategories(row['value']);
					}
					else
					{						
						getCategories('0');												
					}
				} , errorHandler);  

        }  
    );
	
	
}

function getCategories(lastupdate)
{
	$.getJSON("http://www.iayna.com/api/getcategories/" + encodeURIComponent( lastupdate) , insertCategories );
}

function insertCategories(data)
{
	if(iAynaDB != null)
		iAynaDB.transaction(  
			function (transaction) { 
				if(data.categories)
				{ 
					$.each(data.categories, function(key, val) {
						if(val.is_active == "1")
							transaction.executeSql("INSERT OR REPLACE INTO categories(id, name, namear, isparent, pid,image,lastdate) VALUES (?, ?, ?, ?, ?, ?,?)", [val.id, val.name, val.namear, val.isparent, val.pid,val.img,val.lastupdate]);  			
						else
							transaction.executeSql("DELETE FROM categories WHERE id  = ? ", [val.id]);  			
						
					}); 
					
					saveSettings('categories_last_update', data.lastupdate ); 
					loadHomeCats(); 
				}
			}  
		);
	
}

function loadCategories()
{
	var cid = getParameterByName('cat');
	var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	var query = "SELECT * FROM categories where id = " + cid + " order by name";
	
	if(isarabic)
	{
		query = "SELECT * FROM categories where id = " + cid + " order by namear";
		
	}
	
	if(iAynaDB != null)
	iAynaDB.transaction(  
        function (transaction) { 
            transaction.executeSql(query , [],  
                function (transaction, results){  
					if(results.rows.length > 0 )
					{
						var row= results.rows.item(0);
						/********************/
						
						var imgsrc = "../images/categories/" +row['image'];
						$.get("../images/categories/" +row['image'],
						function(result){ 
							$("#catimage").attr("src",imgsrc );
						 })
						 .error(function(error) { 
						 	imgsrc = "http://iayna.com/user/images/categories/"+row['image'];
						 	$("#catimage").attr("src",imgsrc );
						 });//
						/*alert('here');
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
						   function(fileSys) {
							  
							   fileSys.root.getFile("android_asset/www/index.html", {create: false,
				exclusive: false},
								   function(fileEntry) {
									   alert(JSON.stringify(fileEntry));
									   
								   },
								   function(error) {
									   alert(JSON.stringify(error));
								   });
						   }, function(){alert('error');} );*/
						   /************/
						
						if(row['pid'] == "0")
						{
							if(isarabic)							
								$("#catBackButton").attr("href","../index.html?lang=ar" );
							else
								$("#catBackButton").attr("href","../index.html?lang=en" );
						}
						else
						{
							$("#catBackButton").attr("href","?cat=" + row['pid'] );
						}
						if(row['isparent'] == 1)
						{
							 
							iAynaDB.transaction(function (transaction) { 
									var catquery =  "SELECT * FROM categories where pid = " + row['id'] + " order by name;" ;
									if(isarabic)
									{
										catquery =  "SELECT * FROM categories where pid = " + row['id'] + " order by namear;" ;
									}
									
									transaction.executeSql(catquery, [],  
										function (transaction, subcategories){    
											var items = [];
											for (var i=0; i<subcategories.rows.length; i++)
											{
												 var row= subcategories.rows.item(i);
												 var n = row['name'];
												 if(isarabic) n = row['namear'];
												 items.push('<li id="' + row['name'] + '"><a rel="external" href="./cat.html?cat=' + row['id'] +'">' + n + '</a></li>');
											}  
										  $(".categories.english,.categories.arabic").html(items.join(''));
										} 
										, errorHandler);  
								}  
							);
						}
						else
						{
							checkCustomers(row['id']);
						}
					}
					
				}
				, errorHandler);  
        }  
    );
}

function loadHomeCats()
{
	
    iAynaDB.transaction(  
        function (transaction) {  
            transaction.executeSql("SELECT * FROM categories where pid = 0 order by name;", [],  
                function (transaction, results){  
				
					var items = [];
					for (var i=0; i<results.rows.length; i++)
					{
						 var row= results.rows.item(i);
						 
						 items.push('<li><a rel="external" href="en/cat.html?cat=' + row['id'] +'">' + row['name'] + '</a></li>');
					}  
				  $(".categories.english").html(items.join(''));
				}
				, errorHandler);  
				
				transaction.executeSql("SELECT * FROM categories where pid = 0 order by namear", [],  
                function (transaction, results){  
					var items = [];
					for (var i=0; i<results.rows.length; i++)
					{
						 var row= results.rows.item(i);
						 
						 items.push('<li><a rel="external" href="ar/cat.html?cat=' + row['id'] +'">' + row['namear'] + '</a></li>');
					}  
				  $(".categories.arabic").html(items.join(''));
				}
				, errorHandler); 
        }  
    );  
}

/********************************************************/
/*                     Customers                        */
/********************************************************/

function checkCustomers(cid)
{
	 var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	iAynaDB.transaction(  
        function (transaction) {  
            transaction.executeSql("SELECT * FROM customers where cid = " + cid , [],  
                function (transaction, results)
				{
					if(results.rows.length > 0 )
					{  		
						var lquery = "SELECT * FROM customers where cid = " + cid + " order by name;" ;
				if(isarabic)lquery = "SELECT * FROM customers where cid = " + cid + " order by namear;" ;									
						loadCustomers(lquery);					
						getCustomers(cid , results);
					}
					else
					{						
						getCustomers(cid , "");												
					}
				} , errorHandler);  

        }  
    );
}


function getCustomers(id , sendids)
{
	var ids = '';
	if(sendids != "")
	{
	 	var items = [];
		for (var i=0; i<sendids.rows.length; i++)
		{
			 var row= sendids.rows.item(i);
			 
			 items.push(row['id']);			
		}  
		ids = items.join(','); 
	}
	catId = id;
	$.getJSON("http://www.iayna.com/api/getcustomers/" + id + "/" + encodeURIComponent( ids ), insertCustomers );
}

function insertCustomers(data){ 
 var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
    iAynaDB.transaction(  
        function (transaction) {  
			$.each(data.customers, function(key, val) {
						transaction.executeSql("INSERT OR REPLACE INTO customers(id, name, namear, cid) VALUES (?, ?, ?, ?)", [val.id, val.name, val.namear, val.catid]);  			
			
			});  
			
			if(data.remove)
			{
				transaction.executeSql("DELETE FROM customers WHERE id in(" + data.remove + ")", []);  			
			}
			
			if(catId != null && catId !="")
			{
				var lquery = "SELECT * FROM customers where cid = " + catId + " order by name;" ;
				if(isarabic)lquery = "SELECT * FROM customers where cid = " + catId + " order by namear;" ;
				loadCustomers(lquery );
			}
			else if(searchW != "" )
			{
				loadCustomers("SELECT * FROM customers where name like '%" + searchW + "%' or namear like '%" + searchW +  "%' ;");
			}
        }  
    );  
}

function loadCustomers(query)
{
	var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	
	iAynaDB.transaction(function (transaction) {  
			transaction.executeSql(query, [],  
				function (transaction, results){ 

					if(results.rows.length > 0 )
					{  
						var items = [];
						for (var i=0; i<results.rows.length; i++)
						{
							 var row= results.rows.item(i);
							 var n = row['name'];
							 if(isarabic) n = row['namear'];
							 items.push('<li id="' + row['name'] + '"><a rel="external" href="./cus.html?cus=' + row['id'] +'">' + n + '</a></li>');
						}  
					  $(".categories.english ,.categories.arabic ").html(items.join(''));
					}
				}, errorHandler);  
	});
}



/********************************************************/
/*                     Settings                         */
/********************************************************/
function saveSettings(key,value)
{
	iAynaDB.transaction(  
        function (transaction) {  
			        transaction.executeSql("INSERT OR REPLACE INTO tblsettings(skey,value) VALUES (?, ?)", [key,value]);  			
        }  
    ); 
}

/********************************************************/
/*                     References                       */
/********************************************************/

function insertReference(data){  
    iAynaDB.transaction(  
        function (transaction) {  
		$.each(data, function(key, val) {
			        transaction.executeSql("INSERT OR REPLACE INTO tblreferences(id, name, namear, cid,lastdate) VALUES (?, ?, ?, ?,?)", [val.id, val.name, val.namear, val.catid,val.lastupdate]);  			
	  	});    
        }  
    );  
}

function loadReference()
{
	var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	var ref = getParameterByName('ref');
	iAynaDB.transaction(  
        function (transaction) {  
            transaction.executeSql("SELECT * FROM tblreferences where id =" + ref, [],  
                function (transaction, results)
				{
					if(results.rows.length > 0 )
					{  
						var row= results.rows.item(0);
						$("#cusBackButton").attr("href","./cus.html?cus=" + row['cid'] );
						if(isarabic)
						{
							$(".loadingcustomer").replaceWith( row['contentar'] );
						}
						else
						{
							$(".loadingcustomer").replaceWith( row['content'] );
						}
						/*
						if(row['content'] == null )
						{
							getCustomerPage( row['cid'] ,"");
						}
						else
						{
							$(".loadingcustomer").replaceWith( row['content'] );
						}
						*/
					}
				} , errorHandler);  

        }  
    );
}


/********************************************************/
/*                     Customer Page                    */
/********************************************************/

function loadCustomer()
{
	 var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	var id = getParameterByName("cus");
	iAynaDB.transaction(  
        function (transaction) { 
            transaction.executeSql("SELECT * FROM customers where id = " + id , [],  
                function (transaction, results)
				{
					if(results.rows.length > 0 )
					{  
						var row= results.rows.item(0);
						$("#cusBackButton").attr("href","./cat.html?cat=" + row['cid'] );
						
						
						if(isarabic)
							{
								$("#sharebutton").attr("subject",row['namear']).attr("text","http://iayna.com/ar/cus/" + encodeURIComponent(row['name']));
							}
							else
							{
								$("#sharebutton").attr("subject",row['name']).attr("text","http://iayna.com/cus/" + encodeURIComponent(row['name']));
							}
							
						if(row['content'] == null )
						{
							getCustomerPage( row['id'] ,row['lastupdate']);
						}
						else
						{
							if(isarabic)
							{
								$(".loadingcustomer").replaceWith( row['contentar'] );
							}
							else
							{
								$(".loadingcustomer").replaceWith( row['content'] );
							}
						}
					}
				}, 
				errorHandler);  
        }  
    );
}

function insertCustomerPage(data)
{
	iAynaDB.transaction(  
        function (transaction) {
			 
		//alert(data.content); //"update customers set content = ? ,contentar = ? , lastdate = ?  where id = ?"
		transaction.executeSql("INSERT OR REPLACE INTO customers (id ,name,namear,cid, content,contentar,lastdate) values (?,?,?,?,?,?,?)", [data.id ,data.name,data.namear,data.cid, data.content,data.contentar,data.lastupdate] ,function (t,r) {loadCustomer(data.id);
		/***********/
		
		iAynaDB.transaction(  
			function (transaction) { 
				$.each(data.ref, function(key, val) {
					 transaction.executeSql("INSERT OR REPLACE INTO tblreferences(id, name, namear,content,contentar, cid,lastdate) VALUES (?, ?, ?,?, ?,?,?)", [val.id, val.name, val.namear,val.content,val.contentar, val.cid,val.lastupdate]);  			
				});    
			}  
		);
		/************/
		
		
		} , errorHandler);
		
        }  
    ); 
}

/********************************************************/
/*                     Search                           */
/********************************************************/

function getSearchResult()
{
	var isarabic = (document.location.toString().indexOf("/ar/") > -1 )? true : false;
	var searchText = getParameterByName('search');
	searchW = searchText;
	loadCustomers("SELECT * FROM customers where name like '%" + searchW + "%' or namear like '%" + searchW +  "%' ;");
	$.getJSON("http://www.iayna.com/api/getsearchresult/" + encodeURIComponent( searchText ) , insertCustomers );
}






function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var Share = function() {};
            
Share.prototype.show = function(content, success, fail) {
    return cordova.exec( function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'Share', '', [content]);
};

cordova.addConstructor(function(){
    cordova.addPlugin('share', new Share());
});

function share(sender)
{
	var s = $(sender).attr('subject');
	var t = $(sender).attr('text');
	window.plugins.share.show({
    subject: "iAyna - Mobile Phone Directory: "+s,
    text: t},
    function() {}, // Success function
    function() {} // Failure function
);	
}


Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};
























