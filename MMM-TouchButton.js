/* global Module

/* Magic Mirror
 * Module: TouchButton
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-TouchButton', {

  defaults: {
    animationSpeed: 0,
    classes: null,
    profiles: null,
    buttons: []
  },

  getStyles: function() {
    return ['font-awesome.css', 'touch-button.css']
  },

  validateCondition: function(source, value, type){
    if (type == "eq"){
      if(source === value){
        return true
      }
    } else if (type == "incl"){
      if(source.includes(value)){
        return true
      }
    } else if (type == "mt") {
      return new RegExp(value).test(source)
    } else if (type == "lt"){
      if(source < value){
        return true
      }
    } else if (type == "le"){
      if(source <= value){
        return true
      }
    } else if (type == "gt"){
      if(source > value) {
        return true
      }
    } else if (type == "ge"){
      if(source >= value){
        return true
      }
    }

    return false
  },

  getCurrentButtonProps: function(buttonConfig, buttonResults){
    const self = this
    let icon = buttonConfig["icon"] || null
    let imgIcon = buttonConfig["imgIcon"] || null
    let classes = []
    if (typeof buttonConfig["classes"] !== "undefined"){
      classes = buttonConfig["classes"].split(" ")
    }

    if (typeof buttonConfig["conditions"] !== "undefined"){
      for (let curCondition of buttonConfig["conditions"]){
        let source = curCondition["source"] || null
        let type = curCondition["type"] || null
        let value = curCondition["value"] || null

        if((source != null) && (type != null) && (value != null)){
          let curSource = buttonResults[source]

          if(curSource != null){
            if(self.validateCondition(curSource, value, type)){
              icon = curCondition["icon"] || icon
              imgIcon = curCondition["imgIcon"] || imgIcon
              classes = []
              if(typeof curCondition["classes"] !== "undefined"){
                curCondition["classes"].split(" ").forEach(element => classes.push(element))
              }
              
              break
            }
          }
        }
      }
    }

    return [icon, imgIcon, classes]
  },

  getDom: function() {
    const self = this
    const wrapper = document.createElement('div')
      let moduleClasses = []
      
      if(typeof self.config["classes"] !== "undefined"){
        self.config["classes"].split(" ").forEach(element => moduleClasses.push(element))
      }

      wrapper.className = "touchButtonRootWrapper"
      for(let curId = 0; curId < self.config.buttons.length; curId++){
        let curButtonConfig = self.config.buttons[curId]

        if ((typeof curButtonConfig["profiles"] !== "undefined") && (self.currentProfile != null)){
          if (!curButtonConfig["profiles"].includes(self.currentProfile)) {
            continue
          }
        }

        let curCondButtonConfig = self.getCurrentButtonProps(curButtonConfig, self.results[curId] || {})

        var buttonWrapper = document.createElement("div")
          buttonWrapper.className="touchButton buttonWrapper"

          let curButton = null
          if (curCondButtonConfig[1] != null ){
            curButton = document.createElement("img")
            curButton.setAttribute("src", curCondButtonConfig[1])
            curButton.classList.add("imgIcon")
          } else if (curCondButtonConfig[0] != null){
            curButton = document.createElement("i")
            curButton.className = curButtonConfig.icon
            curButton.classList.add("icon")
          }

          if(curButton != null){
            curButton.classList.add("touchButton")
            curButton.classList.add("button")
            curButton.classList.add("button-"+curButtonConfig.name)
            curCondButtonConfig[2].forEach(element => curButton.classList.add(element))

            curButton.addEventListener("click", ()=>{ self.sendSocketNotification("BUTTON_PRESSED", {"id": curId}) })
            buttonWrapper.appendChild(curButton)
          }
        wrapper.appendChild(buttonWrapper)
      }
    return wrapper;
  },

  start: function () {
    const self = this
    Log.info("Starting module: " + self.name);
    self.sendSocketNotification('CONFIG', self.config)
    self.results = {}
    self.currentProfile = null
  },

  notificationReceived: function (notification, payload) {
		const self = this
		if (notification === "CHANGED_PROFILE") {
			self.currentProfile = payload.to
      self.updateDom(self.config.animationSpeed)
		} 
	},

  socketNotificationReceived: function (notification, payload) {
    const self = this

    if(notification === "SEND_NOTIFICATION"){
      console.log(self.name+": Sending notification to all other modules")
      self.sendNotification(payload.notification, payload.payload)
    } else if (notification === "RESULT"){
      self.results[payload.id] = payload
      self.updateDom(self.config.animationSpeed)
    }
  },
})
