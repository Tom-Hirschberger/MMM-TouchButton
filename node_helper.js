/* MagicMirror²
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
const spawnSync = require('child_process').spawnSync
const fs = require('fs')
const path = require('path')
const scriptsDir = path.join(__dirname, '/scripts')

module.exports = NodeHelper.create({

  start: function () {
    this.started = false
    this.configs = {}
  },

  runButtonAction: function(moduleId, buttonConfig, buttonId) {
    const self = this
    console.log(self.name+": Do action(s) of button: "+buttonConfig.name)

    let output = null
    let errOut = null
    let returnCode = null
    if(typeof buttonConfig.command !== "undefined"){
      let curCommand = buttonConfig.command

      // if(curCommand.startsWith("./")){
      //   curCommand = scriptsDir+"/"+curCommand
      // }
      let args = []

      if(typeof buttonConfig.args !== "undefined"){
        if(Array.isArray(buttonConfig.args)){
          args = buttonConfig.args
        } else {
          args = buttonConfig.args.split(" ")
        }
      }

      let curEncoding = "utf8"
      if(typeof buttonConfig.encoding !== "undefined"){
        curEncoding = buttonConfig.encoding
      }

      let options = {
        shell: true,
        encoding: curEncoding,
        cwd: scriptsDir,
      }

      if(typeof buttonConfig["timeout"] !== "undefined"){
        options["timeout"] = buttonConfig["timeout"]
      }

      try {
        // console.log("Running "+curCommand + " with args: "+args.toString())
        let spawnOutput = spawnSync(curCommand, args, options)
        returnCode = spawnOutput.status
        output = spawnOutput.stdout
        errOut = spawnOutput.stderr

        // console.log("ReturnCode: "+returnCode)
        // console.log("Output: "+output)
        // console.log("ErrOut: "+errOut)
      } catch (error) {
        console.log(error)
      }
    }

    if(typeof buttonConfig.notification !== "undefined"){
      if (typeof buttonConfig.payload !== "undefined"){
        this.sendSocketNotification("SEND_NOTIFICATION", {"moduleId": moduleId, "notification":buttonConfig.notification, "payload": buttonConfig.payload})
      } else {
        this.sendSocketNotification("SEND_NOTIFICATION", {"moduleId": moduleId, "notification":buttonConfig.notification})
      }
    }

    if (returnCode != null){
      this.sendSocketNotification("RESULT", {
        moduleId: moduleId,
        id: buttonId,
        code: returnCode,
        err: errOut,
        out: output
      })
    }
  },

  
  // let output = execSync(curScript+" "+curArgs)

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG') {
      self.configs[payload[0]] = payload[1]
      self.started = true
    } else if (notification === 'BUTTON_PRESSED' ){
      self.runButtonAction(payload.moduleId, self.configs[payload.moduleId].buttons[payload.id], payload.id)
    } else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
