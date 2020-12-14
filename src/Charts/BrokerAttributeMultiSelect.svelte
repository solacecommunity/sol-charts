<script lang="ts">
import { Button, Tag, MultiSelect, Row, Column } from 'carbon-components-svelte';
import { getContext, onMount } from 'svelte';
import { ChartAttributeMaps } from './ChartAttributeMaps';
import { getVpnMonitorAttributeDictionary } from '../dict/MonitorAttributes';
import BrokerClientMultiSelect from './BrokerClientMultiSelect.svelte';
import ArrowShiftDown16 from 'carbon-icons-svelte/lib/ArrowShiftDown16';
import MacShift16 from 'carbon-icons-svelte/lib/MacShift16';

export let chartId: number;
export let brokerId: number;
export let brokerLabel: string;
export let sempVer: number;
export let disabled = false;

let showClientAttributes = false;

let selectedAttributes = [];
let tagList = [];

let VPN_MONITOR_ATTRIBUTES = [];

let chartAttributeMaps: ChartAttributeMaps = getContext(ChartAttributeMaps.CONTEXT_KEY);

//Function to remove an attribute from the select list
function removeAttribute(id: string) {
    if (!disabled) {
        tagList = tagList.filter((tag) => tag.id != id);
        selectedAttributes = selectedAttributes.filter((selection) => selection != id);
    }
}

//Reactive block to detect changes in attribute selections in order to update the tags
$: {
    //Attribute list length limited to 4
    if (selectedAttributes.length > 4) selectedAttributes.pop();
    else updateAttributeTags(selectedAttributes);
}

//Function to update the attribute tags
function updateAttributeTags(selections: string[]) {
    tagList = [];

    if (selections.length > tagList.length)
        VPN_MONITOR_ATTRIBUTES.forEach((attribute) => {
            if (selections.find((selection) => selection == attribute.id)) {
                tagList = [...tagList, attribute];
            }
        });

    //Update the map of the chart -> broker -> attributes
    chartAttributeMaps.setAttributesToChartBroker(chartId, brokerId, selections);
}

onMount(async () => {
    VPN_MONITOR_ATTRIBUTES = getVpnMonitorAttributeDictionary(sempVer);
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

.pt-10 {
    padding-top: 10px;
}

.pl-10 {
    padding-left: 10px;
}

.mb-10 {
    margin-bottom: 10px;
}
</style>

<Row>
    <Column>
        <div class="pl-10">
            <MultiSelect
                disabled="{disabled}"
                titleText="{brokerLabel} Attributes"
                placeholder="Select {brokerLabel} attributes to chart (Max 4)..."
                filterable
                items="{VPN_MONITOR_ATTRIBUTES}"
                bind:selectedIds="{selectedAttributes}"
            />
        </div>
    </Column>
    <Column>
        <div class="center-content">
            {#each tagList as { id, text }}
                <Tag filter type="high-contrast" on:click="{() => removeAttribute(id)}">{text}</Tag>
            {/each}
        </div>
    </Column>
</Row>
<Row>
    <Column>
        <div class="center-content pt-10">
            {#if !showClientAttributes}
                <Button
                    icon="{ArrowShiftDown16}"
                    kind="tertiary"
                    size="small"
                    style="border:none"
                    on:click="{() => {
                        showClientAttributes = true;
                    }}"
                >
                    Show Client Attributes
                </Button>
            {:else}
                <Button
                    icon="{MacShift16}"
                    kind="tertiary"
                    style="border:none"
                    size="small"
                    on:click="{() => {
                        showClientAttributes = false;
                    }}"
                >
                    Hide Client Attributes
                </Button>
            {/if}
        </div>
    </Column>
</Row>

{#if showClientAttributes}
    <div class="mb-10">
        <Row>
            <Column>
                <BrokerClientMultiSelect
                    chartId="{chartId}"
                    brokerId="{brokerId}"
                    brokerLabel="{brokerLabel}"
                    disabled="{disabled}"
                    sempVer="{sempVer}"
                />
            </Column>
        </Row>
    </div>
{/if}
