<script lang="ts">
	import {createEventDispatcher} from "svelte";
	import {fly, fade} from "svelte/transition";
	import type {TransitionConfig} from "svelte/transition";
	import {quartIn, quartOut} from "svelte/easing";
	import type {TimeSegment} from "./TimeSegment";

	const dispatch = createEventDispatcher<{
		delete: {segment: TimeSegment, index: number},
		"duration-change": {segment: TimeSegment, index: number},
	}>();

	export let segment: TimeSegment;

	export let index: number;
	export let currentSegmentIndex: number;
	export let currentSegmentProgress: number;

	$: progress =
			index < currentSegmentIndex ? 1 :
			index > currentSegmentIndex ? 0 :
			currentSegmentProgress;

	const lerp = (t: number, a: number, b: number) => a + t * (b - a);

	const expand = (node: Element, {duration, easing}: TransitionConfig) => {
		const height = parseInt(getComputedStyle(node).height);

		return {
			duration,
			easing,
			css: (t: number) => `
height: ${t * height}px;
padding: ${t * 0.5}em;
margin: ${(1 - t) * -0.5}em 0;
border-width: ${t * 1}px;
overflow-y: hidden;`,
		};
	};
</script>

<segment- style:--progress={progress}
		transition:expand={{easing: quartOut}}>
	<button on:click={() => dispatch("delete", {segment, index})}>×</button>

	<input type="text"
			placeholder="Label"
			bind:value={segment.label} />
	<input type="number"
			min="0"
			step="500"
			bind:value={segment.duration}
			on:input={() => dispatch("duration-change", {segment, index})} />
</segment->

<style lang="scss">
	segment- {
		display: flex;
		flex-flow: column;
		gap: 0.5em;
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