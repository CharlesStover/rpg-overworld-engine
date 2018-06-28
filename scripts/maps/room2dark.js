GAME.map.maps.room2dark = {
	block: 16,
	blocked: [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [0, 1, 1, 1], 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [0, 1, 0, 0], 0, 1],
		[1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
	color: "#000000",
	data: {exits: 0, talked: false},
	enter: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, function(){GAME.map.load("room1dark", 9, 2);}, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, function()
			{
				GAME.characters[0].stop();
				GAME.doing.step = true;
				if (GAME.map.maps.room2dark.data.exists == 2)
				{
					//GAME.doing.step = false;
					//GAME.functions.step(2);
					GAME.characters[0].stop();
					GAME.map.load("credits-demo", 0, 0);
				}
				else if (GAME.map.maps.room2dark.data.exists == 1)
				{
					GAME.message(
						"Really... There's nothing to do outside.",
						"Sleep sounds perfect for this weather.",
						function()
						{
							GAME.characters[0].step(2);
							GAME.map.maps.room2dark.data.exists = 2;
						}
					);
				}
				else
				{
					GAME.message(
						"It raining too hard.",
						"Better stay inside.",
						function()
						{
							GAME.map.maps.room2dark.data.exists = 1;
							GAME.characters[0].step(2);
						}
					);
				}
			}, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	functions: {
		thunder: function()
		{
			GAME.map.maps.room2dark.timeouts[0] = setTimeout(GAME.map.maps.room2dark.functions.thunderFar, GAME.random(0, 5000));
			GAME.map.maps.room2dark.timeouts[1] = setTimeout(GAME.map.maps.room2dark.functions.thunderMid, GAME.random(2500, 5000));
			GAME.map.maps.room2dark.timeouts[2] = setTimeout(GAME.map.maps.room2dark.functions.thunderNear, GAME.random(5000, 10000));
		},
		thunderFar: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-far-" + thunder, false);
			GAME.map.maps.room2dark.timeouts[0] = setTimeout(GAME.map.maps.room2dark.functions.thunderFar, GAME.random(5000, 10000));
		},
		thunderMid: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-mid-" + thunder, false);
			GAME.map.maps.room2dark.timeouts[1] = setTimeout(GAME.map.maps.room2dark.functions.thunderMid, GAME.random(5000, 10000));
		},
		thunderNear: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-near-" + thunder, false);
			GAME.map.maps.room2dark.timeouts[3] = setTimeout(
				function()
				{
					GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red.gif")');
					GAME.characters[1].$.css("background-image", 'url("./images/characters/pokemon/grandma.gif")');
					GAME.map.maps.room2dark.overlays[0].$.css("background-image", 'url("./images/maps/room2.gif")');
					GAME.map.maps.room2dark.overlays[2].$.css("background-image", 'url("./images/maps/room2-overlay.gif")');
					GAME.map.maps.room2dark.overlays[3].$.css("background-image", 'url("./images/maps/room2-overlay-2.gif")');
					GAME.map.maps.room2dark.timeouts[4] = setTimeout(
						function()
						{
							GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red-dark.gif")');
							GAME.characters[1].$.css("background-image", 'url("./images/characters/pokemon/grandma-dark.gif")');
							GAME.map.maps.room2dark.overlays[0].$.css("background-image", 'url("./images/maps/room2-dark.gif")');
							GAME.map.maps.room2dark.overlays[2].$.css("background-image", 'url("./images/maps/room2-dark-overlay.gif")');
							GAME.map.maps.room2dark.overlays[3].$.css("background-image", 'url("./images/maps/room2-dark-overlay-2.gif")');
						},
						200
					);
				},
				[1500, 0, 1000][thunder - 1]
			);
			GAME.map.maps.room2dark.timeouts[2] = setTimeout(GAME.map.maps.room2dark.functions.thunderNear, GAME.random(5000, 10000));
		},
		walk: function()
		{
			GAME.characters[1].step(
				1, 1, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1,
				GAME.map.maps[GAME.map.current].functions.walk
			);
		}
	},
	imgs: ["characters/pokemon/grandma.gif", "characters/pokemon/grandma-dark.gif", "characters/pokemon/red-dark.gif", "maps/room2.gif", "maps/room2-overlay.gif", "maps/room2-overlay-2.gif"],
	interaction: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, function(){GAME.message("The power is out...");}, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	loaded: function()
	{
		GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red-dark.gif")');
		GAME.character(
			{
				character: "Grandma",
				facing: 2,
				interaction: function()
				{
					this.facePlayer();
					if (GAME.map.maps.room2dark.data.talked)
						this.message(
							"Go back to bed.",
							function()
							{
								//GAME.characters[1].facing = 2;
								//GAME.characters[1].displayStep();
							}
						);
					else
					{
						GAME.map.maps.room2dark.data.talked = true;
						this.message(
							"Oh, did the storm wake you?",
							"I haven't seen a storm this bad in years.",
							"Go back to bed, sweetie.<br />You have school in the morning.",
							function()
							{
								GAME.characters[1].facing = 2;
								GAME.characters[1].displayStep();
							}
						);
					}
				},
				position: [7, 2]
			}
		);
		GAME.characters[1].$.css("background-image", 'url("./images/characters/pokemon/grandma-dark.gif")');
		GAME.map.maps.room2dark.overlays[3].$.css("z-index", 1002);
		GAME.map.maps[GAME.map.current].functions.walk();
		GAME.characters[1].say(
			"Hello!", 2500,	"Welcome to the demo.", 2500, "I am your average NPC.", 2500, "I will walk in this rectangular shape forever.", 2500, "I will also demonstrate", 1000, "that these messages", 1000,
			"can appear", 750, "at many", 750, "different", 500, "speeds.", 500, "A", 250, "B", 200, "C", 150, "D", 100, "E", 50, "F", 50, "G", 50, "H", 50, "I", 50, "J", 50, "K", 50, "elemeno", 50,
			"X", 150, "Y", 250, "Z", 500, "If you want to complete the game,", 2500, "just walk through the front door", 2500, "or go back to bed.", 2500
		);
		GAME.sound.play("rain-indoors-2");
		GAME.map.maps.room2dark.functions.thunder();
	},
	overlays: [
		{
			image: "maps/room2-dark.gif"
		},
		true,
		{
			image: "maps/room2-dark-overlay.gif"
		},
		{
			image: "maps/room2-dark-overlay-2.gif"
		}
	],
	sound: [
		"effects/weather_Jute/rain-indoors-2.mp3",
		"effects/weather_Jute/thunder-far-1.mp3",
		"effects/weather_Jute/thunder-far-2.mp3",
		"effects/weather_Jute/thunder-far-3.mp3",
		"effects/weather_Jute/thunder-mid-1.mp3",
		"effects/weather_Jute/thunder-mid-2.mp3",
		"effects/weather_Jute/thunder-mid-3.mp3",
		"effects/weather_Jute/thunder-near-1.mp3",
		"effects/weather_Jute/thunder-near-2.mp3",
		"effects/weather_Jute/thunder-near-3.mp3"
	],
	timeouts: []
};
GAME.map.load("room2dark");