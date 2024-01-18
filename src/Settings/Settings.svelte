<script lang="ts">
import { Button, Grid, Row, Column } from 'carbon-components-svelte';
import AlarmAdd16 from 'carbon-icons-svelte/lib/AlarmAdd16';
import Plug16 from 'carbon-icons-svelte/lib/Plug16';
import Save16 from 'carbon-icons-svelte/lib/Save16';
import Folders16 from 'carbon-icons-svelte/lib/Folders16';
import Setting from './Setting.svelte';
import { onMount } from 'svelte';
import { saveAs } from 'file-saver';
import fileDialog from 'file-dialog';
import { SempConnection, brokerStore } from '../store';

// Limiting the amount of nodes available to poll to 5
let nodesAvailable = [
    { id: 5, component: Setting },
    { id: 4, component: Setting },
    { id: 3, component: Setting },
    { id: 2, component: Setting },
];
// Start off the display with a single node
let nodesToDisplay = [{ id: 1, component: Setting }];

// Error message for loading file
let loadFileErrorMessage = '';

//Function to add a node to the display
function addNode() {
    if (nodesToDisplay.length < 5) {
        nodesToDisplay = [...nodesToDisplay, nodesAvailable.pop()];
    }
}

//Function to remove a node from the display
function removeNode(id: number) {
    nodesToDisplay = nodesToDisplay.filter((i) => i.id != id);
    nodesAvailable.push({ id: id, component: Setting });
    nodesAvailable.sort((a, b) => {
        return b.id - a.id;
    });
    //Needs to be removed from the store as well
    brokerStore.removeBroker(id);
}

//Attempt to connect all the nodes in the display
function connectAll() {
    nodesToDisplay.forEach((setting) => {
        setting.component.connectAndStore();
    });
}

//Function to load a config file
function loadConfig() {
    fileDialog({ accept: 'application/json' }).then((files) => {
        let reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        reader.onload = (contents) => {
            try {
                brokerStore.loadConfig(JSON.parse(contents.target.result.toString()));
                init();
                loadFileErrorMessage = '';
            } catch (err) {
                loadFileErrorMessage = 'Unable to load file: ' + err;
                console.log(err);
            }
        };
    });
}

//Function to save configuration to a json file
function saveConfig() {
    let settings = [];
    let nodeCount = 0;
    $brokerStore.forEach((broker: SempConnection) => {
        let sempConnection = new SempConnection(
            ++nodeCount,
            false,
            broker.label,
            broker.sempUrl,
            broker.vpnName,
            broker.sempUser,
            broker.sempPassword,
        );
        settings.push(sempConnection);
    });
    if (settings.length > 0) {
        let blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
        saveAs(blob, 'Settings.json');
    }
}

//Function to initialize a component
function init() {
    nodesToDisplay.forEach((node) => {
        node.component.init();
    });

    for (let i = 2; i <= $brokerStore.length; i++) addNode();
}

onMount(async () => {
    init();
});
</script>

<style>
.border-white {
    border: 2px dotted white;
    border-radius: 25px;
}

.pb-15 {
    padding-bottom: 15px;
}

.pt-10 {
    padding-top: 5px;
}

.mt-10 {
    margin-top: 10px;
}

.flex {
    display: flex;
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
</style>

<Grid>
    <Row>
        <Column>
            <h1>Settings</h1>
        </Column>
    </Row>

    <Row>
        <Column>
            <div class="flex left-content pt-10">
                <Button icon="{Plug16}" kind="secondary" on:click="{connectAll}" style="background-color:green">
                    Connect All
                </Button>
            </div>
        </Column>
        <Column>
            <div class="flex right-content pb-15">
                <Button icon="{Save16}" kind="secondary" on:click="{saveConfig}">Save</Button>
            </div>
        </Column>
        <Column>
            <div class="flex left-content">
                <span style="font-color:red">{loadFileErrorMessage}</span>
                <Button icon="{Folders16}" kind="secondary" on:click="{loadConfig}">Load</Button>
            </div>
        </Column>
        <Column>
            <div class="flex right-content">
                <Button icon="{AlarmAdd16}" kind="tertiary" on:click="{addNode}">Add node</Button>
            </div>
        </Column>
    </Row>
    <Row>
        <Column>
            {#each nodesToDisplay as { id, component } (id)}
                <div class="mt-10 border-white">
                    {#key id}
                        <Setting nodeNumber="{id}" close="{removeNode}" bind:this="{component}" />
                    {/key}
                </div>
            {/each}
        </Column>
    </Row>
</Grid>