const whitelist = [
  "5.2.213.244", // office RDS
  "35.158.37.8", // vpn elrond ?
  "83.103.170.152", // vpn elrond upc
  "104.248.25.147", // vpn elrond do
  "82.77.77.115", // stan
];

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;

  if (whitelist.includes(request.clientIp)) {
    callback(null, request);
  } else {
    callback(true);
  }
};
