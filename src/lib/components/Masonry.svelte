<script>
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';
    import autoAnimate from '@formkit/auto-animate';

    let {
        animate = true,
        calcCols = (masonryWidth, minColWidth, gap) => {
            return Math.min(items.length, Math.floor((masonryWidth + gap) / (minColWidth + gap)) || 1);
        },
        columnClass = ``,
        duration = 200,
        gap = 20,
        getId = (item) => {
            if (typeof item === `number`)
                return item;
            if (typeof item === `string`)
                return item;
            return item[idKey];
        },
        idKey = `id`,
        items,
        masonryHeight = $bindable(0),
        masonryWidth = $bindable(0),
        maxColWidth = 500,
        minColWidth = 330,
        style = ``,
        class: className = ``,
        children,
        div = $bindable(undefined),
    } = $props();

    $effect.pre(() => {
        if (maxColWidth < minColWidth) {
            console.warn(`svelte-bricks: maxColWidth (${maxColWidth}) < minColWidth (${minColWidth}).`);
        }
    });

    function getItemsToCols(items) {
        let cols = calcCols(masonryWidth, minColWidth, gap)
        return items.reduce((columns, item, idx) => {
            columns[idx % cols].push([item, idx]);
            return columns;
        }, Array(cols).fill(null).map(() => []));
    }

    let itemsToCols = $derived(getItemsToCols(items));

</script>

<div
        class="masonry {className}"
        bind:clientWidth={masonryWidth}
        bind:clientHeight={masonryHeight}
        bind:this={div}
        style="gap: {gap}px; {style}"
        use:autoAnimate
>
    {#if masonryWidth !== 0}
        {#each itemsToCols as col, idx}
            <div class="col-id col-id-{idx} {columnClass}" style="gap: {gap}px; max-width: {maxColWidth}px;">
                {#if animate}
                    {#each col as [item, idx] (getId(item))}
                        <div
                                in:fade={{ delay: 100, duration }}
                                out:fade={{ delay: 0, duration }}
                                animate:flip={{ duration }}
                        >
                            {#if children}
                                {@render children({idx, item})}
                            {:else}
                                <span>{item}</span>
                            {/if}
                        </div>
                    {/each}
                {:else}
                    {#each col as [item, idx] (getId(item))}
                        {#if children}
                            {@render children({idx, item})}
                        {:else}
                            <span>{item}</span>
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    {:else}
        <div class="col-12">
            <div class="placeholder-glow">
                <div class="placeholder bg-light-subtle rounded-4 w-100 h-100"></div>
            </div>
        </div>
    {/if}
</div>

<style>
    :where(:global(div.masonry)) {
        display: flex;
        justify-content: center;
        overflow-wrap: anywhere;
        box-sizing: border-box;
    }

    :where(:global(div.masonry div.col-id)) {
        display: grid;
        height: max-content;
        width: 100%;
    }

    .placeholder-glow {
        height: 60vh;
    }
</style>