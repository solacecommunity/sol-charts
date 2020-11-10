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

    let isSideNavOpen = false;
</script>

<style lang="scss" global>
    /** Gray 100 theme **/
    @import 'carbon-components-svelte/css/g100';
    @import '@carbon/charts/styles-g100';
</style>

<main>
    <Header company="SolCharts" platformName="" bind:isSideNavOpen>
        <img src="images/solly_icon.jpg" />

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
                icon={SettingsAdjust20}
                on:click={() => {
                    push('#/Settings');
                }} />
            <HeaderGlobalAction
                aria-label="Charts"
                icon={ChartArea20}
                on:click={() => {
                    push('#/Charts');
                }} />
        </HeaderUtilities>
    </Header>

    <Content>
        <Router {routes} />
    </Content>
</main>
