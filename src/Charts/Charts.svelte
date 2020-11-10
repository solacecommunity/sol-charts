<script lang="ts">
    import {
        ComposedModal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Select,
        SelectItem,
        Button,
        Grid,
        Row,
        Column,
        ToastNotification,
    } from 'carbon-components-svelte';
    import Chart from './Chart.svelte';
    import { getContext, setContext, onDestroy } from 'svelte';
    import { ChartToBrokerAttributeMap } from './ChartToBrokerAttributeMap';
    import ChartArea16 from 'carbon-icons-svelte/lib/ChartArea16';
    import AlarmAdd16 from 'carbon-icons-svelte/lib/AlarmAdd16';
    import { brokerStore, SempConnection } from '../store';
    import { push } from 'svelte-spa-router';

    let isCharting = false;

    let noAttributes = false;

    let sempPoller;

    let pollingInterval = '5';
    let pollingErrorMessages = [];

    //Limiting the number of charts that are available to add to 5
    let chartsAvailable = [
        { id: 5, component: Chart },
        { id: 4, component: Chart },
        { id: 3, component: Chart },
        { id: 2, component: Chart },
    ];

    //Start the display to 1 chart
    let chartsToDisplay = [{ id: 1, component: Chart }];

    //Set a context with a structure to hold the chart->broker->attribute map
    setContext(ChartToBrokerAttributeMap.CONTEXT_KEY, new ChartToBrokerAttributeMap());

    let chartToBrokerAttrMap: ChartToBrokerAttributeMap = getContext(ChartToBrokerAttributeMap.CONTEXT_KEY);

    //Function to add a chart to the DOM
    function addChart() {
        if (chartsToDisplay.length < 5) {
            chartsToDisplay = [...chartsToDisplay, chartsAvailable.pop()];
        }
    }

    //Function to remove a chart from the DOM
    function removeChart(id: number) {
        chartsToDisplay = chartsToDisplay.filter((i) => i.id != id);
        chartsAvailable.push({ id: id, component: Chart });
        chartsAvailable.sort((a, b) => {
            return b.id - a.id;
        });
        chartToBrokerAttrMap.resetChartToBrokerAttributeMap(id);
    }

    //Function to stop charting
    function stopCharting() {
        if (isCharting && sempPoller) {
            clearInterval(sempPoller);
            isCharting = false;
        }
    }

    //On destroy, ensure to stop charting to kill the timer
    onDestroy(() => stopCharting());

    //Aync fetch function
    async function fetchVpnMonitorStats(sempConnection: SempConnection, attrs: string[]) {
        const response = await fetch(sempConnection.buildVpnMonitorUrl(attrs), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: sempConnection.buildAuthHeader(),
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(response.status + ':' + response.statusText);
        }
    }

    //Function to start charting
    function startCharting() {
        //Ensure that atleast 1 attribute is selected
        if (!chartToBrokerAttrMap.isABrokerAttributeSet()) noAttributes = true;
        else {
            //First clear all charts
            chartsToDisplay.forEach((chart) => chart.component.clearChart());

            //Set the isCharting flag to true to disable all controls
            isCharting = true;

            //Start the interval timer for SEMP polling
            sempPoller = setInterval(() => {
                //Get the chart->broker->attribute map
                let brokerToAttrMap = chartToBrokerAttrMap.getBrokerToAttributesMap();
                brokerToAttrMap.forEach((attrs: string[], brokerId: number) => {
                    let timeStamp = new Date(); //Timestamp for chart polling

                    //Get the SEMP connection object
                    let sempConnection: SempConnection = $brokerStore.find(
                        (broker: SempConnection) => broker.id == brokerId,
                    );

                    //If there are attributes for the sempConnection then proceed to fetch
                    if (sempConnection && attrs.length > 0) {
                        console.log(`Polling ${sempConnection.label} - ${sempConnection.buildVpnMonitorUrl(attrs)}...`);
                        fetchVpnMonitorStats(sempConnection, attrs)
                            .then((response) => {
                                //Clear out the polling errors if applicable
                                if (pollingErrorMessages.length > 0)
                                    pollingErrorMessages = pollingErrorMessages.filter(
                                        (errorMessage) => pollingErrorMessages.brokerId == sempConnection.id,
                                    );
                                //Get the chartIds that are registered for the broker's updates
                                let chartIds = chartToBrokerAttrMap.getChartsForBroker(brokerId);

                                //Push the update to the respective chart
                                chartsToDisplay.forEach((chart) => {
                                    if (chartIds.includes(chart.id))
                                        chart.component.addChartData(timeStamp, brokerId, response.data);
                                });
                            })
                            .catch((err: Error) => {
                                //Build the error message and update
                                let errorMessage = `Error polling ${sempConnection.label} - ${err.message}`;

                                if (pollingErrorMessages.length == 0)
                                    pollingErrorMessages = [{ brokerId: sempConnection.id, error: errorMessage }];
                                else
                                    pollingErrorMessages = pollingErrorMessages.map((pollErr) =>
                                        pollErr.brokerId == sempConnection.id
                                            ? { ...pollErr, error: errorMessage }
                                            : pollErr,
                                    );
                            });
                    }
                });
            }, parseInt(pollingInterval) * 1000);
        }
    }
