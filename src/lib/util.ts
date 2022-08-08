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
