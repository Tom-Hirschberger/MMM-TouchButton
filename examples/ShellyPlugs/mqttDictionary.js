var mqttHook = [
  {
    mqttTopic: "shellies/splug1/relay/0",
    mqttPayload: [
      {
        mqttNotiCmd: ["splug1_state"],
        payloadValue: "",
      },
    ],
  },
  {
    mqttTopic: "shellies/splug2/relay/0",
    mqttPayload: [
      {
        mqttNotiCmd: ["splug2_state"],
        payloadValue: "",
      },
    ],
  },
];
var mqttNotiCommands = [
  {
    commandId: "splug1_state",
    notiID: "SPLUG1_STATE",
  },
  {
    commandId: "splug2_state",
    notiID: "SPLUG2_STATE",
  },
];

module.exports = { mqttHook,  mqttNotiCommands};
