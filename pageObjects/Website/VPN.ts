import { chromium, Page } from "@playwright/test";

export class VPN{

    constructor(){  
    }

    async getRandomVPNServer(){
        let countryId = 81
        let servers = await fetch(`https://nordvpn.com/wp-admin/admin-ajax.php?action=servers_recommendations&filters={%22country_id%22:${countryId}}`);
        let response = await servers.json(); // arrray of objects with servers
        // get one random server
        let randomServer = response[Math.floor(Math.random() * response.length)];
        //console.log('randomServer?.hostname', randomServer?.hostname);
        return randomServer?.hostname;
      };

      async proxyOptions(username: string, password: string) {
        let hostName = await this.getRandomVPNServer();
        let server = `https://${username}:${password}@${hostName}:89`
        return server
      }

}
