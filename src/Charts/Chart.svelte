<script lang="ts">
import { Button, Grid, Row, Column, TextInput } from 'carbon-components-svelte';
import { LineChart } from '@carbon/charts-svelte';
import Misuse16 from 'carbon-icons-svelte/lib/Misuse16';
import BrokerAttributeMultiSelect from './BrokerAttributeMultiSelect.svelte';
import { brokerStore } from '../store';
import { getContext } from 'svelte';
import { ChartAttributeMaps } from './ChartAttributeMaps';
import { getLabelForVpnClientMonitorAttribute, getLabelForVpnMonitorAttribute } from '../dict/MonitorAttributes';

export let chartId: number;

export let disabled = false;

export let close = (id: number) => {};

let chartLabel: string = 'Chart ' + chartId;

let chartData = [];

let chartAttributeMaps: ChartAttributeMaps = getContext(ChartAttributeMaps.CONTEXT_KEY);

//Exported function to clear the chart
export function clearChart() {
    chartData = [];
}

//Exported function to add VPN data to the chart
export function addVPNChartData(timeStamp: Date, brokerId: number, data: any) {
    let attributes = chartAttributeMaps.getAttributesForChartsBroker(chartId, brokerId);
    let brokerLabel = $brokerStore.find((broker) => broker.id == brokerId).label;
    let sempVer = $brokerStore.find((broker) => broker.id == brokerId).sempVer;

    attributes.forEach((attr) => {
        let attrLabel = getLabelForVpnMonitorAttribute(sempVer, attr);
        let dataPoint = {
            group: brokerLabel + ':' + attrLabel,
            value: getValueFromData(attr, data),
            date: timeStamp,
        };
        chartData = [...chartData, dataPoint];
    });
}

function getValueFromData(attr: string, data: any) {
    let nestedAttr = attr.split('.');

    if (nestedAttr.length > 1) {
        return data[nestedAttr[0]][nestedAttr[1]];
    } else {
        return data[attr];
    }
}

//Exported function to add client data to the chart
export function addClientChartData(timeStamp: Date, brokerId: number, data: any) {
    let attributes = chartAttributeMaps.getClientAttributesForChartsBroker(chartId, brokerId);
    let brokerLabel = $brokerStore.find((broker) => broker.id == brokerId).label;
    let sempVer = $brokerStore.find((broker) => broker.id == brokerId).sempVer;

    attributes.forEach((attr) => {
        let attrLabel = getLabelForVpnClientMonitorAttribute(sempVer, attr);
        let dataPoint = {
            group: `${data.clientUsername} (${brokerLabel}) : ${attrLabel}`,
            value: getValueFromData(attr, data),
            date: timeStamp,
        };
        chartData = [...chartData, dataPoint];
    });
}
</script>

<style>
.ptb-10 {
    padding-top: 10px;
    padding-bottom: 10px;
}

.mb-10 {
    margin-bottom: 10px;
}

.flex {
    display: flex;
}

.center-content {
    justify-content: center;
    align-content: center;
    width: 100%;
}
.right-content {
    justify-content: flex-end;
}

.border-white {
    border: 2px dotted white;
    border-radius: 25px;
}
</style>

<Grid>
    {#if chartId != 1}
        <Row>
            <Column>
                <div class="flex right-content">
                    <Button
                        icon="{Misuse16}"
                        kind="tertiary"
                        size="small"
                        style="border:none"
                        on:click="{() => close(chartId)}"
                    />
                </div>
            </Column>
        </Row>
    {/if}
    <Row>
        <Column>
            <h4>Chart {chartId}</h4>
        </Column>
    </Row>

    <Row>
        <Column>
            <TextInput
                disabled="{disabled}"
                labelText="Chart Label"
                placeholder="Chart Label..."
                bind:value="{chartLabel}"
                required
            />
        </Column>
    </Row>
    <div class="ptb-10">
        <Row>
            <Column>
                <div class="flex center-content bx--label">Attributes to Chart</div>
            </Column>
        </Row>
        {#each $brokerStore as { id, isConnected, label, sempVer }}
            {#if isConnected}
                <div class="border-white mb-10">
                    <Row>
                        <Column>
                            <BrokerAttributeMultiSelect
                                chartId="{chartId}"
                                brokerId="{id}"
                                brokerLabel="{label}"
                                disabled="{disabled}"
                                sempVer="{sempVer}"
                            />
                        </Column>
                    </Row>
                </div>
            {/if}
        {/each}
    </div>
    <Row>
        <Column>
            <LineChart
                data="{chartData}"
                options="{{ title: chartLabel, axes: { left: { title: 'Value', mapsTo: 'value', scaleType: 'linear' }, bottom: { mapsTo: 'date', title: 'Time', scaleType: 'time' } }, curve: 'curveMonotoneY', legend: { alignment: 'center', truncation: { numCharacter: 50 } }, height: '400px' }}"
            />
            <br />
        </Column>
    </Row>
</Grid>
