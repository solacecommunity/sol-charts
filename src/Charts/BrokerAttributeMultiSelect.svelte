<script lang="ts">
    import { Tag, MultiSelect, Row, Column } from 'carbon-components-svelte';
    import { getContext } from 'svelte';
    import { ChartToBrokerAttributeMap } from './ChartToBrokerAttributeMap';
    import { VPN_MONITOR_ATTRIBUTES } from '../dict/MonitorAttributes';

    export let chartId: number;
    export let brokerId: number;
    export let brokerLabel: string;
    export let disabled = false;

    let selectedAttributes = [];
    let tagList = [];

    let chartToBrokerAttrMap: ChartToBrokerAttributeMap = getContext(ChartToBrokerAttributeMap.CONTEXT_KEY);

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
        chartToBrokerAttrMap.setAttributesToChartBroker(chartId, brokerId, selections);
    }
</script>

<style>
    .center-content {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
</style>

<Row>
    <Column>
        <MultiSelect
            {disabled}
            titleText="{brokerLabel} Attributes"
            placeholder="Select {brokerLabel} attributes to chart (Max 4)..."
            filterable
            items={VPN_MONITOR_ATTRIBUTES}
            bind:selectedIds={selectedAttributes} />
    </Column>
    <Column>
        <div class="center-content">
            {#each tagList as { id, text }}
                <Tag filter type="high-contrast" on:click={() => removeAttribute(id)}>{text}</Tag>
            {/each}
        </div>
    </Column>
</Row>
