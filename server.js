const express = require('express')
const cors = require('cors')
const app = express();


var XLSX = require("xlsx");

const multer = require('multer');
const path = require("path") 
const fs = require('fs')

const axios = require('axios')




var currentPath = '';


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
  currentPath = Date.now() + file.originalname
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage})

// View Engine Setup 
app.set("views",path.join(__dirname,"views")) 
app.set("view engine","ejs")




var CommerceSDK = require ('./commerce-rest');

// var mySDK = new CommerceSDK({

//     hostname : 'https://ccadmin-z1na.oracleoutsourcing.com', //urls values could be 'http://mycommercestore.com:9080' or 'mycommercestore.com'
//     apiKey : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmNDVhNWEwYy0wZGM2LTQ5NWItODYyZi03NjE4ZjYzNDgxYWMiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE2MjEzMjUwMTIsImlhdCI6MTU4OTc4OTAxMn0=.gk+va5E/0Gyr2yk+nIdIDQB7vJrNhsT0G6jKRL5sfzo=ey'
// });

   //dev env
// var mySDK = new CommerceSDK({

//   hostname : 'https://a7892050c1dev-admin.occa.ocs.oraclecloud.com', //urls values could be 'http://mycommercestore.com:9080' or 'mycommercestore.com'
//   apiKey : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5M2QyMTBhNy1jY2MxLTQ0YjMtODMxNC03MGIyN2RhYTQ4MWEiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE2MzAxMjU4NDMsImlhdCI6MTU5ODU4OTg0M30=.zHJ8QG4oa8QkhbqTvPEYqzDDWuQ1Y4DDvGU/gVpyKwQ='
// });

   //test env
var mySDK = new CommerceSDK({
 
  hostname : 'https://a7892050c1prd-admin.occa.ocs.oraclecloud.com', 

  apiKey : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4Njc0YWQxNi0yY2QzLTQ5ODItOWUwOC05ZjFlNzNhYjE3ZDUiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE2MzY0NDQ4NzUsImlhdCI6MTYwNDkwODg3NX0=.nFllOfE37DKVEkQCPIy3gdHVHMAbtxk3zNLwZowuwoM='
});


const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

app.get("/uploadFile",function(req,res){ 
  res.render("Signup"); 
})


app.get('/', function (req, res) {
  res.render("Signup"); 
  })


