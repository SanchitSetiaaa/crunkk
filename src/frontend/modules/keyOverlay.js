const KEY_CODES = {
	KeyW: "w",
	KeyA: "a",
	KeyS: "s",
	KeyD: "d",
	ShiftLeft: "shift",
	ShiftRight: "shift",
	Space: "space",
};
const MOUSE_BUTTONS = { 0: "lm", 2: "rm" };

const css = `
#glorp_keyOverlay {
	position: absolute;
	left: 20px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 999999;
	display: flex;
	flex-direction: column;
	gap: 4px;
	pointer-events: none;
	user-select: none;
	font-family: "GameFont", sans-serif;
}
#glorp_keyOverlay .koRow { display: flex; gap: 4px; justify-content: center; }
#glorp_keyOverlay .koKey {
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	background: rgba(0, 0, 0, 0.45);
	border: 2px solid rgba(255, 255, 255, 0.25);
	color: #fff;
	font-size: 16px;
	text-transform: uppercase;
	transition: background 40ms, color 40ms;
}
#glorp_keyOverlay .koWide { width: 70px; }
#glorp_keyOverlay .koSpace { width: 70px; }
#glorp_keyOverlay .koKey.pressed { background: rgba(255, 255, 255, 0.85); color: #000; }`;

class KeyOverlay {
	constructor() {
		this.overlay = document.createElement("div");
		this.overlay.id = "glorp_keyOverlay";
		this.overlay.innerHTML = `
			<style>${css}</style>
			<div class="koRow"><div class="koKey" data-key="w">W</div></div>
			<div class="koRow">
				<div class="koKey" data-key="a">A</div>
				<div class="koKey" data-key="s">S</div>
				<div class="koKey" data-key="d">D</div>
			</div>
			<div class="koRow">
				<div class="koKey koWide" data-key="shift">Shift</div>
				<div class="koKey koSpace" data-key="space">Space</div>
			</div>
			<div class="koRow">
				<div class="koKey koWide" data-key="lm">LM</div>
				<div class="koKey koWide" data-key="rm">RM</div>
			</div>`;

		this.keys = {};
		for (const el of this.overlay.querySelectorAll(".koKey")) this.keys[el.dataset.key] = el;

		window.glorp.settings.toggleKeyOverlay = (enabled) => this.toggle(enabled);
		this.toggle(true);
	}

	set(name, pressed) {
		this.keys[name]?.classList.toggle("pressed", pressed);
	}

	onKeyDown = (e) => this.set(KEY_CODES[e.code], true);
	onKeyUp = (e) => this.set(KEY_CODES[e.code], false);
	onMouseDown = (e) => this.set(MOUSE_BUTTONS[e.button], true);
	onMouseUp = (e) => this.set(MOUSE_BUTTONS[e.button], false);
	releaseAll = () => {
		for (const el of Object.values(this.keys)) el.classList.remove("pressed");
	};

	toggle(enabled) {
		const method = enabled ? "addEventListener" : "removeEventListener";
		// capture phase so game handlers calling stopPropagation don't hide inputs
		window[method]("keydown", this.onKeyDown, true);
		window[method]("keyup", this.onKeyUp, true);
		window[method]("mousedown", this.onMouseDown, true);
		window[method]("mouseup", this.onMouseUp, true);
		window[method]("blur", this.releaseAll);

		this.releaseAll();
		if (enabled) document.body.append(this.overlay);
		else this.overlay.remove();
	}
}

new KeyOverlay();
