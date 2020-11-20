<script lang="ts">
import { Icon, Tag, MultiSelect, Row, Column } from 'carbon-components-svelte';
import { getContext, onMount } from 'svelte';
import { ChartAttributeMaps, ClientAttributes } from './ChartAttributeMaps';
import { CLIENT_MONITOR_ATTRIBUTES } from '../dict/MonitorAttributes';
import { brokerStore, SempConnection } from '../store';
import WatsonHealthRotate_36016 from 'carbon-icons-svelte/lib/WatsonHealthRotate_36016';

export let chartId: number;
export let brokerId: number;
export let brokerLabel: string;
export let disabled = false;

let nodeAttributeDisabled = true;

let selectedClientAttributes = [];
let attributeTagList = [];

let clientTagList = [];
let clientList = [];
let selectedClients = [];

let chartAttributeMaps: ChartAttributeMaps = getContext(ChartAttributeMaps.CONTEXT_KEY);

let sempConnection: SempConnection = $brokerStore.find((broker: SempConnection) => broker.id == brokerId);

//Async fetch function for getting the clients connected to the VPN
async function fetchVpnClients() {
    const response = await fetch(sempConnection.buildVpnClientUrl(), {
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

function populateClientList() {
    fetchVpnClients().then(({ data }) => {
        selectedClients = [];
        clientTagList = [];
        clientList = [];
        data.forEach(({ clientName, clientAddress, clientUsername }) => {
            clientList = [
                ...clientList,
                {
                    id: clientName,
                    text: `ClientName: ${clientName},Address: ${clientAddress},Username:${clientUsername}`,
                },
            ];
        });
    });
}

//Function to remove an a client from the select list
function removeClient(id: string) {
    if (!(disabled && nodeAttributeDisabled)) {
        clientTagList = clientTagList.filter((tag) => tag.id != id);
        selectedClients = selectedClients.filter((selection) => selection != id);
    }
}

//Function to update the client tags
function updateClientTags(selections: string[]) {
    clientTagList = [];

    if (selections.length > clientTagList.length)
        clientList.forEach((client) => {
            if (selections.find((selection) => selection == client.id)) {
                clientTagList = [...clientTagList, client];
            }
        });

    //Clear out the clientAttributes
    if (selections.length == 0) {
        selectedClientAttributes = [];
        chartAttributeMaps.resetChartToBrokerClientsAttributeMap(chartId);
        nodeAttributeDisabled = true;
    } else {
        nodeAttributeDisabled = false;
    }

    //Update the map of the chart -> broker -> clients,attributes
    chartAttributeMaps.setClientsToChartBrokerAttributes(chartId, brokerId, selections);
}

//Function to update the attribute tags
function updateAttributeTags(selections: string[]) {
    attributeTagList = [];

    if (selections.length > attributeTagList.length)
        CLIENT_MONITOR_ATTRIBUTES.forEach((attribute) => {
            if (selections.find((selection) => selection == attribute.id)) {
                attributeTagList = [...attributeTagList, attribute];
            }
        });

    //Update the map of the chart -> broker -> clients, attributes
    chartAttributeMaps.setAttributesToChartBrokerClient(chartId, brokerId, selections);
}

//Function to remove an attribute from the select list
function removeAttribute(id: string) {
    if (!(disabled && nodeAttributeDisabled)) {
        attributeTagList = attributeTagList.filter((tag) => tag.id != id);
        selectedClientAttributes = selectedClientAttributes.filter((selection) => selection != id);
    }
}

//Reactive block to detect changes in attribute selections in order to update the tags
$: {
    //Attribute list length limited to 4
    if (selectedClients.length > 4) selectedClients.pop();
    else updateClientTags(selectedClients);

    if (selectedClientAttributes.length > 4) selectedClientAttributes.pop();
    else updateAttributeTags(selectedClientAttributes);

    if (disabled) {
        nodeAttributeDisabled = true;
    }
}

onMount(async () => {
    populateClientList();
});
</script>

<style>
.center-content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.pl-10 {
    padding-left: 25px;
}

.refresh-button {
    font-size: 10px;
    vertical-align: middle;
    cursor: pointer;
}
</style>

<Row>
    <Column>
        <div class="pl-10">
            <MultiSelect
                disabled="{disabled}"
                titleText="{brokerLabel} Clients"
                placeholder="Select {brokerLabel} clients to chart (Max 4)..."
                filterable
                bind:items="{clientList}"
                bind:selectedIds="{selectedClients}"
            />
            <div class="refresh-button" on:click="{populateClientList}">
                <Icon style="padding-top:5px" render="{WatsonHealthRotate_36016}" />
                Refresh Clients
            </div>
        </div>
    </Column>
    <Column>
        <div class="center-content">
            {#each clientTagList as { id, text }}
                <Tag filter type="high-contrast" on:click="{() => removeClient(id)}">{text}</Tag>
            {/each}
        </div>
    </Column>
</Row>
<Row>
    <Column>
        <div class="pl-10">
            <MultiSelect
                bind:disabled="{nodeAttributeDisabled}"
                titleText="{brokerLabel} Client Attributes"
                placeholder="Select {brokerLabel} Client Attributes to Chart (Max 4)..."
                filterable
                items="{CLIENT_MONITOR_ATTRIBUTES}"
                bind:selectedIds="{selectedClientAttributes}"
            />
        </div>
    </Column>
    <Column>
        <div class="center-content">
            {#each attributeTagList as { id, text }}
                <Tag filter type="high-contrast" on:click="{() => removeAttribute(id)}">{text}</Tag>
            {/each}
        </div>
    </Column>
</Row>
