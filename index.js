/*
References-
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
*/
/*;*/
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
      //parent variable is what control we shall use as our wrapper for our container
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
              grouping: {
                contextMenuEnabled: true
              },
              groupPanel: {
                visible: true,
                allowColumnDragging: true,
              },
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Search"
              },
              export: {
                enabled: true
              },
              onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('Employee Data');
                DevExpress.excelExporter.exportDataGrid({
                  worksheet: worksheet,
                  component: e.component,
                  customizeCell: function (options) {
                    var excelCell = options;
                    excelCell.font = { name: 'Arial', size: 12 };
                    excelCell.alignment = { horizontal: 'left' };
                  }
                }).then(function () {
                  workbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
                  });
                });
                e.cancel = true;
              },
           
                columnHidingEnabled: true,
                editing: {
                /*editRowKey:'inx',*/
                allowExporting: false,
                allowAdding: true,
                mode: 'popup',
                allowUpdating: true,
                export: true,
                allowDeleting: true,
                useIcons: true,
                allowColumnResizing: true,
                showBorders: true,
                showDropDownButton: true,
                filterRow: {
                  visible: true
                },
                
                function() {
                  $("#emailButton").dxButton({
                    icon: "email",
                    text: "Contact",
                    onClick: function () {
                      "parent.location='mailto:vmcguire@unitedlocating.com'"
                    },
                  });
                },
              },
             
              columnResizingMode: 'nextColumn',
              columnChooser: {
                enabled: true,
              },
              columnMinWidth: 50,
              columnAutoWidth: true,
              showBorders: true,
              /*keyExpr:'inx',*/
              scrolling: {
                enabled: false
              },
              pager: {
                visible: true,
                allowedPageSizes: [5, 20, 50, 100, 'all'],
                showPageSizeSelector: true,
                showInfo: true,
                showNavigationButtons: true,
               
              },
           
              //this works as an in grid add employee button but it deletes the search, export, and group/sort functions and icons.
              /*toolbar: { 
                items: [
                  {
                    widget: 'dxButton',
            options: {
            text: 'Add Employee',
            width: 136,
           onClick: function () {  
       $("#employeeGrid").dxDataGrid('instance').addRow();  
    }  
},
            },
            
            ],
            },*/
            
              dataSource: new DevExpress.data.CustomStore({
                load: (opts) => {
                  return cap.methods.get("allEmployees");
                },
                update: (data, info) => {
                  debugger
                  return cap.methods.put("allEmployees", Object.assign({}, data, info))
                },
                remove: (data, info) => {
                  debugger
                  return cap.methods.delete(`allEmployees`,Object.assign({}, data, info));
                },
                insert: (data, info) => {
                  debugger
                  return cap.methods.post("allEmployees", Object.assign({}, data, info))
                },
              }),

                columns: [
                {
                  "dataField": "inx",
                  visible: true,
                  formItem: {
                    visible: true
                  }
                },
                
                  //for this and the license bit type field, there are a lot of bugs. If you leave this form item entry, you have to 
                  //uncheck the active box to get the insert route to work. If i made it a default of false, I'd have to check it to 
                  //get the route to work. if you take out the form item altogether, you cannot change the box status.
                
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
                  "dataField": "workEmail"
                },
                {
                  "dataField": "regionName"
                },
                {
                  "dataField": "districtName"
                },
                {
                  "dataField": "email"
                },
                {
                  "dataField": "role"
                },
                {
                "dataField": "active",
                formItem: {
                  editorOptions: { value: false },
                },
              },
              {
                "dataField": "licenses",
                formItem: {
                  editorOptions: { value: false },
                },
              },
             
                {
                  "dataField": "mdsEid"
                },
                {
                  "dataField": "externalId"
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
                  "dataField": "ADP",
                  formItem: {
                    editorOptions: { value: true },
                  }
                },
                {
                  "dataField": "OQ",
                  formItem: {
                    editorOptions: { value: true },
                  }
                },
                {
                  "dataField": "Asset",
                  formItem: {
                    editorOptions: { value: true },
                  }
                },
                {
                  "dataField": "GPS",
                  formItem: {
                    editorOptions: { value: true },
                  }
                },
                {
                  "dataField": "WEX",
                  formItem: {
                    editorOptions: {
                      checked: { value: true },
                      unchecked: { value: false},
                  }
                }
              },
                {
                  "dataField": "MDS",
                  formItem: {
                    editorOptions: { value: false },
                  }
                },
              ]
            },
          
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
        }).fail((err) => reject(err))

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
        }).fail((err) => reject(err))

      } catch (err) {
        cap.events.onError(err);
        reject(err);
      }
    })
   
  },
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



