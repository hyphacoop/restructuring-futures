<script>
    import ShareViewer from "../Components/ShareViewer.svelte";
    import AddShare from "../ShareSettings/AddShare.svelte";
    import Tooltip from "../Components/Tooltip.svelte";
    import RemoveShare from "../ShareSettings/RemoveShare.svelte";
  import RedeemInvitation from "../InvitationUrl/RedeemInvitation.svelte";
</script>
<div class='flex flex-col items-start pb-24'>
    <h3>
        workspace settings
    </h3>
    <h4>
        all workspace shares
        <Tooltip text='tool tip on hover explaining what "shares" means'><sup class="font-features sups">?</sup></Tooltip>

    </h4>
    <ShareViewer />
    <AddShare />
    <RedeemInvitation />
    <RemoveShare />

</div>