</script>

<style>
    .pb-15 {
        padding-bottom: 15px;
    }

    .pt-10 {
        padding-top: 10px;
    }

    .mt-10 {
        margin-top: 10px;
    }

    .flex {
        display: flex;
    }

    .inline-flex {
        position: relative;
    }

    .right-content {
        justify-content: flex-end;
    }

    .left-content {
        justify-content: flex-start;
    }

    .center-content {
        justify-content: center;
        align-content: center;
    }

    .border-white {
        border: 2px dotted white;
        border-radius: 25px;
    }
</style>

<ComposedModal
    open={noAttributes}
    danger={true}
    on:submit={() => {
        noAttributes = false;
    }}>
    <ModalHeader title="Unable to chart" />
    <ModalBody>Please select one attribute to chart</ModalBody>
    <ModalFooter primaryButtonText="Ok" />
</ComposedModal>

<ComposedModal
    open={!$brokerStore || !$brokerStore.find((broker) => broker.isConnected)}
    danger={true}
    on:submit={() => {
        push('#/Settings');
    }}>
    <ModalHeader
        title="Connect one broker"
        on:click={() => {
            push('#/Settings');
        }} />
    <ModalBody>Please add and connect atleast one broker in the settings screen.</ModalBody>
    <ModalFooter primaryButtonText="Ok" />
</ComposedModal>

<Grid>
    <Row>
        <Column>
            <h1>Charts</h1>
        </Column>
    </Row>
    <Row>
        <Column noGutter={true}>
            <div class="flex pt-10">
                {#if !isCharting}
                    <Button icon={ChartArea16} kind="primary" on:click={startCharting}>Start Charting</Button>
                {:else}
                    <Button icon={ChartArea16} kind="primary" on:click={stopCharting} style="background-color:red">
                        Stop Charting
                    </Button>
                {/if}
            </div>
        </Column>
        <Column>
            <div class="flex left-content">
                <Select disabled={isCharting} labelText="Polling Interval (in seconds)" bind:selected={pollingInterval}>
                    <SelectItem value="1" text="1s" />
                    <SelectItem value="5" text="5s" />
                    <SelectItem value="10" text="10s" />
                    <SelectItem value="30" text="30s" />
                    <SelectItem value="60" text="60s" />
                </Select>
            </div>
        </Column>

        <Column>
            <div class="flex right-content pt-10">
                <Button disabled={isCharting} icon={AlarmAdd16} kind="tertiary" on:click={addChart}>Add Chart</Button>
            </div>
        </Column>
    </Row>
    {#each pollingErrorMessages as { error }}
        <Row>
            <Column>
                <div class="flex center-content">
                    <ToastNotification kind="error" notificationType="inline" title={error} hideCloseButton={true} />
                </div>
            </Column>
        </Row>
    {/each}

    <Row>
        <Column>
            {#each chartsToDisplay as { id, component } (id)}
                <div class="border-white mt-10">
                    <Chart chartId={id} bind:this={component} close={removeChart} disabled={isCharting} />
                </div>
            {/each}
        </Column>
    </Row>
</Grid>
