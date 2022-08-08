export class Looper {
	#timerHandle = 0;
	#iterationCallback: FrameRequestCallback;

	get stopped() {
		return this.#timerHandle === 0;
	}

	constructor(readonly onIteration: (msSinceLastStart: number) => void) {
		this.#iterationCallback = this.createIterationCallback();
	}

	start() {
		if (!this.stopped) return;

		this.#timerHandle = requestAnimationFrame(this.#iterationCallback);
	}

	stop() {
		cancelAnimationFrame(this.#timerHandle);
		this.#timerHandle = 0;
	}

	createIterationCallback(): FrameRequestCallback {
		return msSincePageLoad => {
			this.onIteration(msSincePageLoad);

			if (this.stopped) return;
			this.#timerHandle = requestAnimationFrame(this.#iterationCallback);
		};
	}
}

export const formatTimespan = (timespan: number) => {
	const nSeconds = timespan / 1000 % 60;
	const nMinutes = Math.floor(timespan / 1000 / 60 % 60);
	const nHours = Math.floor(timespan / 1000 / 60 / 60);
	return `${nHours.toString().padStart(2, "0")}:${
			nMinutes.toString().padStart(2, "0")}:${
			nSeconds.toFixed(3).padStart(6, "0")}`;
};