//excel read 
app.post('/v1/getDocument', upload.single('productExcel'),function (req, res) {
  console.log(req.file,'fileees')
  var workbook = XLSX.readFile('./uploads/'+currentPath);
  // var workbook = XLSX.readFile('Financial Sample.xlsx');
  console.log(workbook, 'data got')

  var sheet_name_list = workbook.SheetNames;
  console.log(sheet_name_list); // getting as Sheet1
  var data = [];

  sheet_name_list.forEach(function (y) {
    var worksheet = workbook.Sheets[y];
    //getting the complete sheet
    // console.log(worksheet);

    var headers = {};
    for (z in worksheet) {
      if (z[0] === "!") continue;
      //parse out the column, row, and value
      var col = z.substring(0, 1);
      //  console.log(col,'colll');

      var row = parseInt(z.substring(1));
      //  console.log(row,'rowww');

      var value = worksheet[z].v;
      //  console.log(value,'valueee');

      //store header names
      if (row == 1) {
        headers[col] = value;
        // storing the header names
        continue;
      }

      if (!data[row]) data[row] = {};
      data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    console.log(data, 'if any empty');
  });
  let finalResult = []
  let previous={};
  data.map((row,index)=>{
    for(var key in row){

         let splitKey = key.split(':');
          console.log(splitKey,'split key')
        //  let result = splitKey.reverse().reduce((res, key) => ({[key]: res}), {});
        //  console.log(result,'result')

        let result = {};
        let nestedObj = result;
          splitKey.forEach(name => {
            nestedObj[name] = {};
            nestedObj = nestedObj[name];
          });
          console.log(result,'result')
           finalResult.push(result)
         // finalResult = {...finalResult,...previous,...result}
  
          // finalResult = Object.assign(previous, result);
           //previous = result
        
        
    }
  })  

//  label1 :  for(let i=0;i<finalResult.length;i++) {
//    label2 : for(let j=0;j<finalResult.length;j++) {

//       let source = finalResult[i];
//       let obj = finalResult[j];

//         Object.keys(source).every(key =>{
//           if(obj.hasOwnProperty(key)){
//             console.log(obj,'property check');
//             source = { ...source, ...obj }
//             finalResult[i] = source
//           }

         

//         })

//       }
//    }

      // console.log(typeof(obj),'typeoff')
      // console.log(typeof(source),'typeoff')

      // console.log(obj,'value')
      // console.log(source,'value')


// if(obj && source){
//   var boolean =  Object.keys(source).every(key =>
//      {
//        console.log(key,'key');
//        console.log(obj.hasOwnProperty(key),'key2');

//        obj.hasOwnProperty(key) && obj[key] === source[key]
//       })
//    console.log(boolean, 'boolean ');
// }

   

 

    console.log(finalResult,'final result');
     res.send('Success')

});  


//order excel read
  //excel read 
app.post('/v1/getOrdersDocument', upload.single('orderExcel'),function (req, res) {
  console.log(req.file,'fileees')
  var workbook = XLSX.readFile('./uploads/'+currentPath);
  // var workbook = XLSX.readFile('Financial Sample.xlsx');
  console.log(workbook, 'data got');

  var sheet_name_list = workbook.SheetNames;
  console.log(sheet_name_list); // getting as Sheet1
  var data = [];

  let successOrder = []
  let errorOrder = []

  sheet_name_list.forEach(function (y) {
    var worksheet = workbook.Sheets[y];
    //getting the complete sheet
    // console.log(worksheet);

    var headers = {};
    for (z in worksheet) {
      if (z[0] === "!") continue;
      //parse out the column, row, and value
      var col = z.substring(0, 1);
      //  console.log(col,'colll');

      var row = parseInt(z.substring(1));
      //  console.log(row,'rowww');

      var value = worksheet[z].v;
      //  console.log(value,'valueee');

      //store header names
      if (row == 1) {
        headers[col] = value;
        // storing the header names
        continue;
      }

      if (!data[row]) data[row] = {};
      data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    console.log(data, 'if any empty');
  });


  //remove files
  let pathFile = './uploads/'+currentPath;

fs.unlink(pathFile, (err) => {
  if (err) {
    console.error(err)
    return
  }

  //file removed
}) 
 
 
  let promise = new Promise(function(resolve, reject) {


      for(let i=0;i<data.length;i++) {
        mySDK.put({
          data : {state: data[i].state},
          // https://a7892050c1dev-admin.occa.ocs.oraclecloud.com
          url: 'https://a7892050c1prd-store.occa.ocs.oraclecloud.com/ccadmin/v1/orders/'+data[i].id,
          callback: function (err, response) {
                  if (err) { 
                    errorOrder.push(String(data[i].id))
                    console.log('Got an error response from GET REQUEST' + err); 
                  } else if(response.id) {
                    successOrder.push(String(data[i].id))
                  } else {
                    errorOrder.push(String(data[i].id))
                  }
      
                  console.log(response,'response')
                  console.log(errorOrder,successOrder,'order')
                  console.log(data.length,i+1)

                        // if(data.length == i+1) {
                    //   resolve(true);
                    // }

                    if(errorOrder.length + successOrder.length == data.length) {
                      resolve()
                    }
                  
                }
              
        });

        axios.post('https://concepcion--tst1.custhelp.com/cgi-bin/concepcion.cfg/php/custom/update_order_to_fulfilled.php', {
            "auth_token":"4f1ccde0caaa3eb9a14680ed00e38313", "order_number": String(data[i].id)
          }).then(res => {
            console.log(res.data,'statusCode from now custom')
          }).catch(error => {
            console.log(error)
          })    
    
      }
  
  
    })

    promise.then(()=>{
      let result = {
        'Successful_Update_Orders': successOrder,
        'Error_Update_Orders': errorOrder
      }
    
      console.log(result,'result')
      res.send(result);
    })
  
  
  });
  






app.listen(port , (req,res)=>{
    console.log('server is running on '+port)
})



