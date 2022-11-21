# Shellies

I do have two Shelly Plug S which i wanted to control with two buttons on my touch enabled mirror.

## Wanted features

* Two icons to control the two plugs
* Each button should get a title which is displayed within the icon
* The color of the icon should be changed depending of the state of the plug (on, off, overpower)

## Screenshot

<p align="center">
 <img src="shellies.png" alt="Screen showing two buttons" width="300px"/>
</p>

## MQTT configuration

My favorite module to send and receive MQTT messages in my mirror is [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge).
The state of Shelly Plug S can be toggled by sending "toggle" to the MQTT topic:

```text
 shellies/<THE ID OF THE PLUG>/relay/0/command
```

If the button gets pressed a notification is send to all other modules. If [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge) receives one of the configured notifications it sends the configured message to the configured topic.
All this configuration is done in [notiDictionary.js](notiDictionary.js).

**The "stringifyPayload" is a change of me and may not have been merged to the main branch of [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge) yet!**

The plugs send their state periodically to the topic:

```text
shellies/<THE ID OF THE PLUG>/relay/0
```

The MQTT message can be either "on", "off" or "overpower".
If messages to these topics are received a notification will be send with the payload set to the content of the message.

The configuration of the messages and notifications will be in [mqttDictionary.js](mqttDictionary.js).

In a last step the configuration of the [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge) needs to be added to the config.js.

```json5
{
    module: "MMM-MQTTbridge",
    disabled: false,
    config: {
            mqttServer: "mqtt://MY_USER:MY_PASSWORD@192.168.1.2:1883",
            mqttConfig: {
                    listenMqtt: true,
                    interval: 60000
            },
            notiConfig: {
                    listenNoti: true
            }
    }
},
```

## MMM-TouchButton configuration

We need to add the following configuration to config.js:

```json5
{
    module: "MMM-TouchButton",
    position: "top_center",
    config: {
        classes: "plugs",
        buttons: [
            {
                name: "SPlug1",
                title: "Shelly 1",
                icon: "mdi:plug-socket-eu",
                notification: "SPLUG1_TOGGLE",
                payload: "toggle",
                conditions: [
                    {
                        source: "SPLUG1_STATE",
                        type: "eq",
                        value: "on",
                        classes: "plug-on"
                    },
                    {
                        source: "SPLUG1_STATE",
                        type: "eq",
                        value: "off",
                        classes: "plug-off"
                    },
                    {
                        source: "SPLUG1_STATE",
                        type: "eq",
                        value: "overpower",
                        classes: "plug-overpower"
                    },
                ]
            },
            {
                name: "SPlug2",
                title: "Shelly 2",
                icon: "mdi:plug-socket-eu",
                notification: "SPLUG2_TOGGLE",
                payload: "toggle",
                conditions: [
                    {
                        source: "SPLUG2_STATE",
                        type: "eq",
                        value: "on",
                        classes: "plug-on"
                    },
                    {
                        source: "SPLUG2_STATE",
                        type: "eq",
                        value: "off",
                        classes: "plug-off"
                    },
                    {
                        source: "SPLUG2_STATE",
                        type: "eq",
                        value: "overpower",
                        classes: "plug-overpower"
                    },
                ]
            },
        ]
    },
},
```

With the following result:

* Two buttons get configured: "SPlug1" and "SPlug2"
* Each button gets a title configured: "Shelly 1" and "Shelly 2"
* The buttons get the [Iconify](https://icon-sets.iconify.design) icon "mdi:plug-socket-eu"
* If button one gets pressed the notification "SPLUG1_TOGGLE" with payload "toggle" gets send
* If button one gets pressed the notification "SPLUG2_TOGGLE" with payload "toggle" gets send
* If the module receives the notification "SPLUG1_STATE" with the payload "on" the class "plug-on" is added to button "SPlug1"
* If the module receives the notification "SPLUG1_STATE" with the payload "off" the class "plug-off" is added to button "SPlug1"
* If the module receives the notification "SPLUG1_STATE" with the payload "overpower" the class "plug-overpower" is added to button "SPlug1"
* * If the module receives the notification "SPLUG2_STATE" with the payload "on" the class "plug-on" is added to button "SPlug2"
* If the module receives the notification "SPLUG2_STATE" with the payload "off" the class "plug-off" is added to button "SPlug2"
* If the module receives the notification "SPLUG2_STATE" with the payload "overpower" the class "plug-overpower" is added to button "SPlug2"


In the next step we do some CSS magic:

As we use a [Iconify](https://icon-sets.iconify.design) icon which will result in a SVG graphics as icon we can use a filter to change the color of the icon.

First we need the hex values of the colors we like for each state. You may use a website like [https://redketchup.io/color-picker](https://redketchup.io/color-picker) to choose one for each state.

Next we convert the hex colors to filters with a page like [https://isotropic.co/tool/hex-color-to-css-filter/](https://isotropic.co/tool/hex-color-to-css-filter/).

As our source icon is not black and white we need two add "brightness(0) saturate(100%)" as first steps of the filter.

To change the color of the title and icon of the on state to the color of plug one in the screenshot the css configuration will look like:

```css
.MMM-TouchButton .button-SPlug1.plug-on,
.MMM-TouchButton .button-SPlug2.plug-on,
.MMM-TouchButton .title-SPlug1.plug-on,
.MMM-TouchButton .title-SPlug2.plug-on {
    filter: brightness(0) saturate(100%) invert(86%) sepia(37%) saturate(694%) hue-rotate(12deg) brightness(103%) contrast(82%);
    color: #D4E157
}
```

The additional "color: #D4E157" will cause font icons to be displayed in the right color, too.

In a last step we resize the icons:

```css
.MMM-TouchButton .plugs .button .button.icon {
    font-size: 150px;
}

.MMM-TouchButton .plugs .button .iconify-inline {
    width: 150px;
    height: 150px;
}

.MMM-TouchButton .touchButton .button.imgIcon{
    width: 140px;
    margin: 5px;
}
```

The first option is for [Fontawesome 4.7](https://fontawesome.com/v4/icons/) icons the second one for [Iconify](https://icon-sets.iconify.design) and the third one for images.
