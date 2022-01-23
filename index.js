require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt"); // require mqtt

const host = process.env.HOST;
const port = process.env.PORT;
const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl); // create a client

client.on("connect", function () {
  fs.readFile(path.join(__dirname, "map.geojson"), (err, data) => {
    if (!err) {
      const parsedData = JSON.parse(data);

      setInterval(() => {
        const randomIndex = Math.floor(
          Math.random() * parsedData.features.length
        );

        client.publish(
          "location",
          JSON.stringify(parsedData.features[randomIndex])
        );
      }, 30000);
    }
  });
});
