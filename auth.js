import axios from "axios"
import appInfo from "./app"

export default {
  _user: null,//defaultUser,
  loggedIn() {
    return !!this._user;
  },

  async logIn(username, password) {
    try {
      // Send request
      var request = app._APIURL + '/api/sqlQuery'

      var dataString =  {
      "username":"vmcguire",
      "password":"ulsMT",
      "sqlcommand":{"query":"UNIVERSAL_CONTACTS @username, @password","params":[{"name":"username","type":"varchar","value":username},{"name":"password","type":"varchar","value":password}]}}

      var logOutput = await axios.post(request, dataString)
      logOutput = logOutput.data.data.rows
      console.log(logOutput)

      if(logOutput.length > 0){
        this._user = { ...logOutput[0], username };
        console.log(this._user)
        return {
          isOk: true,
          data: this._user
        };
      }
      else{
        return {
          isOk: false,
          message: "Authentication failed"
        };
      }

    }
    catch (e){
      console.log(e)

      return {

        isOk: false,
        message: "Authentication failed"
      };
    }
  },

  async logOut() {
    this._user = null;
  },

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false
      };
    }
  },
};
