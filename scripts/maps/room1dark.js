GAME.map.maps.room1dark = {
	block: 16,
	blocked: [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
	color: "#000000",
	data: {sure: false},
	enter: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, function(){GAME.map.load("room2dark", 9, 2);}, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	functions: {
		sleep: function()
		{
			if (GAME.map.maps.room1dark.data.sure)
				GAME.map.load("credits-demo", 0, 0);
			else
			{
				GAME.map.maps.room1dark.data.sure = true;
				GAME.message("Are you sure you want to go back to bed?");
			}
		},
		thunder: function()
		{
			GAME.map.maps.room1dark.timeouts[0] = setTimeout(GAME.map.maps.room1dark.functions.thunderFar, GAME.random(0, 5000));
			GAME.map.maps.room1dark.timeouts[1] = setTimeout(GAME.map.maps.room1dark.functions.thunderMid, GAME.random(2500, 5000));
			GAME.map.maps.room1dark.timeouts[2] = setTimeout(GAME.map.maps.room1dark.functions.thunderNear, GAME.random(5000, 10000));
		},
		thunderFar: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-far-" + thunder, false);
			GAME.map.maps.room1dark.timeouts[0] = setTimeout(GAME.map.maps.room1dark.functions.thunderFar, GAME.random(5000, 10000));
		},
		thunderMid: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-mid-" + thunder, false);
			GAME.map.maps.room1dark.timeouts[1] = setTimeout(GAME.map.maps.room1dark.functions.thunderMid, GAME.random(5000, 10000));
		},
		thunderNear: function()
		{
			var thunder = GAME.random(1, 3);
			GAME.sound.play("thunder-near-" + thunder, false);
			GAME.map.maps.room1dark.timeouts[4] = setTimeout(
				function()
				{
					GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red.gif")');
					GAME.map.maps.room1dark.overlays[0].$.css("background-image", 'url("./images/maps/room1.gif")');
					GAME.map.maps.room1dark.overlays[2].$.css("background-image", 'url("./images/maps/room1-overlay.gif")');
					GAME.map.maps.room1dark.timeouts[5] = setTimeout(
						function()
						{
							GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red-dark.gif")');
							GAME.map.maps.room1dark.overlays[0].$.css("background-image", 'url("./images/maps/room1-dark.gif")');
							GAME.map.maps.room1dark.overlays[2].$.css("background-image", 'url("./images/maps/room1-dark-overlay.gif")');
						},
						200
					);
				},
				[1500, 0, 1000][thunder - 1]
			);
			GAME.map.maps.room1dark.timeouts[3] = setTimeout(GAME.map.maps.room1dark.functions.thunderNear, GAME.random(5000, 10000));
		}
	},
	imgs: ["characters/pokemon/red-dark.gif", "maps/room1.gif", "maps/room1-overlay.gif"],
	interaction: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, function(){GAME.message("The power is out...");}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, function(){GAME.map.maps.room1dark.functions.sleep();}, 0, 0, 0, function(){GAME.message("It's an original NES.", "But the power is out...");}, 0, 0, 0, 0, 0, 0],
		[0, 0, function(){GAME.map.maps.room1dark.functions.sleep();}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	loaded: function()
	{
		GAME.characters[0].$.css("background-image", 'url("./images/characters/pokemon/red-dark.gif")');
		GAME.sound.play("rain-indoors-2");
		setTimeout(
			function()
			{
				GAME.sound.play("rain-indoors-2");
			},
			200
		);
		GAME.map.maps.room1dark.functions.thunder();
	},
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
	overlays: [
		{
			image: "maps/room1-dark.gif"
		},
		true,
		{
			image: "maps/room1-dark-overlay.gif"
		}
	],
	timeouts: []
};
GAME.map.load("room1dark");