/* Magic Mirror
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

module.exports = NodeHelper.create({

  start: function () {
    this.started = false
  },

  runButtonAction: function(buttonConfig) {
    console.log("Do action of button: "+buttonConfig.name)

    if(typeof buttonConfig.command !== "undefined"){
      console.log("Running the command")
      execSync(buttonConfig.command+" "+buttonConfig.args)
    }

    if(typeof buttonConfig.notification !== "undefined"){
      console.log("Initiate send of notification")
      this.sendSocketNotification("SEND_NOTIFICATION", {"notification":buttonConfig.notification, "payload": buttonConfig.payload})
    }
  },

  
  // let output = execSync(curScript+" "+curArgs)

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
    } else if (notification === 'BUTTON_PRESSED' ){
      console.log("Button pressed")
      self.runButtonAction(self.config.buttons[payload.id])
    } else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
