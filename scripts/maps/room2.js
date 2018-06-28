GAME.map.maps.room2 = {
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
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, function(){GAME.map.load("room1", 9, 2, true);}, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, function(){GAME.map.load("pallet", 6, 8);}, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	functions: {
		walk: function()
		{
			GAME.characters[1].step(
				1, 1, 1, 1, 1, 1, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1,
				GAME.map.maps[GAME.map.current].functions.walk
			);
		}
	},
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
		GAME.map.maps.room2.overlays[3].$.css("z-index", 1002);
		GAME.sound.play("Macrocosmos");
		GAME.character(
			{
				character: "Grandma",
				facing: 2,
				interaction: function()
				{
					this.facePlayer();
					if (GAME.map.maps.room2.data.talked)
						this.message("Go back to bed.");
					else
					{
						GAME.map.maps.room2.data.talked = true;
						var messages = {
							dawn: ["Good morning, sweetie.", "Off on more adventures today?", "Stay safe!"],
							day: ["Hello, sweetie.", "Off on more adventures today?", "Stay safe!"],
							dusk: ["It's almost your bedtime.", "Don't you think you should get some rest?", "Early to bed, early to rise<br />makes a boy healthy, wealthy, and wise!"],
							night: ["What are you doing up at this time of night?", "Having trouble sleeping?", "You should go back to bed.<br />You have school in the morning!"]
						};
						messages = messages[GAME.timeOfDay()];
						this.message(
							messages[0],
							messages[1],
							messages[2]
						);
					}
				},
				loaded: function()
				{
					GAME.map.maps[GAME.map.current].functions.walk();
					GAME.characters[1].say(
						"Hello!", 2500,	"Welcome to the tech demo.", 2500, "I am your average NPC.", 2500, "I will walk in this rectangular shape forever.", 2500,
						"Hold S to run.", 2500, "Press D to interact with objects and people.", 3300, "Press Enter to open the useless menu.", 2500,
						"Press 0 to mute all sound.", 2500, "Press + or - to increase or decrease the volume.", 3300,
						"Have fun!", 1000
					);
				},
				position: [7, 2]
			}
		);
	},
	overlays: [
		{
			image: "room2.gif"
		},
		true,
		{
			image: "overlays/room2-1.gif"
		},
		{
			image: "overlays/room2-2.gif"
		}
	],
	sound: ["music/by/Raivu/Macrocosmos.mp3"]
};
GAME.map.load("room2");