# JavaScript-wireshark-geolocate

A script to geolocate people on streaming media using **Wireshark/tshark** and the **[geoip-lite](https://github.com/geoip-lite/node-geoip)** module. Tested on Ometv. 

I created this script to experiment using wireshark. It's for educational/harmless purposes only. Please don't try to use it to stalk or scare people.

# Instructions

 > Install **[Wireshark](https://www.wireshark.org/)**

Make sure the cmd path is pointing to your Wireshark Folder correctly:
```javascript
// Define the command you want to run
const cmd = `"C:\\\\Program Files\\\\Wireshark\\\\tshark.exe" -i Wi-fi -Y "stun && ip.src != ${myIp}"`;

```


Npm install the modules below and run ```node index.js``` in your terminal in the project's directory to run the script.

## Modules

### geoip-lite

+ [geoip-lite](https://www.npmjs.com/package/geoip-lite)
### my-ip

+ [my-ip](https://www.npmjs.com/package/my-ip)
