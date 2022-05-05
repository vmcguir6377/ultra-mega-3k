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
                allowAdding: false,
                allowUpdating: true,
                allowDeleting: true,
                mode: 'popup',
                useIconS: true
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
              scrolling: {
                mode: 'virtual',
              },
              columnResizingMode: 'nextColumn',
              columnMinWidth: 50,
              columnAutoWidth: true,
              showBorders: true,
              /*keyExpr:'inx',*/

              paging: {
                enabled: false,
              },
              dataSource: new DevExpress.data.CustomStore({
                load: (opts) => {
                  return cap.methods.get("allEmployees");
                },
                update: (data, info) => {
                  debugger
                  return cap.methods.post("allEmployees", Object.assign({}, data, info))
                },
                remove: (data, info) => {
                  debugger
                  return cap.methods.delete(`allEmployees`, data);
                },
                insert: (data, info) => {
                  debugger
                  return cap.methods.post("allEmployees", Object.assign({}, data, info))
                },
              }),
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Search"
              },
              columns: [
                {
                  "type": "buttons",
                  "buttons": ["edit"],
                  visible: true
                },
                {
                  "dataField": "inx",
                  visible: false,
                  formItem: {
                    visible: false
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
                      editorOptions:{value:false}
                  }
                }
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
