<script lang="ts">
import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderUtilities,
    HeaderGlobalAction,
    SkipToContent,
    Content,
} from 'carbon-components-svelte';

import SettingsAdjust20 from 'carbon-icons-svelte/lib/SettingsAdjust20';
import ChartArea20 from 'carbon-icons-svelte/lib/ChartArea20';
import Router, { push } from 'svelte-spa-router';
import routes from './routes';
import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

const charting_store = writable(false);
charting_store.set(false);
setContext('isCharting', charting_store);

let isCharting = false;
charting_store.subscribe((val) => (isCharting = val));
</script>

<main>
    <Header company="SolCharts" platformName="">
        {#if !isCharting}
            <img src="images/solly_icon.png" alt="solly" width="35" height="49" />
        {:else}<img src="images/solly_animated_icon.gif" alt="solly_waving" width="35" height="49" />{/if}
        <div slot="skip-to-content">
            <SkipToContent />
        </div>

        <HeaderNav>
            <HeaderNavItem text="Settings" style="cursor:pointer" href="#/Settings" />
            <HeaderNavItem text="Charts" style="cursor:pointer" href="#/Charts" />
        </HeaderNav>

        <HeaderUtilities>
            <HeaderGlobalAction
                aria-label="Settings"
                icon="{SettingsAdjust20}"
                on:click="{() => {
                    push('#/Settings');
                }}"
            />
            <HeaderGlobalAction
                aria-label="Charts"
                icon="{ChartArea20}"
                on:click="{() => {
                    push('#/Charts');
                }}"
            />
        </HeaderUtilities>
    </Header>

    <Content>
        <Router routes="{routes}" />
    </Content>
</main>
