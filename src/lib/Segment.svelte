<script lang="ts">
	import {createEventDispatcher} from "svelte";
	import type {TimeSegment} from "./TimeSegment";

	const dispatch = createEventDispatcher();

	export let segment: TimeSegment;

	export let index: number;
	export let currentSegmentIndex: number;
	export let currentSegmentProgress: number;

	$: progress =
			index < currentSegmentIndex ? 1 :
			index > currentSegmentIndex ? 0 :
			currentSegmentProgress;
</script>

<segment- style:--progress={progress}>
	<button on:click={() => dispatch("delete", {segment})}>×</button>

	<input type="text"
			placeholder="Label"
			bind:value={segment.label} />
	<input type="number"
			min="0"
			step="500"
			bind:value={segment.duration}
			on:input={() => dispatch("duration-change", {segment})} />
</segment->

<style lang="scss">
	segment- {
		display: flex;
		flex-flow: column;
		gap: 0.5em;
		width: 20ch;
		border: 1px solid #eaa;
		padding: 0.5em;
		border-radius: 1em;

		--progress: 0;
		--progress-pct: calc(100% * var(--progress));
		background: linear-gradient(
			#eaa var(--progress-pct),
			#0000 var(--progress-pct),
		);
	}
</style>