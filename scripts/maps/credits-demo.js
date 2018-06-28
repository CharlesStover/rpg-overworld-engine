GAME.map.maps["credits-demo"] = {
	block: 16,
	blocked: [
		[1]
	],
	color: "#000000",
	enter: [
		[0]
	],
	functions: {},
	imgs: [],
	interaction: [
		[0]
	],
	loaded: function()
	{
		GAME.credits(
			"Remember_Winter",
			"Programmed by Charles Stover",
			// "Story by Dylan<br /><br /><small>(Set in industrial London, a young, eager boy wakes up and<br />discovers that it is raining too hard.)<\/small>",
			"Graphics by Game Freak<br />Copyright &copy; Nintendo",
			// "Sound effects by Jute",
			// "Thanks for playing!",
			'<a href="?" onclick="location.reload(); return false;">Play Again?<\/a>'
		);
	},
	overlays: [true],
	sound: [
		"music/by/_YD/Remember_Winter.mp3"
	],
	timeouts: []
};
GAME.map.load("credits-demo");