<script>
    import { onMount } from "svelte"
// const {
//     children,
//     height = "100%",
//     width = "100%",
//     rowHeight = 50,
//     itemBuffer = 2,
// };
// const [scrollTop, ref, clientHeight] = useRefListener();
// const totalHeight = items.length * rowHeight;
// const startItem = Math.max(
//     0,
//     Math.floor(scrollTop / rowHeight) - itemBuffer
// );
// const visibleItemCount = Math.min(
//     items.length - startItem,
//     Math.ceil(clientHeight / rowHeight) + 2 * itemBuffer
// );
// const offsetY = startItem * rowHeight;
export let items = []
export let classes = ""
export let rowHeight = 50
export let startItem = 0
export let offsetY = 0
export const itemBuffer = 0

let visibleItemCount = 3

let totalHeight = items.length * rowHeight
let visibleItems = items.slice(startItem, startItem + visibleItemCount) 

const onScroll = e => {
    console.log("onScroll")
    let isProcess = false
    if (isProcess) return
    isProcess = true
    requestAnimationFrame(() => {
        isProcess = false
        startItem = Math.max(0, Math.floor(e.target.scrollTop / rowHeight) - itemBuffer)
        offsetY = startItem * rowHeight
    })
}

const onResize = e => {
    console.log("onResize")
    let isProcess = false
    if (isProcess) return
    isProcess = true
    requestAnimationFrame(() => {
        visibleItemCount = Math.floor(e.target.document.body.clientHeight / rowHeight)
        console.log(e.target.document.body.clientHeight, rowHeight)
        isProcess = false
    })
}
window.addEventListener("resize", onResize)

onMount(() => {
    console.log("onMount", items)
    visibleItems = items.slice(startItem, startItem + visibleItemCount)
})

$: if (items) {
    visibleItems = items.slice(startItem, startItem + visibleItemCount)
    totalHeight = items.length * rowHeight
}
</script>

<div class={`virtual-list ${classes}`} on:scroll={onScroll}>
    <div style="height: {totalHeight}px; padding-top: {offsetY}px">
        <slot virtualItems={visibleItems} index={startItem}>
            No data.
        </slot>
    </div>
</div>

<style>
    .virtual-list {
        overflow: auto;
    }
</style>