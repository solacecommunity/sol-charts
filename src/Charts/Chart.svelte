<script lang="ts">
    import { Button, Grid, Row, Column, TextInput } from 'carbon-components-svelte';
    import { LineChart } from '@carbon/charts-svelte';
    import Misuse16 from 'carbon-icons-svelte/lib/Misuse16';
    import BrokerAttributeMultiSelect from './BrokerAttributeMultiSelect.svelte';
    import { brokerStore } from '../store';
    import { getContext } from 'svelte';
    import { ChartToBrokerAttributeMap } from './ChartToBrokerAttributeMap';
    import { VPN_MONITOR_ATTRIBUTES } from '../dict/MonitorAttributes';

    export let chartId: number;

    export let disabled = false;

    export let close = (id: number) => {};

    let chartLabel: string = 'Chart ' + chartId;

    let chartData = [];

    let chartToBrokerAttrMap: ChartToBrokerAttributeMap = getContext(ChartToBrokerAttributeMap.CONTEXT_KEY);

    //Exported function to clear the chart
    export function clearChart() {
        chartData = [];
    }

    //Exported function to add data to the chart
    export function addChartData(timeStamp: Date, brokerId: number, data: any) {
        let attributes = chartToBrokerAttrMap.getAttributesForChartsBroker(chartId, brokerId);
        let brokerLabel = $brokerStore.find((broker) => broker.id == brokerId).label;
        attributes.forEach((attr) => {
            let attrLabel = VPN_MONITOR_ATTRIBUTES.find((dict) => dict.id == attr).text;
            let dataPoint = { group: brokerLabel + ':' + attrLabel, value: data[attr], date: timeStamp };
            chartData = [...chartData, dataPoint];
        });
    }
</script>

<style>
    .ptb-10 {
        padding-top: 10px;
        padding-bottom: 10px;
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
</style>

<Grid>
    {#if chartId != 1}
        <Row>
            <Column>
                <div class="flex right-content">
                    <Button
                        icon={Misuse16}
                        kind="tertiary"
                        size="small"
                        style="border:none"
                        on:click={() => close(chartId)} />
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
                {disabled}
                labelText="Chart Label"
                placeholder="Chart Label..."
                bind:value={chartLabel}
                required />
        </Column>
    </Row>
    <div class="ptb-10">
        <Row>
            <Column>
                <div class="flex center-content bx--label">Attributes to Chart</div>
            </Column>
        </Row>
        {#each $brokerStore as { id, isConnected, label }}
            {#if isConnected}
                <Row>
                    <Column>
                        <BrokerAttributeMultiSelect {chartId} brokerId={id} brokerLabel={label} {disabled} />
                    </Column>
                </Row>
            {/if}
        {/each}
    </div>
    <Row>
        <Column>
            <LineChart
                data={chartData}
                options={{ title: chartLabel, axes: { left: { title: 'Value', mapsTo: 'value', scaleType: 'linear' }, bottom: { mapsTo: 'date', title: 'Time', scaleType: 'time' } }, curve: 'curveMonotoneY', legend: { alignment: 'center', truncation: { numCharacter: 50 } }, height: '400px' }} />
            <br />
        </Column>
    </Row>
</Grid>
