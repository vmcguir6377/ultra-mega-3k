var myInput = document.getElementById(psw);

var letter = document.getElementById(letter);

var capital = document.getElementById(capital);

var number = document.getElementById(number);

var length = document.getElementById(length)

myInput.onfocus = function() {

  document.getElementById(message).style.display = block;

}

myInput.onblur = function() {

  document.getElementById(message).style.display = none;

}

myInput.onkeyup = function() {

    var lowerCaseLetters = /[a-z]/g;

  if(myInput.value.match(lowerCaseLetters)) {

    letter.classList.remove(invalid);

    letter.classList.add(valid);

  } else {

    letter.classList.remove(valid);

    letter.classList.add(invalid);

}

var upperCaseLetters = /[A-Z]/g;

  if(myInput.value.match(upperCaseLetters)) {

    capital.classList.remove(invalid);

    capital.classList.add(valid);

  } else {

    capital.classList.remove(valid);

    capital.classList.add(invalid);

  }

  var numbers = /[0-9]/g;

  if(myInput.value.match(numbers)) {

    number.classList.remove(invalid);

    number.classList.add(valid);

  } else {

    number.classList.remove(valid);

    number.classList.add(invalid);

  }

  if(myInput.value.length >= 8) {

    length.classList.remove(invalid);

    length.classList.add(valid);

  } else {

    length.classList.remove(valid);

    length.classList.add(invalid);

  }

}


$(window).on('load', function() {
    $("#cover").hide();
 });


//Registration form
$(document).ready(function() {
    $("#signup").click(function() {
    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    if (name == '' || email == '' || password == '' || cpassword == '') {
    alert("Please fill in all fields.");
    } else if ((password.length) < 8) {
    alert("Password must be atleast 8 character in length.");
    } else if (!(password).match(cpassword)) {
    alert("Your passwords don't match. Try again.");
    } else {
    $.post("http://10.0.0.16:8814/signup", {
    name1: name,
    email1: email,
    password1: password
    }, function(data) {
    if (data == 'You have Successfully Registered.') {
    $("form")[0].reset();
    }
    alert(data);
    });
    }
    });
    });

//Authentication form
var username = $("input#username").val();$(".hidden").attr("placeholder", "UserName");;
    var password = $("input#password").val();$(".hidden").attr("placeholder", "Password");
    
    
    function make_base_auth(user, password) {
      var register = user + ':' + password;
      var hash = Base64.encode(register);
      return "Basic " + hash;
    }
    $.ajax
      ({
        type: "GET",
        url: "http://10.0.0.16:8814/api/",
        dataType: 'json',
        async: false,
        data: '{"userName": "' + username + '", "passWord" : "' + password + '"}',
        success: function (){
        alert('You are now logged in.');
        }
    });

/*References-
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
*/

//create variables in our namespace. always do this so you know what you are using later
_APIURL ="http://10.0.0.16:8814/api/";
cap = {
  parent: null,
  container: null,
  employeeGrid: null,
  employeeGridData:[]
  //static options for the gridview this way if you open it up again, you dont get old variables. 
 
}

