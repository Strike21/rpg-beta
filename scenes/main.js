args.level = args.level || 0;

const characters = {
	"a": {
		sprite: "ch1",
		msg: "ohhi tudo bem?",
	},
	"b": {
		sprite: "ch2",
		msg: "SAIA DAQUI!!!",
	},
};

const levels = [
	[
		"=======|==",
		"=        =",
		"= a      =",
		"=        =",
		"=        =",
		"=    $   =",
		"=        =",
		"=        =",
		"=   @    =",
		"==========",
	],
	[
		"==========",
		"=        =",
		"=  $     =",
		"=        =",
		"|        =",
		"=        =",
		"=      b =",
		"=        =",
		"=   @    =",
		"==========",
	],
];

addLevel(levels[args.level || 0], {
	width: 11,
	height: 11,
	pos: vec2(20, 20),
	"=": [
		sprite("steel"),
		solid(),
	],
	"$": [
		sprite("key"),
		"key",
	],
	"@": [
		sprite("guy"),
		"player",
	],
	"|": [
		sprite("door"),
		solid(),
		"door",
	],
	any(ch) {
		const char = characters[ch];
		if (char) {
			return [
				sprite(char.sprite),
				solid(),
				"character",
				{
					msg: char.msg,
				},
			];
		}
	},
});

const player = get("player")[0];

let hasKey = false;
let talking = null;

function talk(msg) {
	talking = add([
		text(msg),
	]);
}

player.overlaps("key", (key) => {
	destroy(key);
	hasKey = true;
	play("coin");
});

player.overlaps("door", () => {
	if (hasKey) {
		if (args.level + 1 < levels.length) {
			go("main", {
				level: args.level + 1,
			});
		} else {
			go("win");
		}
	} else {
		talk("you got no key!");
	}
});

player.overlaps("character", (ch) => {
	talk(ch.msg);
});

keyPress(["left", "right", "up", "down"], () => {
	if (talking) {
		destroy(talking);
		talking = null;
	}
});

keyPress("left", () => {
	player.moveLeft();
});

keyPress("right", () => {
	player.moveRight();
});

keyPress("up", () => {
	player.moveUp();
});

keyPress("down", () => {
	player.moveDown();
});
