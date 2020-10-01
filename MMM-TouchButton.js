/* global Module

/* Magic Mirror
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-TouchButton', {

  defaults: {
    buttons: []
  },

  getStyles: function() {
    return ['font-awesome.css', 'touch-button.css']
  },

  getDom: function() {
    const self = this
    const wrapper = document.createElement('div')
      wrapper.className = "touchButtonRootWrapper"
      for(let curId = 0; curId < self.config.buttons.length; curId++){
        let curButtonConfig = self.config.buttons[curId]
        var buttonWrapper = document.createElement("div")
          buttonWrapper.className="touchButton buttonWrapper"

          let curButton = document.createElement("i")
            curButton.className = curButtonConfig.icon+" touchButton button button-"+curButtonConfig.name

            curButton.addEventListener("click", ()=>{ self.sendSocketNotification("BUTTON_PRESSED", {"id": curId}) })
          buttonWrapper.appendChild(curButton)
        wrapper.appendChild(buttonWrapper)
      }
    return wrapper;
  },

  start: function () {
    const self = this
    Log.info("Starting module: " + self.name);
    self.sendSocketNotification('CONFIG', self.config)
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this

    if(notification === "SEND_NOTIFICATION"){
      console.log("Sending notification to all other modules")
      self.sendNotification(payload.notification, payload.payload)
    }
  },
})
