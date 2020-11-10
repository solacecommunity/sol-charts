import { attr } from "svelte/internal";

/**
 * Construct that holds a map of charts -> brokers -> selected attributes
 */
export class ChartToBrokerAttributeMap {
     //Hard limit on the number of charts
     static  NUMBER_OF_CHARTS: number = 5;

     //context key for the svelte construct
     static  CONTEXT_KEY:string = "CHART_TO_BROKER_ATTRIBUTE_MAP";

     //Map of chart id -> broker id -> selected attributes[]
     chartToBrokerAttributeMap:Map<number,Map<number,string[]>>;

     constructor(){
        this.chartToBrokerAttributeMap = new Map<number,Map<number,string[]>>();

         for(let i=1;i<=ChartToBrokerAttributeMap.NUMBER_OF_CHARTS;i++)
            this.chartToBrokerAttributeMap.set(i,new Map<number,string[]>());
     }


    //Set the map for chartid to brokerid to attributes 
    setAttributesToChartBroker(chartId:number,brokerId:number,attributes:string[]){
        this.chartToBrokerAttributeMap.get(chartId).set(brokerId,attributes);
    }

    //reset the chart id to broker id map
    resetChartToBrokerAttributeMap(chartId:number){
        this.chartToBrokerAttributeMap.set(chartId,new Map<number,string[]>());
    }

    //get the chart to broker map
    getChartToBrokerMap(chartId:number):Map<number,string[]>{
        return this.chartToBrokerAttributeMap.get(chartId);
    }

    //get attributes for a chart's broker
    getAttributesForChartsBroker(chartId:number,brokerId:number) {
        return this.chartToBrokerAttributeMap.get(chartId).get(brokerId);
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
}