//now make your method and event properties within your namespace
cap.methods = {
  pageLoad: async Parent => {
    try {
      //parent variable is what control we use as our wrapper for our container
      cap.parent = $(Parent)
      //define our container and add it to the parent
      cap.container = $('<div>').appendTo(cap.parent)
      //load employee grid
      await cap.methods.showEmployeeGridView();
      return;
    } catch (err) {
      cap.events.onError(err)
      return
    }
  },
  showEmployeeGridView: async () => {
    try {
      await cap.methods.hideContainer();
      
      //remove old if already exists
        if(cap.employeeGrid!==null){
            cap.employeeGrid.dispose();
            cap.employeeGrid.element().remove();
        }
        cap.methods.emptyContainer();
//render a new gridview and assign the instance to the variable
       cap.employeeGrid = 
       $('<div>')
       .appendTo(cap.container)
       .dxDataGrid(
        {
            columnHidingEnabled: true,
            editing:{
            /*editRowKey:'',*/
            allowAdding:true,
            allowUpdating: true,
            allowDeleting: true,
            mode:'popup',
            useIcons: true
            
            
        },
        allowColumnResizing: true,
        showBorders: true,
        columnResizingMode: 'nextColumn',
        columnMinWidth: 50,
        columnAutoWidth: true,
        showBorders: true,
        /*keyExpr:'inx',*/
        scrolling: {
            mode: 'virtual',
          },
        paging: {
            enabled: false,
          },
        dataSource: new DevExpress.data.CustomStore({
                load:(opts)=>{
                    return cap.methods.get("allEmployees");
                },
                update:(data, info)=>{
                    debugger
                      return cap.methods.post("allEmployees",Object.assign({},data, info))
                },
                remove:(data, info)=>{
                    debugger
                    return cap.methods.delete(`allEmployees`,data);
                },
                insert:(data, info)=>{
                    debugger
                      return cap.methods.post("allEmployees",Object.assign({},data, info))
                },
            }),
            columns:[
                {
                    "type": "buttons",
                    "buttons":["edit","delete"]
                },
                {
                    "dataField": "inx",
                    visible:false,
                    formItem:{
                        visible:false
                    }
                },
                {
                    "dataField": "mdsUsername"
                },
                {
                    "dataField": "mdsPassword"
                },
                {
                    "dataField": "firstName"
                },
                {
                    "dataField": "lastName"
                },
                {
                    "dataField": "address"
                },
                {
                    "dataField": "city"
                },
                {
                    "dataField": "state"
                },
                {
                    "dataField": "zip"
                },
                {
                    "dataField": "phone"
                },
                {
                    "dataField": "workPhone"
                },
                {
                    "dataField": "email"
                },
                {
                    "dataField": "workEmail"
                },
                {
                    "dataField": "districtName"
                },
                {
                    "dataField": "regionName"
                },
                {
                    "dataField": "role"
                },
                {
                    "dataField": "mdsEid"
                },
                {
                    "dataField": "externalId"
                },
                {
                    "dataField": "active",
                    formItem:{
                        editorOptions:{value:false}
                    }
                },
                {
                    "dataField": "supervisorId"
                },
                {
                    "dataField": "clearanceLevel"
                },
                {
                    "dataField": "dateAdded"
                },
                {
                    "dataField": "payType"
                },
                {
                    "dataField": "payTier"
                },
                {
                    "dataField": "payTierMultiplier"
                },
                {
                    "dataField": "emailGroup"
                }
            ]
        }
       ).dxDataGrid('instance')
      await cap.methods.showContainer();
      return;
    } 
    catch (err) {
      cap.events.onError(err)
    }
  },
 
  //clear our container so we can do something else
  hideContainer: () => {
    return new Promise((resolve, reject) => {
      try {
        cap.container.animate({ opacity: 0 }, 800, () => {
          resolve()
        })
      } catch (err) {
        cap.events.onError(err)
        reject(err)
      }
    })
  },
  //clear all contents in our container
  emptyContainer: () => {
    try {
      cap.container.empty()
    } catch (err) {
      cap.events.onError(err)
      reject(err)
    }
  },
  //fade container back in
  showContainer: () => {
    return new Promise((resolve, reject) => {
      try {
        cap.container.animate({ opacity: 1 }, 800, () => {
          resolve()
        })
      } catch (err) {
        cap.events.onError(err)
        reject(err)
      }
    })
  },
  //inform the user of general information
  showMessage: message => {
    DevExpress.ui.notify(message, 'info', 3000)
  },
  delete:(endpoint, data)=>{
    return new Promise((resolve, reject) => {
        try {
          var settings = {
              "url": `${_APIURL}${endpoint}/${data.inx}`,
              "method": "DELETE"
            };
            
            $.ajax(settings).done(function (response) {
              resolve('success');
            }).fail((err)=>reject(err))
  
        } catch (err) {
            cap.events.onError(err);
            reject(err);
        }
      })
  },
  //post something to the api
  post: (endpoint, data) => {
    return new Promise((resolve, reject) => {
      try {
        var settings = {
            "url": `${_APIURL}${endpoint}`,
            "method": "POST",
            "data": data,
          };
          
          $.ajax(settings).done(function (response) {
            resolve('success');
          }).fail((err)=>reject(err))

      } catch (err) {
          cap.events.onError(err);
          reject(err);
      }
    })
  },
  //get something from api
  get: endpoint => {
    return new Promise((resolve,reject)=>{
        $.get(`${_APIURL}${endpoint}`)
        .then((res)=>{resolve(res)})
        .catch((err)=>{reject(err)})
    });
    }
}
cap.events = {


  //all errors will call this event.
  onError: err => {
    try {
      DevExpress.ui.notify(err.message, 'error', 2000)
      console.log(err);
    } catch (err) {
      console.log(err)
    }
  },
  //all success messages will call this event. if no msg, it will not show anything to the user
  onSuccess: (msg = null) => {
    if (msg === null) {
      console.log('success - hidden from user')
      return
    }
    DevExpress.ui.notify(msg, 'success', 3000)
    console.log(msg + '  success - shown to user')
  }
}

//to detect when the webpage has completely loaded, we use jquery load event like so:
$(() => {
  try {
    //html page has finished loading, so add our content and kick off our app.
    let parent = 'body';
    cap.methods.pageLoad(parent);
  } catch (err) {
    cap.events.onError(err)
  }
})
