import os from 'node:os';
import { exec } from 'node:child_process';
import util from 'node:util';
const execPromise = util.promisify(exec);
import type { NetworkInterfaceInfo } from 'node:os';

export async function getActiveInterface() {
  const interfaces = os.networkInterfaces();

  // Use default gateway to find active interface
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execPromise('route print 0.0.0.0');
      const lines = stdout.split('\n');

      // Find the default route (0.0.0.0)
      for (const line of lines) {
        if (line.includes('0.0.0.0') && line.trim().startsWith('0.0.0.0')) {
          const parts = line.trim().split(/\s+/);
          const gatewayIP = parts[2]; // Gateway IP

          // Find which interface has this gateway in its subnet
          if (gatewayIP) {
            for (const [name, addrs] of Object.entries(interfaces) as [string, NetworkInterfaceInfo[]][]) {
              for (const addr of addrs) {
                if (addr.family === 'IPv4' && !addr.internal && addr.netmask) {
                  // Check if gateway is in same subnet
                  if (isInSameSubnet(addr.address, gatewayIP, addr.netmask)) {
                    return { name, ...addr };
                  }
                }
              }
            }
          }
        }
      }
    } else if (process.platform === 'darwin' || process.platform === 'linux') {
      // For macOS/Linux
      const { stdout } = await execPromise('ip route | grep default || route -n get default');
      const match = stdout.match(/dev (\w+)/) || stdout.match(/interface: (\w+)/);

      if (match) {
        const ifaceName = match[1];
        if (ifaceName && ifaceName in interfaces) {
          const addrs = interfaces[ifaceName] as NetworkInterfaceInfo[];
          const ipv4 = addrs.find(a => a.family === 'IPv4' && !a.internal);
          if (ipv4) return { name: ifaceName, ...ipv4 };
        }
      }
    }
  } catch (err) {
    console.log('Gateway method failed, using fallback:', (err as Error).message);
  }

  // Method 2: Fallback - filter out virtual/loopback interfaces
  const validInterfaces: { name: string; address: string; netmask: string; family: string; mac: string; internal: boolean; cidr: string | null }[] = [];

  for (const [name, addrs] of Object.entries(interfaces) as [string, NetworkInterfaceInfo[]][]) {
    // Skip loopback
    if (name.toLowerCase().includes('loopback')) continue;

    // Skip virtual adapters (common patterns)
    if (
      name.toLowerCase().includes('virtual') ||
      name.toLowerCase().includes('vethernet') ||
      name.toLowerCase().includes('vmware') ||
      name.toLowerCase().includes('virtualbox') ||
      name.toLowerCase().includes('hyper-v') ||
      name.includes('vEthernet') ||
      /^(vir|tun|tap|docker|br-)/i.test(name)
    ) continue;

    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        // Prefer non-169.254.x.x (APIPA) addresses
        if (!addr.address.startsWith('169.254')) {
          validInterfaces.push({ name, ...addr });
        }
      }
    }
  }

  // Prefer Wi-Fi or Ethernet over others
  const preferred = validInterfaces.find(i =>
    /^(wi-?fi|wlan|eth|ethernet|en\d)/i.test(i.name)
  );

  return preferred || validInterfaces[0] || null;
}

function isInSameSubnet(ip1: string, ip2: string, netmask: string) {
  const ipToNum = (ip: string) => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;

  const ip1Num = ipToNum(ip1);
  const ip2Num = ipToNum(ip2);
  const maskNum = ipToNum(netmask);

  return (ip1Num & maskNum) === (ip2Num & maskNum);
}


