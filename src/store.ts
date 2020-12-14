/**
 * Store to hold all SEMP Connection details for the configured Solace brokers
 */

import {writable} from 'svelte/store';

/**
 * Class to hold a SEMP Connection's details
 */
export class SempConnection {
    id: number;
    label: string;
    isConnected: boolean;
    sempUrl: string;
    sempUser: string;
    sempPassword: string;
    vpnName:string;
    sempVer: number;

    public constructor(id:number,isConnected:boolean,label:string='',sempUrl:string='',vpnName:string='',sempUser:string='',sempPassword:string='',sempVer:number=0.0){
        this.id = id;
        this.label=label;
        this.isConnected=isConnected;
        this.sempUrl=sempUrl;
        this.vpnName = vpnName;
        this.sempUser=sempUser;
        this.sempPassword = sempPassword;
        this.sempVer = sempVer;
    }

    buildVpnMonitorUrl(attrs:string[]):string {
        return `${this.sempUrl}/SEMP/v2/monitor/msgVpns/${this.vpnName}?select=${attrs.join(',')}`;
    }

    buildVpnClientUrl(): string {
        return `${this.sempUrl}/SEMP/v2/monitor/msgVpns/${this.vpnName}/clients?select=clientName,clientUsername,clientAddress`
    }

    buildVpnClientMonitorUrl(client: string, attrs: string[]): string {
        return `${this.sempUrl}/SEMP/v2/monitor/msgVpns/${this.vpnName}/clients/${encodeURI(client).replace(/#/g,"%23").replace(/\//g,"%2F")}?select=clientName,clientUsername,clientAddress,${attrs.join(',')}`
    }

    buildAuthHeader() {
        return 'Basic ' + btoa(this.sempUser + ':' + this.sempPassword);
    }
}

//Utility function for creating a store of SEMPConnections
 function createBrokerStore(initialValue=[])  {

    const {subscribe, update} = writable(initialValue);
    return {
    subscribe,
    addOrUpdateBroker(sempConnection:SempConnection){
        update((brokers)=>
          [...brokers, sempConnection])
    },
    removeBroker(id:number) {
        update(brokers=>  brokers.filter(broker => broker.id !== id))
           
    },
    loadConfig(config:SempConnection[]){
        update(brokers => {
            brokers=config;
            return brokers;
        });
    }
    }
}

// export const brokerStore = createBrokerStore([new SempConnection(1,true,'Node1','http://localhost:8080','default','admin','admin')]);

export const brokerStore = createBrokerStore();