<script lang="ts">
import {
    FluidForm,
    TextInput,
    PasswordInput,
    Button,
    Grid,
    Row,
    Column,
    ToastNotification,
} from 'carbon-components-svelte';
import Link16 from 'carbon-icons-svelte/lib/Link16';
import Unlink16 from 'carbon-icons-svelte/lib/Unlink16';
import Misuse16 from 'carbon-icons-svelte/lib/Misuse16';
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { SempConnection, brokerStore } from '../store';

export let nodeNumber: number;

let nodeLabel = 'Node ' + nodeNumber;
let sempUrl: string, vpnName: string, sempUser: string, sempPassword: string;
let connectError = false;
let connectErrorMessage = '';
let isConnected = false;

//Exported function to remove the component from the DOM by the parent
export let close = (id: number) => {};

export async function connectAndStore() {
    connectToBroker()
        .then((response) => {
            isConnected = true;
            connectError = false;

            let sempVer = response.data.sempVersion.split('.');

            let majorMinorVer = parseFloat(sempVer[0] + '.' + sempVer[1]);

            let sempConnection = new SempConnection(
                nodeNumber,
                true,
                nodeLabel,
                sempUrl,
                vpnName,
                sempUser,
                sempPassword,
                majorMinorVer,
            );
            console.log(`Connected to ${sempUrl} on ${majorMinorVer}...`);

            brokerStore.removeBroker(nodeNumber);
            brokerStore.addOrUpdateBroker(sempConnection);
        })
        .catch((err: Error) => {
            isConnected = false;
            connectError = true;
            connectErrorMessage = err.message;
        });
}

//Function to connect to the broker via semp and store
async function connectToBroker() {
    if (
        !isConnected &&
        nodeLabel !== '' &&
        sempUrl !== '' &&
        vpnName !== '' &&
        sempUser !== '' &&
        sempPassword !== ''
    ) {
        console.log(`Attempting to connect to ${sempUrl}...`);
        sempUrl = sempUrl.replace('/SEMP/v2/config', '').trim();

        if (sempUrl.charAt(sempUrl.length - 1) == '/') sempUrl = sempUrl.substring(0, sempUrl.length - 1);

        nodeLabel = nodeLabel.trim();
        vpnName = vpnName.trim();
        sempUser = sempUser.trim();
        sempPassword = sempPassword.trim();

        const response = await fetch(sempUrl + `/SEMP/v2/monitor/about/api`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa(sempUser + ':' + sempPassword),
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Unable to connect ' + response.statusText);
        }
    }
}

//Disconnect the broker so you can edit
function disconnect() {
    isConnected = false;
    let sempConnection = new SempConnection(nodeNumber, false, nodeLabel, sempUrl, vpnName, sempUser, sempPassword);
    brokerStore.removeBroker(nodeNumber);
    brokerStore.addOrUpdateBroker(sempConnection);
}

//Exported function to initialze the component from the parent
export function init() {
    let broker = $brokerStore.find((broker) => broker.id == nodeNumber);
    if (broker) {
        nodeLabel = broker.label;
        sempUrl = broker.sempUrl;
        sempUser = broker.sempUser;
        sempPassword = broker.sempPassword;
        vpnName = broker.vpnName;
        isConnected = broker.isConnected;
    }
}

//Initialize state onMount
onMount(async () => {
    init();
});
</script>

<style>
.center-content {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.right-content {
    display: flex;
    justify-content: flex-end;
}
</style>

<FluidForm>
    <Grid>
        <Row>
            <Column>
                <div class="right-content">
                    {#if nodeNumber != 1}
                        <Button
                            icon="{Misuse16}"
                            kind="tertiary"
                            size="small"
                            style="border:none"
                            on:click="{() => close(nodeNumber)}"
                        />
                    {:else}<br />{/if}
                </div>
            </Column>
        </Row>
        <Row>
            <Column>
                <TextInput disabled="{isConnected}" labelText="Broker label" required bind:value="{nodeLabel}" />
                <TextInput
                    disabled="{isConnected}"
                    labelText="SEMP URL:Port"
                    placeholder="https://host:port"
                    required
                    bind:value="{sempUrl}"
                />
                <TextInput
                    disabled="{isConnected}"
                    labelText="VPN Name"
                    placeholder="VPN Name"
                    required
                    bind:value="{vpnName}"
                />
                <TextInput
                    disabled="{isConnected}"
                    labelText="SEMP User"
                    placeholder="SEMP User"
                    required
                    bind:value="{sempUser}"
                />
                <PasswordInput
                    disabled="{isConnected}"
                    labelText="SEMP Password"
                    placeholder="SEMP Password"
                    bind:value="{sempPassword}"
                />
                <div class="center-content">
                    {#if !isConnected}
                        <Button icon="{Link16}" type="Submit" on:click="{connectAndStore}">Connect</Button>
                    {:else}
                        <Button icon="{Unlink16}" kind="Primary" on:click="{disconnect}" style="background-color:red">
                            Disconnect
                        </Button>
                    {/if}
                </div>
                <br />
            </Column>
        </Row>
        {#if connectError}
            <Row>
                <Column>
                    <div class="center-content" transition:fade>
                        <ToastNotification
                            kind="error"
                            notificationType="inline"
                            title="{connectErrorMessage}"
                            hideCloseButton="true"
                        />
                    </div>
                </Column>
            </Row>
        {/if}
    </Grid>
</FluidForm>
