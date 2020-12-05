# MMM-TouchButton ##
This module displays buttons that can be controlled by touch or mouse click. As an action either a script can be run on the commandline or/and an notification can be send. Each button gets an unique css class based on a name to make it possible to change the size and color individually.

## Screenshots ##
![Three colored buttons](https://github.com/Tom-Hirschberger/MMM-TouchButton/raw/master/screenshots/threeColoredButtons.png "Three colored buttons")

## Installation ##
```

		cd ~/MagicMirror/modules
		git clone https://github.com/Tom-Hirschberger/MMM-TouchButton.git
		cd MMM-TouchButton
		npm install
```

## Configuration ##
```json5

        {
			module: "MMM-TouchButton",
			position: "bottom_left",
			config: {
				buttons: [
				]
			},
		},
```

An example with three buttons. One to shutdown the host, one to reboot it and one to hide/show a module:
```json5
		
        {
			module: "MMM-TouchButton",
			position: "bottom_left",
			config: {
				buttons: [
					{
						name: "Shutdown",
						icon: "fa fa-power-off",
						command: "sudo",
						args: "shutdown -h now"
					},
					{
						name: "Reboot",
						icon: "fa fa-refresh",
						command: "sudo",
						args: "reboot"
					},
					{
						name: "Snow",
						icon: "fa fa-snowflake-o",
						notification: "MODULE_TOGGLE",
						payload: {hide: [], show: [], toggle:["Clock"]}
					},
				]
			},
		},
```

### General ###
| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| buttons | The array containing an object for each button | Array [] | [] |

### Buttons ###
| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| name | The name of the button. The button gets assigned a css class called "button-BUTTON_NAME". Do not use spaces in the name! | String | "" |
| icon | Choose an Font Awesome 4.7 icon which should be displayed as a button. | String like "fa fa-refresh" | "" |
| command | An command which should be run if the button gets pressed (only the command, the arguments will be configured seperatly) | String like "sudo" | "" |
| args | All arguments of the command that should be run. | String like "reboot" | "" |
| notification | An notification that should be send if the button gets pressed. | String like "MODULE_LOGGLE" | "" |
| payload | The payload of the notification to send | Object like {toggle:["Clock"]} | {} |
