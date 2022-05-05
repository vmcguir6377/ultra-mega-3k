/*
References-
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
*/
/*$(function () {
    $("#button").dxButton({
        icon: "floppy",
        text: "Archive",
        onClick: function() {
            alert("The Button was clicked");
        }
    });
});*/
//create variables in our namespace. always do this so you know what you are using later
_APIURL = "http://10.0.0.16:8814/api/";
cap = {
  parent: null,
  container: null,
  employeeGrid: null,
  employeeGridData: []
  //static options for the gridview this way if you open it up again, you dont get old variables. 

}

//now make your method and event properties within your namespace
cap.methods = {
  pageLoad: async Parent => {
    try {
      //parent varialbe is what control we shall use as our wrapper for our container
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
      if (cap.employeeGrid !== null) {
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
              editing: {
                /*editRowKey:'inx',*/
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                mode: 'popup',
                useIcons: true
              },
              grouping: {
                contextMenuEnabled: true
              },
              groupPanel: {
                visible: true,
                allowColumnDragging: true,
              },
              allowColumnResizing: true,
              showBorders: true,
              showDropDownButton: true,
              filterRow: {
                visible: true
              },
              function() {
                $("#emailButton").dxButton({
                    icon: "email",
                    text: "Contact"
                });
            },
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
                load: (opts) => {
                  return cap.methods.get("allEmployees");
                },
                update: (data, info) => {
                  debugger
                  return cap.methods.put("allEmployees",Object.assign({}, data, info))
                },
                remove:(data, info)=>{
                  debugger
                  return cap.methods.delete(`allEmployees`, data);
                },
                insert: (data, info)=>{
                  debugger
                  return cap.methods.post("allEmployees",Object.assign({},data, info))
                },
              }),
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Search"
              },
              columns:[
                {
                  "type": "buttons",
                  "width": 110,
                  "buttons": ["edit",{
                    hint: 'Email',
                    icon: 'email',
                  },
                   {
                     hint: 'Archive',
                  icon: 'copy'
                   
                    /*visible(e) {//******this is the code for the archive function, not worked out yet
                      return !e.row.isEditing;
                    },
                    disabled(e) {
                      return isChief(e.row.data.Position);
                    },
                    onClick(e) {
                      const clonedItem = $.extend({}, e.row.data, { ID: maxID += 1 });
          
                      employees.splice(e.row.rowIndex, 0, clonedItem);
                      e.component.refresh(true);
                      e.event.preventDefault();
                    },*/
                  }],
                },
                
                {
                  "dataField": "inx",
                  visible: true,
                  formItem: {
                    visible: true
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
                  formItem: {
                    editorOptions: { value: false }
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
                },
                {
                    "dataField": "licenses",
                    formItem:{
                        editorOptions:{ value:false }
                    }
                  }
                ]
              },
                


                  
                
           ) .dxDataGrid('instance')
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
  delete: (endpoint, data) => {
    return new Promise((resolve, reject) => {
      try {
        var settings = {
          "url": `${_APIURL}${endpoint}/${data.inx}`,
          "method": "DELETE"
        };

        $.ajax(settings).done(function (response) {
          resolve('success');
        }).fail((err) => reject(err))

      } catch (err) {
        cap.events.onError(err);
        reject(err);
      }
    })
  },
  put: (endpoint, data) => {
    return new Promise((resolve, reject) => {
      try {
        var settings = {
          "url": `${_APIURL}${endpoint}/${data.inx}`,
          "method": "PUT",
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
  //archive an entry:how do i grab an inx and send it out of this db and to a new one?? 
  /*archive: (endpoint, data) => {
    return new Promise((resolve, reject) => {
      try {
        var settings = {
          "url": `${_APIURL}${endpoint}/${data.inx}`,
          "method": "POST",POST to archiveData db
          "data": data,
        };
        var settings = {
          "url": `${_APIURL}${endpoint}`,
          "method": "POST",
          "data": data,
        };
        $.ajax(settings).done(function (response) {
          resolve('success');
        }).fail((err) => reject(err))
      } catch (err) {
        cap.events.onError(err);
        reject(err);*/
      
    
  
  //get something from api
  get: endpoint => {
    return new Promise((resolve, reject) => {
      $.get(`${_APIURL}${endpoint}`)
        .then((res) => { resolve(res) })
        .catch((err) => { reject(err) })
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
$(function () {
  $("#login").dxTextBox({
    name: "Login"
  }).dxValidator({
    validationRules: [
      { type: "required" }
    ]
  });

  $("#password").dxTextBox({
    name: "Password",
    mode: "password"
  }).dxValidator({
    validationRules: [
      { type: "required" }
    ]
  });

  $("#validateAndSubmit").dxButton({
    text: "Submit",
    type: "success",
    useSubmitBehavior: true
  });
});

$(() => {
  $('#custom-icon').dxSelectBox({
    items: simpleProducts,
    dropDownButtonTemplate() {
      return $('<img>', {
        src: './img/',
        class: 'custom-icon',
      });
    },
  });

 /* const $loadIndicator = $('<div>').dxLoadIndicator({ visible: false });
  const $dropDownButtonImage = $('<./img/triangle-down-256.webp.jpg>', {
    src: 'images/icons/custom-dropbutton-icon.svg',
    class: 'custom-icon',
  });

  $('#load-indicator').dxSelectBox({
    dropDownButtonTemplate(data, element) {
      $(element).append($loadIndicator, $dropDownButtonImage);
    },
    dataSource: {
      loadMode: 'raw',
      load() {
        const loadIndicator = $loadIndicator.dxLoadIndicator('instance');
        const d = $.Deferred();

        $dropDownButtonImage.hide();
        loadIndicator.option('visible', true);

        setTimeout(() => {
          d.resolve(simpleProducts);
          $dropDownButtonImage.show();
          loadIndicator.option('visible', false);
        }, 3000);
        return d.promise();
      },
    },
  });

  const dropDownButtonTemplate = function (selectedItem) {
    if (selectedItem) {
      return function () {
        return $('<img>', {
          src: `images/icons/${selectedItem.IconSrc}`,
          class: 'custom-icon',
        });
      };
    }
    return 'dropDownButton';
  };

  $('#dynamic-template').dxSelectBox({
    items: products,
    displayExpr: 'Name',
    showClearButton: true,
    valueExpr: 'ID',
    value: 1,
    itemTemplate(data) {
      return `<div class='custom-item'><img src='images/icons/${
        data.IconSrc}' /><div class='product-name'>${
        data.Name}</div></div>`;
    },
    onSelectionChanged(e) {
      e.component.option('dropDownButtonTemplate', dropDownButtonTemplate(e.selectedItem));
    },
  });
});*/});
