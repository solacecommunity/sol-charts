<script lang="ts">
    import { Grid, Row, Column } from 'carbon-components-svelte';
</script>

<style>
    .center-content {
        display: flex;
        justify-content: center;
        align-content: center;
    }
</style>

<Grid>
    <Row>
        <Column>
            <div class="center-content">
                <h1>NOT FOUND</h1>
            </div>
        </Column>
    </Row>
    <Row>
        <Column>
            <div class="center-content"><img src="images/goodbye_otter_v3.gif" alt="404" /></div>
        </Column>
    </Row>
</Grid>
