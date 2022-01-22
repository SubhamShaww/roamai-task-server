const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt"); // require mqtt

const host = "broker.hivemq.com";
const port = "1883";
const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl); // create a client

client.on("connect", function () {
  client.subscribe("location", function (err) {
    if (!err) {
      fs.readFile(path.join(__dirname, "map.geojson"), (err, data) => {
        if (!err) {
          const parsedData = JSON.parse(data);

          // getting random index from mocked geojson data for publishing different cordinate points of the mocked geosjson data each time.
          const randomIndex = Math.floor(
            Math.random() * parsedData.features.length
          );

          client.publish(
            "location",
            JSON.stringify(parsedData.features[randomIndex])
          );
        }
      });
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log("topic:", topic);
  console.log("message:", message.toString());
  client.end();
});
