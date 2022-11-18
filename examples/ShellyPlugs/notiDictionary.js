
var notiHook = [
  {
    notiId: 'SPLUG1_TOGGLE',
    notiPayload: [
    {
        payloadValue: '', 
        notiMqttCmd: ["SPLUG1_TOGGLE"]
    },
    ],
  },
  {
    notiId: 'SPLUG2_TOGGLE',
    notiPayload: [
    {
        payloadValue: '', 
        notiMqttCmd: ["SPLUG2_TOGGLE"]
    },
    ],
  },
];
var notiMqttCommands = [
  {
    commandId: "SPLUG1_TOGGLE",
    mqttTopic: "shellies/splug1/relay/0/command",
    stringifyPayload: false,
    mqttMsgPayload: ''
  },
  {
    commandId: "SPLUG2_TOGGLE",
    mqttTopic: "shellies/splug2/relay/0/command",
    stringifyPayload: false,
    mqttMsgPayload: ''
  },
];

module.exports = { notiHook, notiMqttCommands };
