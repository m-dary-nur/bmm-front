<script>
   import Fa from "svelte-fa"
   import { faPencilAlt, faTrashAlt } from "@fortawesome/pro-regular-svg-icons"
   import VirtualList from "@sveltejs/svelte-virtual-list"
   import { menu } from "../stores"
   import highlight from "../helpers/highlight"
   import thousand from "../helpers/thousand"

   export let datas
   export let countLabel
   export let heads
   export let actions

   let start

   const icons = {
      "pencil-alt": faPencilAlt, 
      "trash-alt": faTrashAlt,
   }
   let search = ""
   let timer
   
   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1   

   const debounce = v => {
      clearTimeout(timer)
      timer = setTimeout(() => search = v, 800)
   }

   const display = heads.map(o => (o.render ? o.render : o.key))

   $: dataFilter = $datas.filter(x => display.some(render => {
      const str = typeof render === "function"
         ? render(x)
         : x[render] && x[render] !== null 
         ? x[render]
         : ""
      return str.toString().toLowerCase().includes(search.toLowerCase())
   })) || []

   $: if (dataFilter) {
      console.log(dataFilter)
   }
</script>

<div class="pt-2 md:pt-4">
   <div class="flex justify-between mx-4 mt-2 mb-4 md:mx-10 md:mt-4 md:mb-3">
      <div class="w-1/2 md:w-2/3 flex items-center pb-2">
         <span class="font-bold whitespace-no-wrap">{thousand(dataFilter.length)}</span> &nbsp;{countLabel}
      </div>
      <div class="w-1/2 md:w-1/3 flex justify-end items-center">
         <input 
            on:keyup={({ target: { value } }) => debounce(value)} 
            class="w-full bg-transparent px-2 leading-7 border-0 border-b-2 focus:border-theme transition-colors duration-300"
            placeholder="Cari..."
            spellcheck="false"
         />
      </div>
   </div>
   <div class="scrolling-table-auto">
      <table class="w-full">
         <thead>
            <tr>
               <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap">#</th>
               {#each heads as head (head.key)}
                  <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap">
                     {head.label}
                  </th>
               {/each}
               <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap"></th>
            </tr>
         </thead>
         <tbody>            
            {#if dataFilter.length > 0}
               {#each dataFilter as data, i (data.id)}
                  <tr class="hover:bg-gray-100">
                     <td class="px-4 py-2 border-t border-gray-200 min-w-42 md:min-w-0">{i + 1}</td>
                     {#each heads as head (head.key)}
                        <td class="px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0">                     
                           {@html highlight(head.render ? head.render(data) : data[head.key], search).join("")}
                           {#if head.right && head.right(data)}
                              {@html head.right(data)}
                           {/if}
                        </td>
                     {/each}
                     <td class="p-1 flex justify-evenly items-center border-t border-gray-200 min-w-42 md:min-w-0">
                        {#each actions as action}
                           <button on:click={() => action.execute(data)} disabled={$menu && !allow(action.key, action.action)} class="p-3 hover:bg-theme-100 border-0 rounded-full transition-colors duration-300">
                              <Fa icon={icons[action.icon]} class={action.iconClass} />                           
                           </button>
                        {/each}
                     </td>
                  </tr> 
               {/each}
            {:else}
               <tr>
                  <td 
                     colspan={heads.length + 2}
                     class="text-center px-4 py-8 border-t border-gray-200"
                  >Tidak ada data.</td>
               </tr>
            {/if}
         </tbody>
      </table>
   </div>
</div>

<style>

@media only screen and (max-width: 768px) {
   .scrolling-table-auto {
      overflow-y: auto;
      height: calc(100vh - 147px);
   }
}

@media only screen and (min-width: 769px) {
   .scrolling-table-auto {
      overflow-y: auto;
      height: calc(100vh - 181px);
   }
}
</style>
