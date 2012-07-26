var $ = jQuery.noConflict();
var myslider = null; 
var checkcustomer = false;

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
});

$(document).ready(function(){
    $("a[rel^='prettyPhoto']").prettyPhoto({
		allow_resize: true, /* Resize the photos bigger than viewport. true/false */
		default_width: "70%"	
	});
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
function getCats()
{
	
	 var items = [];
	$.getJSON("http://www.iayna.com/api/getcategories", function(data){
		
		createTables();
		prePopulate(data);
	});
}

function getCus(id)
{
	 var items = [];
	$.getJSON("http://www.iayna.com/api/getcustomers/" + id, function(data){
		insertCustomers(data);
		
		loadCustomers(id);
	});
}

function getCustomerPage(id , date)
{
	
	$.getJSON("http://www.iayna.com/api/getcustomerpage/" + id,{lastupdate:date}, function(data){
		insertCustomerPage(data);
		loadCustomer(id);
		
	});
}
/************************************************************************************************/
/* Database handler */
var iAynaDB = null;
var nullDataHandler = null ;
//var errorHandler = null;

function errorHandler(e)
{
	alert("error in DB : " + e.message );	
}
function initDatabase() {  
    try {  
        if (!window.openDatabase) {  
            alert('Databases are not supported in this browser.');  
        } else {  
            var shortName = 'iayna';  
            var version = '1.0';  
            var displayName = 'iAyna';  
            var maxSize = 100000; //  bytes  
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
		
		   //transaction.executeSql('DROP TABLE categories', [], nullDataHandler, errorHandler); 
		   //transaction.executeSql('DROP TABLE customers', [], nullDataHandler, errorHandler); 
		   //transaction.executeSql('DROP TABLE tblreferences', [], nullDataHandler, errorHandler); 
		    //transaction.executeSql('DROP TABLE tblsettings', [], nullDataHandler, errorHandler); 
            transaction.executeSql('CREATE TABLE IF NOT EXISTS categories(id INTEGER NOT NULL PRIMARY KEY, name TEXT ,namear TEXT , isparent INTEGER, pid INTEGER , image TEXT , lastdate TEXT);', [], nullDataHandler, errorHandler);          	 
			transaction.executeSql('CREATE TABLE IF NOT EXISTS customers (id INTEGER NOT NULL PRIMARY KEY,name TEXT ,namear TEXT , cid INTEGER , content TEXT, lastdate TEXT);', [], nullDataHandler, errorHandler);  
			transaction.executeSql('CREATE TABLE IF NOT EXISTS tblreferences(id INTEGER NOT NULL PRIMARY KEY,name TEXT ,namear TEXT , cid INTEGER , content TEXT, lastdate TEXT);', [], nullDataHandler, errorHandler);      
			transaction.executeSql('CREATE TABLE IF NOT EXISTS tblsettings(key TEXT NOT NULL PRIMARY KEY, TEXT);', [], nullDataHandler, errorHandler);      
		}  
    );   
}

function prePopulate(data){  
    iAynaDB.transaction(  
        function (transaction) {  
		$.each(data, function(key, val) {
			        transaction.executeSql("INSERT OR REPLACE INTO categories(id, name, namear, isparent, pid,image,lastdate) VALUES (?, ?, ?, ?, ?, ?,?)", [val.id, val.name, val.namear, val.isparent, val.pid,val.img,val.lastupdate]);  			
	  	});    
        }  
    );  
}

function insertCustomers(data){  
    iAynaDB.transaction(  
        function (transaction) {  
		$.each(data, function(key, val) {
			        transaction.executeSql("INSERT OR REPLACE INTO customers(id, name, namear, cid,lastdate) VALUES (?, ?, ?, ?,?)", [val.id, val.name, val.namear, val.catid,val.lastupdate]);  			
	  	});    
        }  
    );  
}

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
						$(".loadingcustomer").replaceWith( row['content'] );
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
function loadHomeCats()
{
    iAynaDB.transaction(  
        function (transaction) {  
            transaction.executeSql("SELECT * FROM categories where pid = 0 order by name;", [],  
                dataSelectHandler, errorHandler);  
				
				transaction.executeSql("SELECT * FROM categories where pid = 0 order by namear", [],  
                dataSelectCategoryHandlerar, errorHandler); 
        }  
    );  
}

/* Helper */
function loadCats()
{
	var cid = getParameterByName('cat');
	
	iAynaDB.transaction(  
        function (transaction) { 
            transaction.executeSql("SELECT * FROM categories where id = " + cid , [],  
                function (transaction, results){  
					if(results.rows.length > 0 )
					{
						var row= results.rows.item(0);
						$("#catimage").attr("src", "../images/categories/" +row['image']);
						if(row['pid'] == "0")
						{
							$("#catBackButton").attr("href","../index.html" );
						}
						else
						{
							$("#catBackButton").attr("href","?cat=" + row['pid'] );
						}
						if(row['isparent'] == 1)
						{
							 
							iAynaDB.transaction(function (transaction) {  
									transaction.executeSql("SELECT * FROM categories where pid = " + row['id'] + ";", [],  
										loadSubCategories, errorHandler);  
								}  
							);
						}
						else
						{
							loadCustomers(row['id']);
						}
					}
					
				}
				, errorHandler);  
        }  
    );
}

function dataSelectHandler(transaction, results){  
  
	var items = [];
    for (var i=0; i<results.rows.length; i++)
	{
		 var row= results.rows.item(i);
		 
		 items.push('<li><a rel="external" href="en/cat.html?cat=' + row['id'] +'">' + row['name'] + '</a></li>');
    }  
  $(".categories.english").html(items.join(''));
}

function dataSelectCategoryHandlerar(transaction, results){  
  
 
	var items = [];
    for (var i=0; i<results.rows.length; i++)
	{
		 var row= results.rows.item(i);
		 
		 items.push('<li><a rel="external" href="ar/cat.html?cat=' + row['id'] +'">' + row['namear'] + '</a></li>');
    }  
  $(".categories.arabic").html(items.join(''));
}
  



function loadSubCategories(transaction, results){    
	var items = [];
    for (var i=0; i<results.rows.length; i++)
	{
		 var row= results.rows.item(i);
		 
		 items.push('<li id="' + row['name'] + '"><a rel="external" href="./cat.html?cat=' + row['id'] +'">' + row['name'] + '</a></li>');
    }  
  $(".categories.english").html(items.join(''));
} 

function loadCustomers(cid)
{
	
	iAynaDB.transaction(function (transaction) {  
			transaction.executeSql("SELECT * FROM customers where cid = " + cid + ";", [],  
				loadCustomersResult, errorHandler);  
		}  
	);
}
function loadCustomersResult(transaction, results){ 
	
	
	if(results.rows.length > 0 )
	{  
		var items = [];
		for (var i=0; i<results.rows.length; i++)
		{
			 var row= results.rows.item(i);
			 
			 items.push('<li id="' + row['name'] + '"><a rel="external" href="./cus.html?cus=' + row['id'] +'">' + row['name'] + '</a></li>');
		}  
	  $(".categories.english").html(items.join(''));
	  
	}
	else if(!checkcustomer)
	{
		var cid = getParameterByName('cat');
		checkcustomer = true;
		
		getCus(cid);
	}
} 

function loadCustomer()
{
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
						$("#sharebutton").attr("subject",row['name']).attr("text","http://iayna.com/cus/" + encodeURIComponent(row['name']));
						if(row['content'] == null )
						{
							getCustomerPage( row['id'] ,"");
						}
						else
						{
							$(".loadingcustomer").replaceWith( row['content'] );
						}
					}
				}, 
				errorHandler);  
        }  
    );
}

function dataSelectCustomerpage(transaction, results)
{
	if(results.rows.length > 0 )
	{  
		var row= results.rows.item(0);
		$("#cusBackButton").attr("href","./cat.html?cat=" + row['cid'] );
		$("#sharebutton").attr("subject",row['name']).attr("text","http://iayna.com/cus/" + encodeURIComponent(row['name']));
		if(row['content'] == null )
		{
			getCustomerPage( row['id'] ,"");
		}
		else
		{
			$(".loadingcustomer").replaceWith( row['content'] );
		}
	}
}

function insertCustomerPage(data)
{
	iAynaDB.transaction(  
        function (transaction) {  
		transaction.executeSql("update customers set content = ? , lastdate = ?  where id = ?", [data.content,data.lastupdate, data.id] ,nullDataHandler, errorHandler);
		$.each(data.ref, function(key, val) {
			 transaction.executeSql("INSERT OR REPLACE INTO tblreferences(id, name, namear,content, cid,lastdate) VALUES (?, ?, ?, ?,?,?)", [val.id, val.name, val.namear,val.content, val.cid,val.lastupdate]);  			
	  	});    
        }  
    ); 
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

























