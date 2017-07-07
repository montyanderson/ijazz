class JazzCreator {
	constructor() {

	}

	async start() {
		if(this.started == true) {
			return;
		}

		this.started = true;

		const ctx = new AudioContext();

		const toFrequency = n => Math.pow(2, (n - 49) / 12) * 440;

		const notes = [];

		for(let i = 0; i < 12; i++) {
			notes[i] = toFrequency(i + 48);
		}

		const beebop = [ 0, 2, 4, 5, 7, 8, 9, 11 ];

		async function playNote(i, ms) {
			const osc = ctx.createOscillator();

			osc.type = "triangle";
			osc.frequency.value = notes[i];

			osc.connect(ctx.destination);

			osc.start(0);

			await (new Promise(r => setTimeout(r, ms)));
			osc.stop();
		}

		let i = 0;

		const seed = Math.random();

		while(this.started == true) {
			const sin = Math.abs(Math.sin(i++));
			const scaleNote = Math.round(sin * 10000 * seed) % beebop.length;
			const duration = (2 ** (Math.round(sin * 400) % 3)) * 100;
			const note = beebop[scaleNote];

			console.log(sin, scaleNote, note, duration);
			await playNote(note, duration);
		}
	}

	stop() {
		this.started = false;
	}
}

(async () => {

	const jazz = new JazzCreator();

	const el = document.querySelector("#jazz");

	el.onclick = e => {
		if(jazz.started) {
			jazz.stop();

			el.childNodes[0].innerHTML = "Start Jazz";
		} else {
			jazz.start();
			el.childNodes[0].innerHTML = "Stop Jazz";
		}
	};

})();
