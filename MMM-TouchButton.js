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
    buttons: [],
    addEmptyTitle: false,
    buttons: [],
    refreshOnNotification: true,
    refreshOnlyIfValueChanged: true,
    notificationDelay: 3000,
    notificationsAtStart: []
  },

  getScripts: function () {
		return [this.file('node_modules/jsonpath-plus/dist/index-browser-umd.js'), this.file('node_modules/js-uuid/js-uuid.js'), this.file('node_modules/@iconify/iconify/dist/iconify.min.js')];
	},

  getStyles: function() {
    return ['font-awesome.css', 'touch-button.css']
  },

  validateCondition: function(source, value, type){
    if (type == "eq"){
      return source === value
    } else if (type == "incl"){
      return source.includes(value)
    } else if (type == "mt") {
      return new RegExp(value).test(source)
    } else if (type == "lt"){
      return source < value
    } else if (type == "le"){
      return source <= value
    } else if (type == "gt"){
      return source > value
    } else if (type == "ge"){
      return source >= value
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
        let value = null
        if (typeof curCondition["value"] !== "undefined"){
          value = curCondition["value"]
        }
        let jsonpath = curCondition["jsonpath"] || null

        if((source != null) && (type != null) && (value != null)){
          let curSource
          if(jsonpath != null){
            curSource = buttonResults[source+jsonpath]
          } else {
            curSource = buttonResults[source]
          }

          if(curSource != null){
            let valResult = self.validateCondition(curSource, value, type)
            if(valResult){
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
      
      if(self.config["classes"] != null){
        self.config["classes"].split(" ").forEach(element => moduleClasses.push(element))
      }

      wrapper.classList.add("touchButtonRootWrapper")
      moduleClasses.forEach(element => wrapper.classList.add(element))

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
            let curTitleObj = document.createElement("div")
            curTitleObj.className = "touchButton button title title-"+curButtonConfig.name
            curTitleObj.innerHTML = curTitle
            curCondButtonConfig[2].forEach(element => curTitleObj.classList.add(element))
            
            buttonWrapper.appendChild(curTitleObj)
          }

          let curButton = null
          if (curCondButtonConfig[1] != null ){
            curButton = document.createElement("img")
            curButton.setAttribute("src", curCondButtonConfig[1])
            curButton.classList.add("imgIcon")
          } else if (curCondButtonConfig[0] != null){
            if(curCondButtonConfig[0].startsWith("fa ")){
              curButton = document.createElement("i")
              curButton.className = curCondButtonConfig[0]
              curButton.setAttribute("aria-hidden", "true")
              curButton.classList.add("icon")
            } else {
              curButton = document.createElement("span")
              curButton.classList.add("iconify")
              curButtonIconWrapper = document.createElement("span")
              curButtonIconWrapper.classList.add("iconify-inline")
              curButtonIconWrapper.setAttribute("data-icon", curCondButtonConfig[0])
              curButton.appendChild(curButtonIconWrapper)
            }
          }

          if(curButton != null){
            curButton.classList.add("touchButton")
            curButton.classList.add("button")
            curButton.classList.add("button-"+curButtonConfig.name)
            curCondButtonConfig[2].forEach(element => curButton.classList.add(element))

            curButton.addEventListener("click", ()=>{ self.sendSocketNotification("BUTTON_PRESSED", {"moduleId": self.moduleId, "id": curId}) })
            buttonWrapper.appendChild(curButton)
          }
        wrapper.appendChild(buttonWrapper)
      }
    return wrapper;
  },

  start: function () {
    const self = this
    self.moduleId = uuid.v4()
    Log.info("Starting module: " + self.name);
    self.sendSocketNotification('CONFIG', [self.moduleId, self.config])
    self.results = {}
    self.currentProfile = null
    self.notifications = {}
    self.watchNotifications = false
    for(let curBtnId = 0; curBtnId < self.config.buttons.length; curBtnId++){
      let curButtonConfig = self.config.buttons[curBtnId]
      let curConditions = curButtonConfig["conditions"] || null
      if (curConditions != null){
        for (let curCondId = 0; curCondId < curConditions.length; curCondId++){
          let curSource = curConditions[curCondId].source || null

          if((curSource != null) && (curSource != "out") && (curSource != "err") && (curSource != "code")){
            let curNotiObj = self.notifications[curSource] || []
            let curResObj = {}
            curResObj["id"] = curBtnId
            curResObj["condition"] = curConditions[curCondId]
            curNotiObj.push(curResObj)
            self.notifications[curSource] = curNotiObj
            self.watchNotifications = true
          }
        }
      }
    }

    setTimeout(()=>{
      for (let curNotiId = 0; curNotiId < self.config.notificationsAtStart.length; curNotiId++){
        let curNotiObj = self.config.notificationsAtStart[curNotiId]
        if (curNotiObj.length > 1){
          self.sendNotification(curNotiObj[0], curNotiObj[1])
        } else {
          self.sendNotification(curNotiObj[0])
        }
      }
    }, self.config.notificationDelay)
  },

  //https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
	tryParseJSONObject: function (jsonString) {
		try {
			var o = JSON.parse(jsonString);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns null, and typeof null === "object",
			// so we must check for that, too. Thankfully, null is falsey, so this suffices:
			if (o && typeof o === "object") {
				return o;
			}
		}
		catch (e) { }

		return false;
	},

  notificationReceived: function (notification, payload) {
		const self = this
		if (notification === "CHANGED_PROFILE") {
			self.currentProfile = payload.to
      self.updateDom(self.config.animationSpeed)
		}

    if(self.watchNotifications){
      if (typeof self.notifications[notification] !== "undefined"){
        let refreshNeeded = false
        let curNotificationUsers = self.notifications[notification]
        for(let curCondBtnIdx = 0; curCondBtnIdx < curNotificationUsers.length; curCondBtnIdx++){
          let curId = curNotificationUsers[curCondBtnIdx].id
          let curCondition = curNotificationUsers[curCondBtnIdx].condition
          let curJsonpath = curCondition.jsonpath || null
          let curResult
          
          if (curJsonpath != null) {
            let curParsedPayload = self.tryParseJSONObject(payload)
            if(curParsedPayload){
              curResult = JSONPath.JSONPath({ path: curJsonpath, json: curParsedPayload })[0];
            } else {
              curResult = payload
            }
          } else {
            curResult = payload
          }

          let curResultExtendedNotification = notification
          if (curJsonpath != null){
            curResultExtendedNotification += curJsonpath
          }

          let oldResultObj = self.results[curId] || null
          
          let oldResult = null
          if(oldResultObj != null){
            oldResult = oldResultObj[curResultExtendedNotification] || null
          } else {
            oldResultObj = {}
          }

          if (oldResult !== curResult) {
            oldResultObj[curResultExtendedNotification] = curResult
            self.results[curId] = oldResultObj
            refreshNeeded = true
          } else {
            if (!self.config.refreshOnlyIfValueChanged) {
              refreshNeeded = true
            }
          }
        }

        if(refreshNeeded){
          self.updateDom(self.config.animationSpeed)
        }
      }
    }
	},

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (self.moduleId === payload["moduleId"]){
      if(notification === "SEND_NOTIFICATION"){
        console.log(self.name+": Sending notification to all other modules")
        if(typeof payload.payload !== "undefined"){
          self.sendNotification(payload.notification, payload.payload)
        } else {
          self.sendNotification(payload.notification)
        }
      } else if (notification === "RESULT"){
        self.results[payload.id] = payload
        self.updateDom(self.config.animationSpeed)
      }
    }
  },
})
