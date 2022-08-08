<script lang="ts">
	import Segment from "./lib/Segment.svelte";
	import { TimeSegment } from "./lib/TimeSegment";
import { Looper } from "./lib/util";

	let segments = [
		new TimeSegment(2000, "First label"),
	];

	$: segmentEnds = (() => {
		const ends = [];
		for (const segment of segments) {
			ends.push((ends.at(-1) ?? 0) + segment.duration);
		} 
		return ends;
	})();

	const appendSegment = () => {
		segments.push(new TimeSegment(2000));
		segments = segments;
	};


	let running = false;
	let offset = 0;
	let lastStartOffset = 0;

	let currentSegmentIndex = 0;
	$: segments, currentSegmentIndex = (() => {
		while (offset >= segmentEnds[currentSegmentIndex] ?? Infinity) {
			currentSegmentIndex++;
		}
		return currentSegmentIndex;
	})();

	let lastStartMs = null;
	const looper = new Looper(msSincePageLoad => {
		if (lastStartMs === null) {
			lastStartMs = msSincePageLoad;
		}
		offset = msSincePageLoad + lastStartOffset - lastStartMs;

		while (offset >= segmentEnds[currentSegmentIndex] ?? Infinity) {
			currentSegmentIndex++;

			if (currentSegmentIndex >= segments.length) break;
		}

		if (currentSegmentIndex >= segments.length) {
			offset = segmentEnds.at(-1) ?? 0;
			pauseRunner();
		}
	});
	const startRunner = () => {
		running = true;
		lastStartOffset = offset;
		looper.start();
	};
	const pauseRunner = () => {
		running = false;
		lastStartMs = null;
		looper.stop();
	};

	const toggle = () => {
		if (!running) {
			startRunner();
		} else {
			pauseRunner();
		}
	};

	const reset = () => {
		pauseRunner();

		offset = 0;
		lastStartOffset = 0;

		currentSegmentIndex = 0;
	};

	$: currentSegment = segments[currentSegmentIndex];
	$: currentSegmentMs = offset - (segmentEnds[currentSegmentIndex - 1] ?? 0)
	$: currentSegmentProgress = currentSegmentMs / (currentSegment?.duration ?? Infinity);
	$: done = currentSegmentIndex >= segments.length;

	const deleteSegment = ({detail: segment}: {detail: TimeSegment}) => {
		segments.splice(segments.indexOf(segment), 1);
		segments = segments;
	};
</script>

<main>
	<segments-list>
		{#each segments as segment, i}
			<Segment {segment}
					index={i}
					{currentSegmentIndex}
					{currentSegmentProgress}
					on:delete={deleteSegment}
					on:duration-change={() => segments = segments} />
		{/each}

		<button on:click={appendSegment}>+</button>
	</segments-list>
	
	<controls->
		<button on:click={toggle}>Go</button>
		<button on:click={reset}>Reset</button>

		<span>{Math.round(offset)}</span>
	</controls->
</main>

<style lang="scss">
	main {
		display: flex;
		gap: 4em;

		> * {
			display: flex;
			flex-flow: column;
			gap: 1em;
		}
	}
</style>