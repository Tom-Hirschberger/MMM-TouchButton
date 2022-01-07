/* global Module

/* Magic Mirror
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-TouchButton', {

  defaults: {
    addEmptyTitle: false,
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

          let curTitle = null
          if ((typeof curButtonConfig.title === "undefined") ||
              (curButtonConfig.title === null)){
              if (self.config.addEmptyTitle){
                curTitle = "&nbsp;"
              }
          } else {
            curTitle = curButtonConfig.title
          }

          if (curTitle !== null){
                curTitleObj = document.createElement("div")
                  curTitleObj.className = "touchButton button title title-"+curButtonConfig.name
                  curTitleObj.innerHTML = curTitle
            buttonWrapper.appendChild(curTitleObj)
          }

          let curButton = document.createElement("i")
            curButton.className = curButtonConfig.icon+" touchButton button icon button-"+curButtonConfig.name

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
