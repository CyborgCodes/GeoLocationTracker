const geoip = require('geoip-lite');
const { exec } = require('child_process');

// Get your IP address
const myIp = require('my-ip')();

// Define the command you want to run
const cmd = `"C:\\\\Program Files\\\\Wireshark\\\\tshark.exe" -i Wi-fi -Y "stun && ip.src != ${myIp}"`;

// Execute the command
const process = exec(cmd);

// Create a function to get the geolocation of an IP address
function getIpLocation(ip) {
  const geo = geoip.lookup(ip);
  if (!geo) {
    return "Unknown";
  }
  const { country, ll, city } = geo;
  return `${country}, ${ll}, ${city}`;
}

const ipLocationMap = new Map();

process.stdout.on('data', (data) => {
  const columns = data.toString().split(/\s+/);

  if (columns.includes('STUN') || columns.includes('UDP')) {
    const srcIpIndex = columns.indexOf('→') - 1;
    const srcIp = columns[srcIpIndex];

    try {
      let location = ipLocationMap.get(srcIp);
      if (!location) {
        location = getIpLocation(srcIp);
        ipLocationMap.set(srcIp, location);
      }
      console.log(`>>> ${location}`);
    } catch (error) {
      console.error(`Error processing IP address ${srcIp}: ${error}`);
    }
  }
});

// Listen for errors
process.stderr.on('data', (data) => {
  console.log(`${data}`);
});

// Listen for process exit
process.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});

