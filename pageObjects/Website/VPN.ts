import { chromium, Page } from "@playwright/test";

export class VPN{

    constructor(){  
    }

    async getRandomVPNServer(){
        //let countryId = 81 //Germany
        //let countryId = 106 //Italy
        //let countryId = 226 //UAE
        // countryId = 17 //Bahrein
        let countryId = 225  //Ukriane 
        //let countryId = 200 //South Africa
        const servers = await fetch(`https://nordvpn.com/wp-admin/admin-ajax.php?action=servers_recommendations&filters={"country_id":17}`);
        let response = await servers.json();
        console.log(await response)// arrray of objects with servers
        // get one random server
        let randomServer = response[Math.floor(Math.random() * response.length)];
        console.log('randomServer?.hostname', randomServer?.hostname);
        return randomServer?.hostname;
      };

      async proxyOptions(username: string, password: string, country: string) {
        let hostName;
        switch(country){
          case 'IT':
            hostName = "it201.nordvpn.com";
            break;
          case 'UAE':
            hostName = "ae58.nordvpn.com";
            break;
          case 'SA':
            hostName = "za137.nordvpn.com"
            break;
          case 'UA':
            hostName = "ua57.nordvpn.com"
            break;
          case 'BH': //bahrein
            hostName = "bh1.nordvpn.com"
            break;
          default:
            throw new Error(`Unsupported country: ${country}`);
        }
        let server = `https://${username}:${password}@${hostName}:89`
        return server
      }

}
