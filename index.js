/*
References-
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

*/


//Create variables in our namespace, always do this so you know what you are using later
_APIURL ="http://10.0.0.16:8814/api/";
cap = {
    parent: null,
    container: null,
    employeeGrid: null,
    employeeGridData:[]
    //static options for the gridview this way if you open it up again, you don't get old variables

}

//Now make your method and event properties within your namespace
cap.methods = {
    pageLoad: async Parent => {
        try {
            //parent variable is what control we use as our wrapper for our container
            cap.parent = $(Parent)
            //define our container and add it to parent
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
            //remove if already exists
            if(cap.employeeGrid!==null){
                cap.employeeGrid.dispose();
                cap.employeeGrid.element().remove();
            }
            cap.methods.emptyContainer();
            //Render a new gridview and assign the instance to the variable
            cap.employeeGrid =
            $('<div>')
            .appendTo(cap.container)
            .dxDataGrid(
                {
                    columnHidingEnabled: false,
                    editing: {
                        editRowKey: 'inx',
                        allowAdding:true,
                        allowDeleting:true,
                        allowUpdating:true,
                        
                        mode:'popup',
                        useIcons:true
                    },
                    allowColumnResizing:true,
                    showBorders:true,
                    columnResizingMode:'nextColumn',
                    columnMinWidth:50,
                    columnAutoWidth:true,
                    showBorders:true,
                    keyExpr:'inx',
                    scrolling: {
                        mode:'virtual',
                    },
                    paging: {
                        enabled:true,
                    },
                    dataSource: new DevExpress.data.CustomStore({
                        load:(opts)=>{
                            return cap.methods.get("allEmployees");
                        },
                        update:(data, info)=>{
                            debugger
                            return cap.methods.post("allEmployees",Object.assign({},data,info))
                        },
                        remove:(data, info)=>{
                            debugger
                            //check if this is effective
                            console.log("remove","test")
                            return cap.methods.delete("allEmployees",data);

                        },
                        //for this the db needs to generate the inx and add it into the record, do we need a separate function for this?*************************
                        insert:(data,info)=>{
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
                            dataField: "inx",
                            visible: false,
                            formItem:{
                                visible: false,
                            }
                        },
                        {
                            dataField: "mdsUsername",
                        },
                        {
                            dataField: "mdsPassword"
                        },
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        },
                        {
                            dataField: "address"
                        },
                        {
                            dataField: "city"
                        },
                        {
                            dataField: "state"
                        },
                        {
                            dataField: "zip"
                        },
                        {
                            dataField: "phone"
                        },
                        {
                            dataField: "workPhone"
                        },
                        {
                            dataField: "email"
                        },
                        {
                            dataField: "workEmail"
                        },
                        {
                            dataField: "districtName"
                        },
                        {
                            dataField: "regionName"
                        },
                        {
                            dataField: "role"
                        },
                        {
                            dataField: "mdsEid"
                        },
                        {
                            dataField: "externalId"
                        },
                        {
                            dataField: "active",
                            formItem:{
                                editorOptions:{value:false}
                            }
                        },
                        {
                            dataField: "supervisorId"
                        },
                        {
                            dataField: "clearanceLevel"
                        },
                        {
                            dataField: "dateAdded"
                        },
                        {
                            dataField: "payType"
                        },
                        {
                            dataField: "payTier"
                        },
                        {
                            dataField: "payTierMultiplier"
                        },
                        {
                            dataField: "emailGroup"
                        },
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
    
    //Clear our container so we can do something else
    hideContainer: () => {
        return new Promise((resolve, reject) => {
            try {
                cap.container.animate({ opacity: 0 }, 800, () => {
                    resolve()
                })
            } catch(err) {
                cap.events.onError(err)
                reject(err)
            }
        })
    },

   
    //Clear all contents in the container
    emptyContainer: () => {
        try {
            cap.container.empty()
        } catch (err) {
            cap.events.onError(err)
            reject(err)
        }
    },
    //Fade container back in
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
    showMessage: message => {
        DevExpress.ui.notify(message, 'info', 3000)
    },
    
    //Post something to the api
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
    //Remove something from api
    delete:(endpoint, data)=> {
        return new Promise((resolve, reject) => {
            try {
                var settings = {
                    "url": `${_APIURL}${endpoint}/${data.inx}`,
                    "method": "DELETE",
                    
                };

                $.ajax(settings).done(function (response) {
                    resolve('success');
                }).fail((err)=>reject(err))
                console.log("remove","test")
                //console.logs are working, still only triggered after clicking edit icon though
            } catch (err) {
                cap.events.onError(err);
            }
        })
    },
    //Get something from api
    get: endpoint => {
        return new Promise((resolve, reject) => {
            $.get(`${_APIURL}${endpoint}`)
            .then((res)=> {resolve(res)})
            .catch((err)=> {reject(err)})
        });
    }
},

cap.events = {
    //All errors will call this event
    onError: err => {
        try {
            DevExpress.ui.notify(err.message, 'error', 2000)
            console.log(err);
        } catch (err) {
            console.log(err)
        }
    },
    //All success messages will call this event. If no message, it will not show anything to the user
    onSuccess: (msg = null) => {
        if  (msg === null)  {
            console.log('success - hidden from user')
            return
        }
        DevExpress.ui.notify(msg, 'success', 3000)
        console.log(msg + ' success - shown to user')
    }
}

//To detect whe the webpage has completely loaded, we use jquery load event like so:
$(() => {
    try {
        //HTML page has finished loading, so add our content and kick off our app
        let parent = 'body';
        cap.methods.pageLoad(parent);
    } catch (err) {
        cap.events.onError(err)
    }
    })
