
export class ClientAttributes {
    clients: string[];
    attributes: string[];
}


/**
 * Construct that holds a map of charts -> brokers -> selected attributes
 */
export class ChartAttributeMaps {
     //Hard limit on the number of charts
     static  NUMBER_OF_CHARTS: number = 5;

     //context key for the svelte construct
     static  CONTEXT_KEY:string = "CHART_TO_BROKER_ATTRIBUTE_MAP";

     //Map of chart id -> broker id -> selected attributes[]
    chartToBrokerAttributeMap: Map<number, Map<number, string[]>>;
    chartToClientAttributeMap: Map<number, Map<number, ClientAttributes>>;

     constructor(){
         this.chartToBrokerAttributeMap = new Map<number,Map<number,string[]>>();
         this.chartToClientAttributeMap = new Map<number, Map<number, ClientAttributes>>();
         
         for (let i = 1; i <= ChartAttributeMaps.NUMBER_OF_CHARTS; i++) {
             this.chartToBrokerAttributeMap.set(i, new Map<number, string[]>());
             this.chartToClientAttributeMap.set(i, new Map<number, ClientAttributes>());
         }
     }

    //Set the map for chartid to brokerid to attributes 
    setAttributesToChartBroker(chartId:number,brokerId:number,attributes:string[]){
        this.chartToBrokerAttributeMap.get(chartId).set(brokerId,attributes);
    }

    //Set the map for chartid to brokerid to clients and attributes 
    setAttributesToChartBrokerClients(chartId:number,brokerId:number,clientAttributes:ClientAttributes){
        this.chartToClientAttributeMap.get(chartId).set(brokerId,clientAttributes);
    }


     //Set the map for chartid to brokerid to clients and retains Attributes 
     setClientsToChartBrokerAttributes(chartId:number,brokerId:number,clients:string[]){
         if (!this.chartToClientAttributeMap.get(chartId).get(brokerId))
             this.chartToClientAttributeMap.get(chartId).set(brokerId, new ClientAttributes());
         
         this.chartToClientAttributeMap.get(chartId).get(brokerId).clients = clients;
    }

     //Set the attributes for chartid to brokerid to clients and retains Attributes 
     setAttributesToChartBrokerClient(chartId:number,brokerId:number,attributes:string[]){
        if (!this.chartToClientAttributeMap.get(chartId).get(brokerId))
            this.chartToClientAttributeMap.get(chartId).set(brokerId, new ClientAttributes());

         this.chartToClientAttributeMap.get(chartId).get(brokerId).attributes = attributes;
    }

    //reset the chart id to broker id map
    resetChartToBrokerAttributeMap(chartId:number){
        this.chartToBrokerAttributeMap.set(chartId,new Map<number,string[]>());
    }

    //reset the chart id to broker id ClientAttribute map
    resetChartToBrokerClientsAttributeMap(chartId:number){
        this.chartToClientAttributeMap.set(chartId,new Map<number,ClientAttributes>());
    }
    
    //reset all maps
    resetMaps(chartId:number) {
        this.resetChartToBrokerAttributeMap(chartId);
        this.resetChartToBrokerClientsAttributeMap(chartId);
    }

    //get the chart to broker map
    getChartToBrokerMap(chartId:number):Map<number,string[]>{
        return this.chartToBrokerAttributeMap.get(chartId);
    }


    //get attributes for a chart's broker
    getAttributesForChartsBroker(chartId:number,brokerId:number) {
        return this.chartToBrokerAttributeMap.get(chartId).get(brokerId);
    }

    //get attributes for a chart's broker
    getClientAttributesForChartsBroker(chartId: number, brokerId: number) {
        return this.chartToClientAttributeMap.get(chartId).get(brokerId).attributes;
    }



    getChartsForBroker(brokerToFind:number):number[] {
        let chartIds: number[] = [];
        this.chartToBrokerAttributeMap.forEach((brokersToAttr: Map<number,string[]>,chartId:number)=>{
            brokersToAttr.forEach((attrs:string[],brokerId:number)=>{
                if(brokerId==brokerToFind && attrs.length>0){
                    chartIds.push(chartId);
                }
            })
        });
        return chartIds;
    }

    getChartsForClientBroker(brokerToFind:number,client:string):number[] {
        let chartIds: number[] = [];
        this.chartToClientAttributeMap.forEach((brokersToClientsAttr: Map<number,ClientAttributes>,chartId:number)=>{
            brokersToClientsAttr.forEach((clientAttrs:ClientAttributes,brokerId:number)=>{
                if(brokerId==brokerToFind && clientAttrs.clients.length >0 && clientAttrs.clients.find((_client)=>_client==client)){
                    chartIds.push(chartId);
                }
            })
        });
        return chartIds;
    }


    //Function to check if the broker has atleast one attribute set
    isABrokerAttributeSet():boolean {
        let hasAttr=false;
        this.chartToBrokerAttributeMap.forEach((brokersToAttr: Map<number,string[]>,chartId:number)=>{
            brokersToAttr.forEach((attrs:string[],brokerId:number)=>{
                if(attrs && attrs.length>0)
                {
                    hasAttr = true;
                    return;
                }
                    
            })
        });

        this.chartToClientAttributeMap.forEach((brokersToAttr: Map<number,ClientAttributes>,chartId:number)=>{
            brokersToAttr.forEach((clientAttrs:ClientAttributes,brokerId:number)=>{
                if(clientAttrs && clientAttrs.clients.length>0 && clientAttrs.attributes.length>0)
                {
                    hasAttr = true;
                    return;
                }
                    
            })
        });

        return hasAttr;
    }



//get a map of broker ids to every attribute across all the charts that map the broker
getBrokerToAttributesMap():Map<number,string[]>{
        let brokerToAttributeMap:Map<number,string[]>  = new Map<number,string[]>();
        this.chartToBrokerAttributeMap.forEach((brokersToAttr: Map<number,string[]>)=>{
            brokersToAttr.forEach((attrs:string[],brokerId:number)=>{
                if(!brokerToAttributeMap.has(brokerId)){
                    brokerToAttributeMap.set(brokerId,attrs);
                }else {
                    let existingAttrs = [...brokerToAttributeMap.get(brokerId)];
                    attrs.forEach(attr=> {
                        if(!existingAttrs.includes(attr))
                            existingAttrs.push(attr)
                    });
                    brokerToAttributeMap.set(brokerId,existingAttrs);
                }
            })
        })

        return brokerToAttributeMap;
    }

 //get a map of broker ids to every client attribute across all the charts that map the broker clients
 getBrokerToClientAttributesMap():Map<number,ClientAttributes>{
    let brokerToClientAttributeMap:Map<number,ClientAttributes>  = new Map<number,ClientAttributes>();
    this.chartToClientAttributeMap.forEach((brokersToClientAttr: Map<number,ClientAttributes>)=>{
        brokersToClientAttr.forEach((clientAttrs:ClientAttributes,brokerId:number)=>{
            if(!brokerToClientAttributeMap.has(brokerId)){
                brokerToClientAttributeMap.set(brokerId,{...clientAttrs});
            }else {
                let existingAttrs=brokerToClientAttributeMap.get(brokerId);

                clientAttrs.clients.forEach(client=> {
                    if(!existingAttrs.clients.includes(client))
                        existingAttrs.clients.push(client);
                });

                clientAttrs.attributes.forEach(client=> {
                    if(!existingAttrs.attributes.includes(client))
                        existingAttrs.attributes.push(client);
                });
            }
        })
    })

    return brokerToClientAttributeMap;
}
}