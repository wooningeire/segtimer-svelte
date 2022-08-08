class Timespan {

}

let id = 0n;
export class TimeSegment {
	readonly id: bigint;

	constructor(
		readonly duration: number,
		readonly label: string="",
	) {
		this.id = id++;
	}
}