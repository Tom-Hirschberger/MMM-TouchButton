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