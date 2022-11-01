/* Magic Mirror
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
//const execSync = require('child_process').execSync
const spawnSync = require('child_process').spawnSync
const fs = require('fs')
const path = require('path')
const scriptsDir = path.join(__dirname, '/scripts')

module.exports = NodeHelper.create({

  start: function () {
    this.started = false
  },

  runButtonAction: function(buttonConfig, buttonId) {
    console.log("Do action of button: "+buttonConfig.name)

    let output = null
    let errOut = null
    let returnCode = null
    if(typeof buttonConfig.command !== "undefined"){
      let curCommand = buttonConfig.command
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
        let spawnOutput = spawnSync(curCommand, args, options)
        returnCode = spawnOutput.status
        output = spawnOutput.stdout
        errOut = spawnOutput.stderr
      } catch (error) {
        console.log(error)
      }
    }

    if(typeof buttonConfig.notification !== "undefined"){
      // console.log("Initiate send of notification")
      this.sendSocketNotification("SEND_NOTIFICATION", {"notification":buttonConfig.notification, "payload": buttonConfig.payload})
    }

    if (returnCode != null){
      this.sendSocketNotification("RESULT", {
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
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
    } else if (notification === 'BUTTON_PRESSED' ){
      self.runButtonAction(self.config.buttons[payload.id], payload.id)
    } else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
