import Settings from './Settings/Settings.svelte';
import Charts from './Charts/Charts.svelte';
import NotFound from './404.svelte';

//All Routes for the App
export default {
    '/': Settings,
    '/Settings': Settings,
    '/Charts': Charts,
    '*': NotFound
}

