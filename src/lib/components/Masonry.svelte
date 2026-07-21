<script>
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';

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
        /** Number of skeleton cards to show while measuring container width */
        skeletonCount = 8,
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
    // Estimate columns for the pre-measure skeleton (SSR-safe default of 3)
    let estimatedCols = $derived(
        Math.max(1, Math.min(4, Math.floor(1200 / (minColWidth + gap)) || 3))
    );
</script>

<div
        class="masonry {className}"
        bind:clientWidth={masonryWidth}
        bind:clientHeight={masonryHeight}
        bind:this={div}
        style="gap: {gap}px; {style}"
>
    {#if masonryWidth !== 0}
        {#each itemsToCols as col, idx (idx)}
            <div class="col-id col-id-{idx} {columnClass}" style="gap: {gap}px; max-width: {maxColWidth}px;">
                {#if animate}
                    {#each col as [item, idx] (getId(item))}
                        <div
                                class="masonry-cell"
                                in:fade={{ delay: Math.min(idx * 30, 300), duration }}
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
                        <div class="masonry-cell">
                            {#if children}
                                {@render children({idx, item})}
                            {:else}
                                <span>{item}</span>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
        {/each}
    {:else}
        <!-- Full skeleton grid while measuring width — avoids a single thin strip -->
        <div class="masonry-skeleton" style="gap: {gap}px;" aria-hidden="true" aria-busy="true">
            {#each Array(estimatedCols) as _, colIdx (colIdx)}
                <div class="col-id skeleton-col" style="gap: {gap}px; max-width: {maxColWidth}px;">
                    {#each Array(Math.ceil(skeletonCount / estimatedCols)) as __, cardIdx (cardIdx)}
                        <div
                                class="skeleton-card"
                                style="aspect-ratio: {cardIdx % 3 === 0 ? '3/4' : cardIdx % 3 === 1 ? '4/5' : '2/3'};"
                        >
                            <div class="skeleton-shimmer"></div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    :where(:global(div.masonry)) {
        display: flex;
        justify-content: center;
        overflow-wrap: anywhere;
        box-sizing: border-box;
        min-height: 40vh;
    }

    :where(:global(div.masonry div.col-id)) {
        display: grid;
        height: max-content;
        width: 100%;
        align-content: start;
    }

    .masonry-cell {
        width: 100%;
        /* Cells never collapse to a hairline while children load */
        min-height: 1px;
    }

    .masonry-skeleton {
        display: flex;
        justify-content: center;
        width: 100%;
        min-height: 50vh;
    }

    .skeleton-col {
        display: grid;
        height: max-content;
        width: 100%;
        align-content: start;
    }

    .skeleton-card {
        width: 100%;
        min-height: 180px;
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d 40%, #161616);
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
    }

    .skeleton-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                105deg,
                transparent 35%,
                rgba(255, 255, 255, 0.04) 45%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.04) 55%,
                transparent 65%
        );
        background-size: 200% 100%;
        animation: masonry-shimmer 1.6s ease-in-out infinite;
    }

    @keyframes masonry-shimmer {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: -100% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .skeleton-shimmer {
            animation: none;
            background: rgba(255, 255, 255, 0.03);
        }
    }
</style>
