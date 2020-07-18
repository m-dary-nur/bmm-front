<script>
   import { quintOut } from "svelte/easing"
   import { crossfade } from "svelte/transition"
   import { flip } from "svelte/animate"
   import { url, goto } from "@sveltech/routify"
   import Fa from "svelte-fa"
   import { 
      faCogs,
      faUsers,
      faUserTie,
      faBallPile,
      faClipboardListCheck,
      faFileSpreadsheet,
   } from "@fortawesome/pro-regular-svg-icons" 

   import { appname, menu } from "../stores"

   let segment = ""   
   let mparent = $menu.filter(x => x.parentId === 0)
   let mchild = p => $menu.filter(x => x.parentId === p.id && x.action === "view")

   const iconlist = {
      "cogs": faCogs,
      "users": faUsers,
      "user-tie": faUserTie,
      "ball-pile": faBallPile,
      "clipboard-list-check": faClipboardListCheck,
      "file-spreadsheet": faFileSpreadsheet,
   }

   const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),
		fallback(node, params) {
			const style = getComputedStyle(node);
         const transform = style.transform === 'none' ? '' : style.transform;
         const returner = {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			}
			return returner
		}
	})
</script>

<div class="z-50 absolute md:relative h-full animate-slide-in-right">
   <div class="bg-theme text-white w-64 h-full px-4 shadow rounded-r-lg">
      <div class="h-full overflow-y-auto">
         <h3 class="sticky top-0 font-bold text-lg text-center text-white bg-theme py-4 z-10">{$appname}</h3>
         <div class="flex flex-col">
            {#if mparent.length > 0}
               {#each mparent as p (p.id)}
                     <div key={p.id} class="flex flex-col py-2">
                        <h3 class="flex items-center text-white font-bold opacity-50 py-2">
                           <Fa icon={iconlist[p.icon]} class="pr-2" />
                           {p.label}
                        </h3>
                        <div class="flex flex-col">
                           {#each mchild(p) as c (c.id)}
                              <div
                                 in:receive="{{key: c.id}}"
                                 on:click={() => $goto(c.link)}
                                 class={`${segment === c.key && "bg-theme-400"} flex items-center flex-no-wrap px-4 py-2 text-white rounded-full transition-colors duration-200 cursor-pointer whitespace-no-wrap`}
                              >
                                 <div class="w-6 text-center mr-1">
                                    <Fa icon={iconlist[c.icon]} />
                                 </div>
                                 {c.label}
                              </div>
                           {/each}
                        </div>
                     </div>
               {/each}
            {/if}
         </div>
      </div>
   </div>
</div>