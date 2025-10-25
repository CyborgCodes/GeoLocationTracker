const geoip = require('geoip-lite');
const { exec } = require('child_process');

const myIp = "YOUR_IP";

const vpnInterfaceName = "NordLynx"; 

const cmd = `"C:\\\\Program Files\\\\Wireshark\\\\tshark.exe" -i "${vpnInterfaceName}" -T fields -E separator=, -e ip.src -e ip.dst -e _ws.col.Protocol -Y "stun && ip.src != ${myIp}"`;

const process = exec(cmd);

const loggedIps = new Set(); 
const ipLocationMap = new Map();

function getIpLocation(ip) {
  const geo = geoip.lookup(ip);
  if (!geo) {
    return "Unknown";
  }
  
  const { country, ll, city } = geo;
  
  return `${country || '??'}, ${ll[0] || '?'},${ll[1] || '?'}, ${city || ''}`;
}

process.stdout.on('data', (data) => {
  // Split the entire data chunk into individual lines
  const lines = data.toString().trim().split('\n');

  for (const line of lines) {
    // Split each line by comma
    const columns = line.trim().split(',');

    if (columns.length < 3) continue;

    const srcIp = columns[0].trim();
    const protocol = columns[2].trim();

    // Check if the protocol is STUN and the IP is not internal/private
    if (protocol && protocol.includes('STUN') && !srcIp.startsWith('10.') && !srcIp.startsWith('192.168.')) {
      
      // *** NEW DE-DUPLICATION CHECK ***
      // Only proceed if this IP has NOT been logged yet
      if (loggedIps.has(srcIp)) {
          continue; 
      }
      
      try {
        let location = ipLocationMap.get(srcIp);
        
        // Lookup location only if it's not already in the map (caching)
        if (!location) {
          location = getIpLocation(srcIp);
          ipLocationMap.set(srcIp, location);
        }
        
        // Log the result and immediately add the IP to the logged set
        console.log(`${srcIp} >>> ${location}`);
        loggedIps.add(srcIp);
        
      } catch (error) {
        console.error(`Error processing IP address ${srcIp}: ${error}`);
      }
    }
  }
});

process.stderr.on('data', (data) => {
  console.log(`${data}`);
});

process.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});
