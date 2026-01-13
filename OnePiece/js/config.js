// Character rarity system configuration
const RARITY_TIERS = {
    SSS: { weight: 10, label: 'SSS - Legendary', color: '#ff0066' },      // 0.1% chance - Hot Pink/Magenta
    SS: { weight: 50, label: 'SS - Mythic', color: '#9933ff' },           // 0.5% chance - Purple
    S: { weight: 200, label: 'S - Epic', color: '#ff6600' },              // 2% chance - Bright Orange
    A: { weight: 800, label: 'A - Rare', color: '#ffcc00' },              // 8% chance - Gold
    B: { weight: 2000, label: 'B - Uncommon', color: '#00ccff' },         // 20% chance - Cyan
    C: { weight: 3000, label: 'C - Common', color: '#00cc66' },           // 30% chance - Darker Green (was too bright)
    D: { weight: 2500, label: 'D - Basic', color: '#8b7355' },            // 25% chance - Brown (distinct from gray)
    F: { weight: 1440, label: 'F - Starter', color: '#b8b8b8' }           // 14.4% chance - Medium Gray (distinct from brown)
};

// Character types for draft war bonuses
const CHARACTER_TYPES = {
    SWORDSMAN: { name: 'Swordsman', bonus: 1.15, icon: '⚔️', color: '#352e45ff' },
    BRAWLER: { name: 'Brawler', bonus: 1.15, icon: '👊', color: '#ff6b35' },
    DEVIL_FRUIT: { name: 'Devil Fruit User', bonus: 1.2, icon: '😈', color: '#9933ff' },
    MARKSMAN: { name: 'Marksman', bonus: 1.15, icon: '🎯', color: '#00cc66' },
    TACTICIAN: { name: 'Tactician', bonus: 1.1, icon: '🧠', color: '#00ccff' },
    DOCTOR: { name: 'Doctor', bonus: 1.1, icon: '⚕️', color: '#ff69b4' },
    SHIPWRIGHT: { name: 'Shipwright', bonus: 1.1, icon: '🔧', color: '#ffa500' },
    COOK: { name: 'Cook', bonus: 1.1, icon: '👨‍🍳', color: '#ffcc00' },
    NAVIGATOR: { name: 'Navigator', bonus: 1.1, icon: '🧭', color: '#4169e1' },
    ARCHAEOLOGIST: { name: 'Archaeologist', bonus: 1.1, icon: '📚', color: '#8b4513' },
    MUSICIAN: { name: 'Musician', bonus: 1.1, icon: '🎵', color: '#dda0dd' },
    MARINE: { name: 'Marine', bonus: 1.15, icon: '⚓', color: '#1e90ff' },
    PIRATE: { name: 'Pirate', bonus: 1.1, icon: '🏴‍☠️', color: '#2f4f4f' },
    REVOLUTIONARY: { name: 'Revolutionary', bonus: 1.15, icon: '🔥', color: '#dc143c' },
    WARLORD: { name: 'Warlord', bonus: 1.2, icon: '👑', color: '#ffd700' },
    YONKO: { name: 'Yonko', bonus: 1.25, icon: '👹', color: '#ff0066' }
};

// Role-Type synergy bonuses (specific roles get extra bonus with certain types)
const ROLE_TYPE_SYNERGY = {
    captain: ['YONKO', 'WARLORD', 'PIRATE', 'MARINE'],
    viceCaptain: ['SWORDSMAN', 'BRAWLER', 'DEVIL_FRUIT'],
    tank: ['BRAWLER', 'DEVIL_FRUIT', 'MARINE'],
    healer: ['DOCTOR', 'DEVIL_FRUIT'],
    support: ['NAVIGATOR', 'TACTICIAN', 'ARCHAEOLOGIST', 'COOK', 'MUSICIAN', 'SHIPWRIGHT'],
    support1: ['NAVIGATOR', 'TACTICIAN', 'COOK'],
    support2: ['COOK', 'MUSICIAN', 'SHIPWRIGHT', 'MARKSMAN'],
    traitor: [] // No synergy for traitor
};

const SYNERGY_BONUS = 1.1; // Additional 10% when type matches role perfectly

// Pool system configuration
const POOL_MAX_SIZE = 25; // Maximum number of cards a player can have in their preferred pool

const CHARACTER_IMAGES = {
    "Monkey D. Luffy": "img/luffy.png",
    "Roronoa Zoro": "img/zoro.jpg",
    "Koby": "img/koby.jpg",
    "Alvida": "img/alvida.jpg",
    "Shanks": "img/shanks.jpg",
    "Nami": "img/nami.jpg",
    "Buggy": "img/buggy.jpg",
    "Mohji": "img/mohji.jpg",
    "Cabaji": "img/cabaji.jpg",
    "Usopp": "img/usopp.jpg",
    "Kuro": "img/kuro.jpg",
    "Kaya": "img/kaya.jpg",
    "Jango": "img/jango.jpg",
    "Sham": "img/sham.jpg",
    "Buchi": "img/buchi.jpg",
    "Sanji": "img/sanji.jpg",
    "Zeff": "img/zeff.png",
    "Don Krieg": "img/donk.jpg",
    "Gin": "img/gin.jpg",
    "Pearl": "img/pearl.jpg",
    "Mihawk": "img/mihawk.jpg",
    "Patty": "img/patty.png",
    "Arlong": "img/arlong.jpg",
    "Nami (Arlong Park)": "img/nami(arlong).jpg",
    "Kuroobi": "img/kuroobi.jpg",
    "Chew": "img/chu.jpg",
    "Hatchan": "img/hatchi.jpg",
    "Nojiko": "img/nojiko.webp",
    "Smoker": "img/smoker.webp",
    "Tashigi": "img/tashigi.jpg",
    "Dragon": "img/dragon.webp",
    "Bartolomeo (Young)": "img/bart.webp",
    "Mr. 9": "img/mr9.jpg",
    "Miss Monday": "img/mismon.jpg",
    "Igaram": "img/igaram.jpg",
    "Princess Vivi": "img/vivi.jpg",
    "Dorry": "img/dorry.jpg",
    "Broggy": "img/broggy.jpg",
    "Mr. 3": "img/mr3.jpg",
    "Miss Goldenweek": "img/golden.jpg",
    "Mr. 5": "img/mr5.jpg",
    "Tony Tony Chopper": "img/chopper.jpg",
    "Wapol": "img/wapol.jpg",
    "Dr. Kureha": "img/kureha.webp",
    "Dalton": "img/dalton.jpg",
    "Chess": "img/chess.png",
    "Kuromarimo": "img/kuromarimo.jpg",
    "Crocodile": "img/crocodile.jpg",
    "Nico Robin": "img/robin.jpg",
    "Mr. 1 (Daz Bones)": "img/mr1.jpg",
    "Mr. 2 (Bon Clay)": "img/mr2.jpg",
    "Miss Doublefinger": "img/zala.png",
    "Bellamy": "img/bellamy.jpg",
    "Sarquiss": "img/sarquiss.webp",
    "Masira": "img/masira.jpg",
    "Shoujou": "img/shoujou.jpg",
    "Montblanc Cricket": "img/cricket.webp",
    "Enel": "img/enel.webp",
    "Gan Fall": "img/gan.png",
    "Wyper": "img/wiper.jpg",
    "Gedatsu": "img/gedatsu.png",
    "Shura": "img/shura.webp",
    "Ohm": "img/ohm.png",
    "Satori": "img/satori.jpg",
    "Braham": "img/braham.png",
    "Kamakiri": "img/kamakiri.webp",
    "Laki": "img/laki.png",
    "Conis": "img/conis.jpg",
    "Aisa": "img/aisa.webp",
    "Pagaya": "img/pagaya.webp",
    "Yama": "img/yama.webp",
    "Monkey D. Luffy (Afro)": "img/luffy(afro).jpg",
    "Foxy": "img/foxy.webp",
    "Porche": "img/porche.png",
    "Hamburg": "img/hamburg.jpg",
    "Franky": "img/franky.jpg",
    "Iceburg": "img/iceburg.jpg",
    "Paulie": "img/paulie.jpg",
    "Rob Lucci": "img/lucci.jpg",
    "Kaku": "img/kaku.jpg",
    "Kalifa": "img/kalifa.jpg",
    "Blueno": "img/blueno.png",
    "Tilestone": "img/tilestone.png",
    "Peepley Lulu": "img/lulu.jpg",
    "Zambai": "img/zambai.webp",
    "Mozu": "img/mozu.webp",
    "Kiwi": "img/kiwi.webp",
    "Kokoro": "img/kokoro.webp",
    "Spandam": "img/spandam.jpg",
    "Jabra": "img/jabra.png",
    "Kumadori": "img/kumadori.jpg",
    "Fukurou": "img/fukuro.jpg",
    "Nero": "img/nero.jpg",
    "Wanze": "img/wanze.webp",
    "T-Bone": "img/tbone.webp",
    "Kashii": "img/kashii.webp",
    "Oimo": "img/oimo.jpg",
    "Chimney": "img/chimney.jpg",
    "Monkey D. Luffy (Gear 2)": "img/luffy(gear2).jpg",
    "Roronoa Zoro (Asura)": "img/zoro(enies lobby).jpg",
    "Sanji (Diable Jambe)": "img/sajni(enies lobby).jpg",
    "Nico Robin (Enies Lobby)": "img/robin(enies lobby).jpg",
    "Nico Robin (Ohara)": "img/robin(ohara).jpg",
    "Sogeking": "img/sogeking.jpg",
    "Gecko Moria": "img/gekko.jpg",
    "Bartholomew Kuma": "img/kuma.jpg",
    "Perona": "img/perona.jpg",
    "Absalom": "img/absalom.jpg",
    "Ryuma": "img/ryuma.jpg",
    "Oars": "img/oars.jpg",
    "Brook": "img/brook.jpg",
    "Hogback": "img/hogback.jpg",
    "Cindry": "img/cindry.jpg",
    "Lola": "img/lola.jpg",
    "Risky Brothers": "img/risky.jpg",
    "Nightmare Luffy": "img/nightmareluffy.jpg",
    "Hildon": "img/hildon.png",
    "Kumacy": "img/kumacy.jpg",
    "Silvers Rayleigh": "img/rey.webp",
    "Kizaru (Sabaody)": "img/kizaru.jpg",
    "Sentomaru": "img/sentomaru.jpg",
    "Trafalgar Law": "img/law.jpg",
    "Bepo": "img/bepo.jpg",
    "Eustass Kid": "img/kid.jpg",
    "Jewelry Bonney": "img/jewelry.jpg",
    "Basil Hawkins": "img/hawkins.jpg",
    "X Drake": "img/xdrake.jpg",
    "Killer": "img/killer.jpg",
    "Capone Bege": "img/bege.jpg",
    "Duval": "img/duval.webp",
    "Boa Hancock": "img/hancock.jpg",
    "Boa Sandersonia": "img/sanderson.jpg",
    "Boa Marigold": "img/marigold.webp",
    "Marguerite": "",
    "Sweet Pea": "",
    "Aphelandra": "",
    "Magellan": "img/magellan.jpg",
    "Hannyabal": "img/hannyabal.jpg",
    "Shiryu": "img/shiryu.jpg",
    "Emporio Ivankov": "img/ivankov.jpg",
    "Inazuma": "img/inazuma.png",
    "Saldeath": "img/saldeath.webp",
    "Sadi": "img/sadi.jpg",
    "Minozebra": "img/mino2.webp",
    "Minotaurus": "img/mino.jpg",
    "Domino": "img/domino.jpg",
    "Buggy (Impel Down)": "img/buggy(impel down).jpg",
    "Whitebeard": "img/whitebeard.webp",
    "Akainu": "img/akainu.jpg",
    "Aokiji": "img/aokiji.webp",
    "Marco": "img/marco.jpg",
    "Jozu": "img/jozu.png",
    "Vista": "img/vista.webp",
    "Doflamingo": "img/doflamingo.jpg",
    "Portgas D. Ace": "img/ace.jpg",
    "Sengoku": "img/sengoku.jpg",
    "Kizaru (Marineford)": "img/kizaru(marineford).jpg",
    "Dracule Mihawk": "img/dmihawk.webp",
    "Jinbei" : "img/jinbei.jpg",
    "Garp": "img/garp.jpg", 
    "Squard": "img/squard.jpg",
    "Tsuru": "img/tsuru.jpg",
};

// Card data for 20 One Piece arcs - 163 cards
// Enhanced Card Database with rarity, type, and flavor text
const CARD_DATABASE = [
    // Romance Dawn Arc (5 cards)
    { id: 1, name: "Monkey D. Luffy", arc: "Romance Dawn", power: 65, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "The boy who dreams of becoming King of the Pirates. Ate the Gum-Gum Fruit and gained a rubber body." },
    { id: 2, name: "Roronoa Zoro", arc: "Romance Dawn", power: 62, rarity: "A", weight: 800, available: true, type: "SWORDSMAN", flavorText: "The pirate hunter who wields three swords and dreams of becoming the world's greatest swordsman." },
    { id: 3, name: "Koby", arc: "Romance Dawn", power: 15, rarity: "C", weight: 3000, available: true, type: "MARINE", flavorText: "A timid boy who dreams of becoming a Marine. Inspired by Luffy's courage to chase his dreams." },
    { id: 4, name: "Alvida", arc: "Romance Dawn", power: 25, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "The self-proclaimed most beautiful woman in East Blue. Captain of the Alvida Pirates." },
    { id: 5, name: "Shanks", arc: "Romance Dawn", power: 98, rarity: "SSS", weight: 10, available: true, type: "YONKO", flavorText: "Red-Haired Shanks, one of the Four Emperors. Luffy's greatest inspiration and the man who gave him his straw hat." },

    // Orange Town Arc (4 cards)
    { id: 6, name: "Nami", arc: "Orange Town", power: 35, rarity: "B", weight: 2000, available: true, type: "NAVIGATOR", flavorText: "A talented thief and cartographer who dreams of mapping the entire world." },
    { id: 7, name: "Buggy", arc: "Orange Town", power: 45, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "The Clown Pirate who ate the Chop-Chop Fruit. His body can split into pieces and reassemble." },
    { id: 8, name: "Mohji", arc: "Orange Town", power: 18, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "Beast tamer of the Buggy Pirates. Commands his lion Richie in battle." },
    { id: 9, name: "Cabaji", arc: "Orange Town", power: 22, rarity: "D", weight: 2500, available: true, type: "SWORDSMAN", flavorText: "Chief of staff of the Buggy Pirates. An acrobatic swordsman who fights on a unicycle." },

    // Syrup Village Arc (6 cards)
    { id: 10, name: "Usopp", arc: "Syrup Village", power: 28, rarity: "B", weight: 2000, available: true, type: "MARKSMAN", flavorText: "A skilled sniper with a tendency to lie. Dreams of becoming a brave warrior of the sea." },
    { id: 11, name: "Kuro", arc: "Syrup Village", power: 48, rarity: "B", weight: 2000, available: true, type: "SWORDSMAN", flavorText: "Captain Kuro of the Black Cat Pirates. A cunning strategist with deadly cat-claw blades." },
    { id: 12, name: "Kaya", arc: "Syrup Village", power: 5, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "A kind-hearted wealthy girl who was friends with Usopp. Her fortune was targeted by Kuro." },
    { id: 13, name: "Jango", arc: "Syrup Village", power: 30, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "The hypnotist of the Black Cat Pirates. Can put people to sleep with his pendant." },
    { id: 14, name: "Sham", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "One of the Meowban Brothers. Works alongside Buchi as Kuro's subordinate." },
    { id: 15, name: "Buchi", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "One of the Meowban Brothers. A cat-like pirate who fights with sharp claws." },

    // Baratie Arc (7 cards)
    { id: 16, name: "Sanji", arc: "Baratie", power: 60, rarity: "A", weight: 800, available: true, type: "COOK", flavorText: "The sous chef of Baratie. A skilled martial artist who fights only with his legs to protect his hands for cooking." },
    { id: 17, name: "Zeff", arc: "Baratie", power: 55, rarity: "A", weight: 800, available: true, type: "COOK", flavorText: "Red Leg Zeff, owner of Baratie. A legendary pirate turned chef who raised Sanji." },
    { id: 18, name: "Don Krieg", arc: "Baratie", power: 52, rarity: "B", weight: 2000, available: true, type: "PIRATE", flavorText: "The Admiral of the Krieg Pirates armada. Relies on heavy armor and an arsenal of weapons." },
    { id: 19, name: "Gin", arc: "Baratie", power: 42, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Combat commander of the Krieg Pirates. Known as 'Gin the Man-Demon' for his ruthless fighting style." },
    { id: 20, name: "Pearl", arc: "Baratie", power: 35, rarity: "C", weight: 3000, available: true, type: "BRAWLER", flavorText: "Iron Wall Pearl, second commander of the Krieg Pirates. Covered in armor with shields." },
    { id: 21, name: "Mihawk", arc: "Baratie", power: 90, rarity: "SS", weight: 50, available: true, type: "WARLORD", flavorText: "Dracule Mihawk, the world's greatest swordsman. Wields the black blade Yoru with unmatched skill." },
    { id: 22, name: "Patty", arc: "Baratie", power: 25, rarity: "D", weight: 2500, available: true, type: "COOK", flavorText: "A cook at Baratie. Known for his aggressive attitude toward customers who can't pay." },

    // Arlong Park Arc (6 cards)
    { id: 23, name: "Arlong", arc: "Arlong Park", power: 68, rarity: "S", weight: 200, available: true, type: "BRAWLER", flavorText: "Captain of the Arlong Pirates. A fish-man who believes in fish-man supremacy over humans." },
    { id: 24, name: "Nami (Arlong Park)", arc: "Arlong Park", power: 38, rarity: "B", weight: 2000, available: true, type: "NAVIGATOR", flavorText: "Forced to work for Arlong as a cartographer. Finally freed by Luffy's determination." },
    { id: 25, name: "Kuroobi", arc: "Arlong Park", power: 40, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Officer of the Arlong Pirates. A master of Fish-Man Karate who fights underwater." },
    { id: 26, name: "Chew", arc: "Arlong Park", power: 38, rarity: "C", weight: 3000, available: true, type: "BRAWLER", flavorText: "Officer of the Arlong Pirates. Can shoot water bullets from his mouth like cannon fire." },
    { id: 27, name: "Hatchan", arc: "Arlong Park", power: 36, rarity: "C", weight: 3000, available: true, type: "SWORDSMAN", flavorText: "A six-armed octopus fish-man who wields six swords. Despite his allegiance, he's good-natured." },
    { id: 28, name: "Nojiko", arc: "Arlong Park", power: 12, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "Nami's adopted sister. Stood by Nami through her years of suffering under Arlong's rule." },

    // Loguetown Arc (4 cards)
    { id: 29, name: "Smoker", arc: "Loguetown", power: 72, rarity: "S", weight: 200, available: true, type: "MARINE", flavorText: "The White Hunter, Captain of the Marines in Loguetown. Ate the Smoke-Smoke Fruit." },
    { id: 30, name: "Tashigi", arc: "Loguetown", power: 40, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "A Marine swordswoman who seeks to collect all the cursed blades. Bears a striking resemblance to Zoro's childhood friend." },
    { id: 31, name: "Dragon", arc: "Loguetown", power: 95, rarity: "SSS", weight: 10, available: true, type: "REVOLUTIONARY", flavorText: "Monkey D. Dragon, the world's most wanted criminal. Leader of the Revolutionary Army and Luffy's father." },
    { id: 32, name: "Bartolomeo (Young)", arc: "Loguetown", power: 20, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "A young spectator at Loguetown who witnessed Luffy's execution platform moment." },

    // Whiskey Peak Arc (4 cards)
    { id: 33, name: "Mr. 9", arc: "Whiskey Peak", power: 30, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Agent of Baroque Works. Works as a bounty hunter in Whiskey Peak alongside Miss Wednesday." },
    { id: 34, name: "Miss Monday", arc: "Whiskey Peak", power: 32, rarity: "C", weight: 3000, available: true, type: "BRAWLER", flavorText: "Agent of Baroque Works. A muscular woman with superhuman strength who partners with Mr. 9." },
    { id: 35, name: "Igaram", arc: "Whiskey Peak", power: 35, rarity: "C", weight: 3000, available: true, type: "TACTICIAN", flavorText: "Captain of the Alabasta Royal Guard disguised as Mr. 8. Loyal protector of Princess Vivi." },
    { id: 36, name: "Princess Vivi", arc: "Whiskey Peak", power: 28, rarity: "B", weight: 2000, available: true, type: "TACTICIAN", flavorText: "Princess of Alabasta who infiltrated Baroque Works as Miss Wednesday to save her kingdom." },

    // Little Garden Arc (5 cards)
    { id: 37, name: "Dorry", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true, type: "BRAWLER", flavorText: "A giant warrior of Elbaf. Has been dueling Brogy on Little Garden for 100 years." },
    { id: 38, name: "Broggy", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true, type: "BRAWLER", flavorText: "A giant warrior of Elbaf. Continues his century-long duel with Dorry to honor their homeland." },
    { id: 39, name: "Mr. 3", arc: "Little Garden", power: 44, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Baroque Works agent who ate the Wax-Wax Fruit. Can create and manipulate wax constructs." },
    { id: 40, name: "Miss Goldenweek", arc: "Little Garden", power: 26, rarity: "C", weight: 3000, available: true, type: "TACTICIAN", flavorText: "Mr. 3's partner. Uses Colors Trap to manipulate emotions and mental states through painting." },
    { id: 41, name: "Mr. 5", arc: "Little Garden", power: 42, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Baroque Works agent with the Bomb-Bomb Fruit. Can turn any part of his body into an explosive." },

    // Drum Island Arc (6 cards)
    { id: 42, name: "Tony Tony Chopper", arc: "Drum Island", power: 50, rarity: "A", weight: 800, available: true, type: "DOCTOR", flavorText: "A reindeer who ate the Human-Human Fruit. Dreams of curing all diseases as a doctor." },
    { id: 43, name: "Wapol", arc: "Drum Island", power: 46, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Former king of Drum Kingdom. Ate the Munch-Munch Fruit and can eat anything to transform." },
    { id: 44, name: "Dr. Kureha", arc: "Drum Island", power: 40, rarity: "B", weight: 2000, available: true, type: "DOCTOR", flavorText: "The 139-year-old 'Witch' doctor. Taught Chopper medicine and raised him after Hiriluk's death." },
    { id: 45, name: "Dalton", arc: "Drum Island", power: 48, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Former captain of Wapol's guard. Ate the Ox-Ox Fruit and can transform into a bison." },
    { id: 46, name: "Chess", arc: "Drum Island", power: 32, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Minister of Drum Kingdom and Wapol's advisor. Uses bow and arrow weapons in combat." },
    { id: 47, name: "Kuromarimo", arc: "Drum Island", power: 30, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Minister of Drum Kingdom. Has a large afro that contains hidden weapons." },

    // Alabasta Arc (5 cards)
    { id: 48, name: "Crocodile", arc: "Alabasta", power: 85, rarity: "SS", weight: 50, available: true, type: "WARLORD", flavorText: "Sir Crocodile, leader of Baroque Works and former Warlord. Ate the Sand-Sand Fruit." },
    { id: 49, name: "Nico Robin", arc: "Alabasta", power: 58, rarity: "A", weight: 800, available: true, type: "ARCHAEOLOGIST", flavorText: "The sole survivor of Ohara. Ate the Flower-Flower Fruit and can sprout body parts anywhere." },
    { id: 50, name: "Mr. 1 (Daz Bones)", arc: "Alabasta", power: 65, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Top agent of Baroque Works. Ate the Dice-Dice Fruit and can turn his body into blades." },
    { id: 51, name: "Mr. 2 (Bon Clay)", arc: "Alabasta", power: 56, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Okama agent of Baroque Works. Clone-Clone Fruit user who can copy anyone's appearance." },
    { id: 52, name: "Miss Doublefinger", arc: "Alabasta", power: 50, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Baroque Works agent with the Spike-Spike Fruit. Can grow spikes from any part of her body." },

    // Jaya Arc (5 cards)
    { id: 53, name: "Bellamy", arc: "Jaya", power: 54, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "The Hyena. Ate the Spring-Spring Fruit and can turn his legs into springs for powerful attacks." },
    { id: 54, name: "Sarquiss", arc: "Jaya", power: 38, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Big Knife Sarquiss, first mate of the Bellamy Pirates. Wields large bladed weapons." },
    { id: 55, name: "Masira", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: true, type: "BRAWLER", flavorText: "Salvage King Masira. A monkey-like pirate who specializes in underwater salvage operations." },
    { id: 56, name: "Shoujou", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: true, type: "BRAWLER", flavorText: "Shoujou the Salvage. Masira's orangutan-like brother who commands their salvage crew." },
    { id: 57, name: "Montblanc Cricket", arc: "Jaya", power: 42, rarity: "B", weight: 2000, available: true, type: "TACTICIAN", flavorText: "Descendant of Montblanc Noland. Searches for the City of Gold to prove his ancestor's story." },

    // Skypiea Arc (14 cards)
    { id: 58, name: "Enel", arc: "Skypiea", power: 90, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Self-proclaimed God of Skypiea. Ate the Rumble-Rumble Fruit and controls lightning itself." },
    { id: 59, name: "Gan Fall", arc: "Skypiea", power: 62, rarity: "A", weight: 800, available: true, type: "TACTICIAN", flavorText: "The former God of Skypiea. An honorable knight who rides his bird Pierre into battle." },
    { id: 60, name: "Wyper", arc: "Skypiea", power: 66, rarity: "A", weight: 800, available: true, type: "BRAWLER", flavorText: "Descendant of the great warrior Calgara. Leads the Shandian warriors to reclaim their homeland." },
    { id: 61, name: "Gedatsu", arc: "Skypiea", power: 52, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "One of Enel's priests. Frequently forgets to breathe and has absent-minded tendencies." },
    { id: 62, name: "Shura", arc: "Skypiea", power: 50, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Sky Rider Shura, one of Enel's priests. Rides a three-headed bird and wields a heat lance." },
    { id: 63, name: "Ohm", arc: "Skypiea", power: 54, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Sky Boss Ohm, strongest of Enel's priests. Uses Iron Cloud to create an unbreakable sword." },
    { id: 64, name: "Satori", arc: "Skypiea", power: 46, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Forest Boss Satori, priest of Enel. Uses Mantra and Surprise Clouds in the Ordeal of Balls." },
    { id: 65, name: "Braham", arc: "Skypiea", power: 40, rarity: "C", weight: 3000, available: true, type: "MARKSMAN", flavorText: "A Shandian warrior armed with a Flash Gun. Fights to reclaim his people's homeland." },
    { id: 66, name: "Kamakiri", arc: "Skypiea", power: 38, rarity: "C", weight: 3000, available: true, type: "MARKSMAN", flavorText: "A Shandian warrior who wields a burn blade. One of Wyper's most trusted fighters." },
    { id: 67, name: "Laki", arc: "Skypiea", power: 36, rarity: "C", weight: 3000, available: true, type: "MARKSMAN", flavorText: "A female Shandian warrior. Fights with a Burn Bazooka to help reclaim Upper Yard." },
    { id: 68, name: "Conis", arc: "Skypiea", power: 10, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "A kind resident of Skypiea who helped the Straw Hats despite the danger from Enel." },
    { id: 69, name: "Aisa", arc: "Skypiea", power: 8, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "A young Shandian girl born with Mantra. Can sense the presence and emotions of others." },
    { id: 70, name: "Pagaya", arc: "Skypiea", power: 18, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "Conis's father and an engineer in Skypiea. Builds Dial-powered devices and vehicles." },
    { id: 71, name: "Yama", arc: "Skypiea", power: 44, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Leader of Enel's Divine Soldiers. A massive warrior with incredible strength." },

    // Long Ring Long Land Arc (4 cards)
    { id: 163, name: "Monkey D. Luffy (Afro)", arc: "Long Ring Long Land", power: 85, rarity: "SS", weight: 44, available: true, type: "DEVIL_FRUIT", flavorText: "Luffy with an afro for the Davy Back Fight. The afro grants mysterious power according to him." },
    { id: 72, name: "Foxy", arc: "Long Ring Long Land", power: 48, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Silver Fox Foxy. Ate the Slow-Slow Fruit and can slow down anything he shoots with Noro beams." },
    { id: 73, name: "Porche", arc: "Long Ring Long Land", power: 28, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "A member of the Foxy Pirates. Uses her idol singer status as a distraction in combat." },
    { id: 74, name: "Hamburg", arc: "Long Ring Long Land", power: 32, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "A large gorilla-like member of the Foxy Pirates who fights with brute strength." },

    // Water 7 Arc (13 cards)
    { id: 75, name: "Franky", arc: "Water 7", power: 70, rarity: "S", weight: 200, available: true, type: "SHIPWRIGHT", flavorText: "A cyborg shipwright who rebuilt himself. Dreams of building a ship to sail around the world." },
    { id: 76, name: "Iceburg", arc: "Water 7", power: 52, rarity: "B", weight: 2000, available: true, type: "SHIPWRIGHT", flavorText: "Mayor of Water 7 and president of Galley-La Company. Tom's former apprentice." },
    { id: 77, name: "Paulie", arc: "Water 7", power: 46, rarity: "B", weight: 2000, available: true, type: "SHIPWRIGHT", flavorText: "Foreman of Galley-La Dock One. Uses ropes as weapons with incredible skill." },
    { id: 78, name: "Rob Lucci", arc: "Water 7", power: 88, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Strongest member of CP9. Ate the Cat-Cat Fruit Model: Leopard and is a master of Rokushiki." },
    { id: 79, name: "Kaku", arc: "Water 7", power: 76, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 assassin disguised as a shipwright. Ate the Ox-Ox Fruit Model: Giraffe." },
    { id: 80, name: "Kalifa", arc: "Water 7", power: 64, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 agent and Iceburg's secretary. Ate the Bubble-Bubble Fruit and creates cleaning bubbles." },
    { id: 81, name: "Blueno", arc: "Water 7", power: 68, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 agent with the Door-Door Fruit. Can create doors on any surface including air itself." },
    { id: 82, name: "Tilestone", arc: "Water 7", power: 38, rarity: "C", weight: 3000, available: true, type: "SHIPWRIGHT", flavorText: "Galley-La foreman known for his incredibly loud voice and protective goggles." },
    { id: 83, name: "Peepley Lulu", arc: "Water 7", power: 36, rarity: "C", weight: 3000, available: true, type: "SHIPWRIGHT", flavorText: "Galley-La foreman who fights using ropes and pulley systems in combat." },
    { id: 84, name: "Zambai", arc: "Water 7", power: 34, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Leader of the Franky Family. Loyal follower of Franky who helps protect Water 7." },
    { id: 85, name: "Mozu", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "One of the Square Sisters of the Franky Family. Fights with King Bulls." },
    { id: 86, name: "Kiwi", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "One of the Square Sisters of the Franky Family. Partners with Mozu in combat." },
    { id: 87, name: "Kokoro", arc: "Water 7", power: 14, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "Tom's former secretary. A mermaid who helped the Straw Hats reach Enies Lobby by sea train." },

    // Enies Lobby Arc (16 cards)
    { id: 88, name: "Spandam", arc: "Enies Lobby", power: 22, rarity: "D", weight: 2500, available: true, type: "MARINE", flavorText: "Cowardly chief of CP9. Wants to obtain ancient weapons to gain power within the World Government." },
    { id: 89, name: "Jabra", arc: "Enies Lobby", power: 72, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 agent who ate the Dog-Dog Fruit Model: Wolf. A master of Tekkai and Rokushiki." },
    { id: 90, name: "Kumadori", arc: "Enies Lobby", power: 70, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 agent who uses Life Return to control his hair. Speaks in kabuki style." },
    { id: 91, name: "Fukurou", arc: "Enies Lobby", power: 68, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "CP9 agent who measures Doriki power levels. Can't keep secrets despite claiming to." },
    { id: 92, name: "Nero", arc: "Enies Lobby", power: 42, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Weasel, a CP9 candidate who never mastered all six Rokushiki techniques." },
    { id: 93, name: "Wanze", arc: "Enies Lobby", power: 40, rarity: "B", weight: 2000, available: true, type: "COOK", flavorText: "A cook working on the sea train. Uses ramen as both weapons and armor in combat." },
    { id: 94, name: "T-Bone", arc: "Enies Lobby", power: 50, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "Ship Cutter T-Bone. A noble Marine who protects civilians despite his fearsome appearance." },
    { id: 96, name: "Kashii", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "One of the giant guards at Enies Lobby's main gate. Wields a massive spiked club." },
    { id: 97, name: "Oimo", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "Giant guard of Enies Lobby. Was tricked into serving the Government for 50 years." },
    { id: 98, name: "Chimney", arc: "Enies Lobby", power: 6, rarity: "F", weight: 1440, available: true, type: "PIRATE", flavorText: "Kokoro's energetic granddaughter. Helped the Straw Hats navigate Enies Lobby with Gonbe." },
    { id: 100, name: "Monkey D. Luffy (Gear 2)", arc: "Enies Lobby", power: 82, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Luffy using Gear Second. Pumps his blood to move at superhuman speeds." },
    { id: 101, name: "Roronoa Zoro (Asura)", arc: "Enies Lobby", power: 80, rarity: "S", weight: 200, available: true, type: "SWORDSMAN", flavorText: "Zoro manifesting his Asura form. Creates an illusion of nine swords and three heads." },
    { id: 102, name: "Sanji (Diable Jambe)", arc: "Enies Lobby", power: 78, rarity: "S", weight: 200, available: true, type: "COOK", flavorText: "Sanji using Diable Jambe. Heats his leg to burning temperatures for devastating fire kicks." },
    { id: 103, name: "Nico Robin (Enies Lobby)", arc: "Enies Lobby", power: 66, rarity: "A", weight: 800, available: true, type: "ARCHAEOLOGIST", flavorText: "Robin declaring she wants to live. Finally accepts the Straw Hats as her true family." },
    { id: 165, name: "Nico Robin (Ohara)", arc: "Enies Lobby", power: 35, rarity: "B", weight: 2000, available: true, type: "ARCHAEOLOGIST", flavorText: "Young Robin from Ohara. The last person alive who can read the ancient Poneglyphs." },
    { id: 104, name: "Sogeking", arc: "Enies Lobby", power: 44, rarity: "B", weight: 2000, available: true, type: "MARKSMAN", flavorText: "The mysterious sniper from Sniper Island. Definitely not Usopp in disguise." },

    // Thriller Bark Arc (14 cards)
    { id: 105, name: "Gecko Moria", arc: "Thriller Bark", power: 82, rarity: "SS", weight: 50, available: true, type: "WARLORD", flavorText: "Former Warlord with the Shadow-Shadow Fruit. Creates zombie armies by stealing shadows." },
    { id: 106, name: "Bartholomew Kuma", arc: "Thriller Bark", power: 92, rarity: "SSS", weight: 10, available: true, type: "WARLORD", flavorText: "The Tyrant, a cyborg Warlord. Ate the Paw-Paw Fruit and can repel anything with his palms." },
    { id: 107, name: "Perona", arc: "Thriller Bark", power: 56, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Ghost Princess with the Hollow-Hollow Fruit. Creates negative ghosts that drain willpower." },
    { id: 108, name: "Absalom", arc: "Thriller Bark", power: 58, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Zombie General with the Clear-Clear Fruit. Can turn himself and anything he touches invisible." },
    { id: 109, name: "Ryuma", arc: "Thriller Bark", power: 74, rarity: "S", weight: 200, available: true, type: "SWORDSMAN", flavorText: "Legendary samurai from Wano. His corpse was animated by Brook's stolen shadow." },
    { id: 110, name: "Oars", arc: "Thriller Bark", power: 80, rarity: "S", weight: 200, available: true, type: "BRAWLER", flavorText: "Ancient giant animated with Luffy's shadow. A legendary devil who once terrorized the world." },
    { id: 111, name: "Brook", arc: "Thriller Bark", power: 64, rarity: "A", weight: 800, available: true, type: "MUSICIAN", flavorText: "Soul King Brook. Ate the Revive-Revive Fruit and came back as a skeleton. Dreams of reuniting with Laboon." },
    { id: 112, name: "Hogback", arc: "Thriller Bark", power: 36, rarity: "C", weight: 3000, available: true, type: "DOCTOR", flavorText: "Genius surgeon turned mad scientist. Uses his medical skills to create zombies for Moria." },
    { id: 113, name: "Cindry", arc: "Thriller Bark", power: 40, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Hogback's zombie servant. Created from the corpse of a famous actress he once admired." },
    { id: 114, name: "Lola", arc: "Thriller Bark", power: 42, rarity: "B", weight: 2000, available: true, type: "PIRATE", flavorText: "Captain of the Rolling Pirates. Desperately seeks a husband and proposes to every man she meets." },
    { id: 115, name: "Risky Brothers", arc: "Thriller Bark", power: 30, rarity: "C", weight: 3000, available: true, type: "PIRATE", flavorText: "Zombie duo on Thriller Bark. Work together to ambush victims in the creepy mansion." },
    { id: 116, name: "Nightmare Luffy", arc: "Thriller Bark", power: 86, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Luffy powered by 100 shadows. Gains massive strength but can only maintain it briefly." },
    { id: 118, name: "Hildon", arc: "Thriller Bark", power: 28, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "A zombie bat tasked with bringing victims to Thriller Bark. One of Moria's servants." },
    { id: 119, name: "Kumacy", arc: "Thriller Bark", power: 22, rarity: "D", weight: 2500, available: true, type: "PIRATE", flavorText: "Perona's teddy bear zombie. Despite his cute appearance, he's surprisingly strong." },

    // Sabaody Archipelago Arc (12 cards)
    { id: 120, name: "Silvers Rayleigh", arc: "Sabaody Archipelago", power: 96, rarity: "SSS", weight: 10, available: true, type: "PIRATE", flavorText: "Dark King Rayleigh, former first mate of the Roger Pirates. A master of all three Haki types." },
    { id: 121, name: "Kizaru (Sabaody)", arc: "Sabaody Archipelago", power: 94, rarity: "SSS", weight: 10, available: true, type: "MARINE", flavorText: "Admiral Kizaru. Ate the Glint-Glint Fruit and moves at the speed of light itself." },
    { id: 122, name: "Sentomaru", arc: "Sabaody Archipelago", power: 70, rarity: "S", weight: 200, available: true, type: "MARINE", flavorText: "Bodyguard of Dr. Vegapunk. The world's tightest-lipped man who accidentally reveals secrets." },
    { id: 123, name: "Trafalgar Law", arc: "Sabaody Archipelago", power: 76, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "Surgeon of Death. Ate the Op-Op Fruit and can manipulate anything within his Room." },
    { id: 164, name: "Bepo", arc: "Sabaody Archipelago", power: 54, rarity: "B", weight: 2000, available: true, type: "PIRATE", flavorText: "Navigator of the Heart Pirates. A polar bear mink who apologizes frequently." },
    { id: 124, name: "Eustass Kid", arc: "Sabaody Archipelago", power: 74, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "Captain Kid. Ate a fruit that lets him manipulate magnetic forces and control metal." },
    { id: 125, name: "Jewelry Bonney", arc: "Sabaody Archipelago", power: 62, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Big Eater Bonney. Can manipulate ages of herself and others with her Devil Fruit power." },
    { id: 126, name: "Basil Hawkins", arc: "Sabaody Archipelago", power: 66, rarity: "A", weight: 800, available: true, type: "TACTICIAN", flavorText: "The Magician. Uses tarot cards to predict the future and voodoo dolls to redirect damage." },
    { id: 127, name: "X Drake", arc: "Sabaody Archipelago", power: 68, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "Red Flag Drake. Former Marine who ate an Ancient Zoan fruit to become an Allosaurus." },
    { id: 128, name: "Killer", arc: "Sabaody Archipelago", power: 60, rarity: "A", weight: 800, available: true, type: "SWORDSMAN", flavorText: "Massacre Soldier Killer. Kid's right-hand man who fights with rotating scythe blades." },
    { id: 129, name: "Capone Bege", arc: "Sabaody Archipelago", power: 58, rarity: "A", weight: 800, available: true, type: "TACTICIAN", flavorText: "Gang Bege. Ate the Castle-Castle Fruit and can store an army inside his body." },
    { id: 130, name: "Duval", arc: "Sabaody Archipelago", power: 44, rarity: "B", weight: 2000, available: true, type: "PIRATE", flavorText: "Leader of the Flying Fish Riders. His face resembled Sanji's wanted poster." },

    // Amazon Lily Arc (6 cards)
    { id: 131, name: "Boa Hancock", arc: "Amazon Lily", power: 84, rarity: "SS", weight: 50, available: true, type: "WARLORD", flavorText: "Pirate Empress and Snake Princess. Ate the Love-Love Fruit and can petrify those attracted to her." },
    { id: 132, name: "Boa Sandersonia", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Hancock's sister with the Snake-Snake Fruit Model: Anaconda. Can transform into a massive serpent." },
    { id: 133, name: "Boa Marigold", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: true, type: "DEVIL_FRUIT", flavorText: "Hancock's sister with the Snake-Snake Fruit Model: King Cobra. Commands fire in combat." },
    { id: 134, name: "Marguerite", arc: "Amazon Lily", power: 38, rarity: "C", weight: 3000, available: false, type: "MARKSMAN", flavorText: "A Kuja warrior who befriended Luffy. Uses Haki-imbued arrows in battle." },
    { id: 135, name: "Sweet Pea", arc: "Amazon Lily", power: 34, rarity: "C", weight: 3000, available: false, type: "PIRATE", flavorText: "Member of the Kuja Pirates. One of Marguerite's close friends in Amazon Lily." },
    { id: 136, name: "Aphelandra", arc: "Amazon Lily", power: 36, rarity: "C", weight: 3000, available: false, type: "BRAWLER", flavorText: "A giant Kuja warrior. Exceptionally tall even by Amazon standards." },

    // Impel Down Arc (11 cards)
    { id: 137, name: "Magellan", arc: "Impel Down", power: 88, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Chief Warden of Impel Down. Ate the Venom-Venom Fruit and produces deadly poison." },
    { id: 138, name: "Hannyabal", arc: "Impel Down", power: 54, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "Vice Warden who openly desires Magellan's position. More noble than he appears." },
    { id: 139, name: "Shiryu", arc: "Impel Down", power: 78, rarity: "S", weight: 200, available: true, type: "SWORDSMAN", flavorText: "Former Head Jailer. A bloodthirsty swordsman as strong as Magellan." },
    { id: 140, name: "Emporio Ivankov", arc: "Impel Down", power: 72, rarity: "S", weight: 200, available: true, type: "REVOLUTIONARY", flavorText: "Queen of Kamabakka Kingdom. Ate the Horm-Horm Fruit and can manipulate hormones." },
    { id: 141, name: "Inazuma", arc: "Impel Down", power: 56, rarity: "A", weight: 800, available: true, type: "REVOLUTIONARY", flavorText: "Revolutionary Army officer. Ate the Snip-Snip Fruit and can cut anything like paper." },
    { id: 142, name: "Saldeath", arc: "Impel Down", power: 40, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "Blugori commander in Impel Down. Commands the blue gorilla guards of Level 4." },
    { id: 143, name: "Sadi", arc: "Impel Down", power: 48, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "Chief Guard of Impel Down. A sadistic woman who commands the Jailer Beasts." },
    { id: 144, name: "Minozebra", arc: "Impel Down", power: 52, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "One of the Jailer Beasts. An awakened Zoan user with a zebra form." },
    { id: 145, name: "Minotaurus", arc: "Impel Down", power: 50, rarity: "B", weight: 2000, available: true, type: "BRAWLER", flavorText: "One of the Jailer Beasts. An awakened Zoan with a bull-like appearance." },
    { id: 146, name: "Domino", arc: "Impel Down", power: 42, rarity: "B", weight: 2000, available: true, type: "MARINE", flavorText: "Vice Warden Magellan's assistant. Handles administrative duties in Impel Down." },
    { id: 147, name: "Buggy (Impel Down)", arc: "Impel Down", power: 46, rarity: "B", weight: 2000, available: true, type: "DEVIL_FRUIT", flavorText: "Buggy leading a prison break. Gains a following who mistake him for a legendary pirate." },

    // Marineford Arc (15 cards)
    { id: 148, name: "Whitebeard", arc: "Marineford", power: 100, rarity: "SSS", weight: 10, available: true, type: "YONKO", flavorText: "The strongest man in the world. Ate the Tremor-Tremor Fruit and can create earthquakes." },
    { id: 149, name: "Akainu", arc: "Marineford", power: 98, rarity: "SSS", weight: 10, available: true, type: "MARINE", flavorText: "Admiral Akainu. Ate the Magma-Magma Fruit. Embodies absolute justice without mercy." },
    { id: 150, name: "Aokiji", arc: "Marineford", power: 94, rarity: "SSS", weight: 10, available: true, type: "MARINE", flavorText: "Admiral Aokiji. Ate the Ice-Ice Fruit and can freeze entire oceans solid." },
    { id: 151, name: "Marco", arc: "Marineford", power: 86, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "The Phoenix, Whitebeard's first division commander. Has regenerative blue flames." },
    { id: 152, name: "Jozu", arc: "Marineford", power: 80, rarity: "S", weight: 200, available: true, type: "DEVIL_FRUIT", flavorText: "Diamond Jozu, third division commander. Can turn his body into diamond." },
    { id: 153, name: "Vista", arc: "Marineford", power: 76, rarity: "S", weight: 200, available: true, type: "SWORDSMAN", flavorText: "Flower Sword Vista, fifth division commander. A master dual-wielding swordsman." },
    { id: 154, name: "Doflamingo", arc: "Marineford", power: 82, rarity: "SS", weight: 50, available: true, type: "WARLORD", flavorText: "Heavenly Demon Doflamingo. String-String Fruit user who manipulates people like puppets." },
    { id: 155, name: "Portgas D. Ace", arc: "Marineford", power: 84, rarity: "SS", weight: 50, available: true, type: "DEVIL_FRUIT", flavorText: "Fire Fist Ace. Ate the Flame-Flame Fruit. Luffy's sworn brother and Whitebeard's son." },
    { id: 156, name: "Sengoku", arc: "Marineford", power: 92, rarity: "SS", weight: 50, available: true, type: "MARINE", flavorText: "Fleet Admiral Sengoku the Buddha. Ate a mythical Zoan fruit to become a golden Buddha." },
    { id: 157, name: "Kizaru (Marineford)", arc: "Marineford", power: 96, rarity: "SSS", weight: 10, available: true, type: "MARINE", flavorText: "Admiral Kizaru demonstrating the terror of the Glint-Glint Fruit at full power." },
    { id: 158, name: "Dracule Mihawk", arc: "Marineford", power: 100, rarity: "SSS", weight: 10, available: true, type: "WARLORD", flavorText: "Hawkeye Mihawk testing the distance between himself and Whitebeard with his blade." },
    { id: 169, name: "Jinbei", arc: "Marineford", power: 78, rarity: "S", weight: 200, available: true, type: "WARLORD", flavorText: "Knight of the Sea. A whale shark fish-man and master of Fish-Man Karate." },
    { id: 160, name: "Garp", arc: "Marineford", power: 88, rarity: "SS", weight: 50, available: true, type: "MARINE", flavorText: "Garp the Fist, the Hero of the Marines. Cornered the Pirate King multiple times." },
    { id: 161, name: "Squard", arc: "Marineford", power: 62, rarity: "A", weight: 500, available: true, type: "PIRATE", flavorText: "Maelstrom Spider Squard. Allied captain deceived into stabbing Whitebeard." },
    { id: 162, name: "Tsuru", arc: "Marineford", power: 64, rarity: "A", weight: 500, available: true, type: "MARINE", flavorText: "Vice Admiral Tsuru. Ate the Wash-Wash Fruit and can cleanse evil from hearts." },
];

// Get all unique arcs
const ARCS = [...new Set(CARD_DATABASE.map(card => card.arc))];

// Arc images for shop display
const ARC_IMAGES = {
    'Romance Dawn': 'img/arcs/romance-dawn.webp',
    'Orange Town': 'img/arcs/orange-town.png',
    'Syrup Village': 'img/arcs/syrup-village.webp',
    'Baratie': 'img/arcs/baratie.jpg',
    'Arlong Park': 'img/arcs/arlong-park.webp',
    'Loguetown': 'img/arcs/loguetown.jpg',
    'Whiskey Peak': 'img/arcs/whiskey-peak.png',
    'Little Garden': 'img/arcs/little-garden.webp',
    'Drum Island': 'img/arcs/drum-island.webp',
    'Alabasta': 'img/arcs/alabasta.webp',
    'Jaya': 'img/arcs/jaya.webp',
    'Skypiea': 'img/arcs/skypiea.jpg',
    'Long Ring Long Land': 'img/arcs/long-ring-long-land.jpg',
    'Water 7': 'img/arcs/water-7.jpg',
    'Enies Lobby': 'img/arcs/enies-lobby.webp',
    'Thriller Bark': 'img/arcs/thriller-bark.png',
    'Sabaody Archipelago': 'img/arcs/sabaody-archipelago.jpg',
    'Amazon Lily': 'img/arcs/amazon-lily.jpg',
    'Impel Down': 'img/arcs/impel-down.jpg',
    'Marineford': 'img/arcs/marineford.jpg'
};

// Helper functions for the rarity system
const CardRaritySystem = {
    // Get available card pool based on arc availability, card availability, and user's unlocked arcs
    getAvailablePool(userUnlockedArcs = null) {
        return CARD_DATABASE.filter(card => {
            // Must be available and arc must be enabled in dev config
            if (!card.available || !ARC_AVAILABILITY[card.arc]) {
                return false;
            }
            // If user unlocked arcs provided, check if arc is unlocked
            if (userUnlockedArcs) {
                return userUnlockedArcs.has(card.arc);
            }
            // Otherwise, allow all enabled arcs (for bots, shop, etc)
            return true;
        });
    },

    // Weighted random selection based on rarity weights
    drawRandomCard(excludeIds = [], userUnlockedArcs = null) {
        const pool = this.getAvailablePool(userUnlockedArcs).filter(card => !excludeIds.includes(card.id));
        if (pool.length === 0) return null;

        // Calculate total weight
        const totalWeight = pool.reduce((sum, card) => sum + card.weight, 0);
        
        // Random weighted selection
        let random = Math.random() * totalWeight;
        
        for (const card of pool) {
            random -= card.weight;
            if (random <= 0) {
                return card;
            }
        }
        
        // Fallback to last card (shouldn't reach here)
        return pool[pool.length - 1];
    },

    // Draw multiple unique cards
    drawMultipleCards(count, excludeIds = [], userUnlockedArcs = null) {
        const drawn = [];
        const excluded = new Set(excludeIds);
        
        for (let i = 0; i < count; i++) {
            const card = this.drawRandomCard([...excluded], userUnlockedArcs);
            if (!card) break;
            drawn.push(card);
            excluded.add(card.id);
        }
        
        return drawn;
    },

    // Generate starter deck (5 cards) - weighted random from available pool
    generateStarterDeck(userUnlockedArcs = null) {
        const startingCards = (typeof DEV_CONFIG !== 'undefined' && DEV_CONFIG.GAME.STARTING_CARDS) || 5;
        return this.drawMultipleCards(startingCards, [], userUnlockedArcs);
    },

    // Get cards by rarity tier
    getCardsByRarity(rarity, userUnlockedArcs = null) {
        return this.getAvailablePool(userUnlockedArcs).filter(card => card.rarity === rarity);
    },

    // Get rarity info
    getRarityInfo(rarity) {
        return RARITY_TIERS[rarity] || RARITY_TIERS['F'];
    },

    // Calculate drop chance percentage
    getDropChance(rarity) {
        const totalWeight = Object.values(RARITY_TIERS).reduce((sum, tier) => sum + tier.weight, 0);
        return ((RARITY_TIERS[rarity]?.weight || 0) / totalWeight * 100).toFixed(2);
    }
};

// Bot difficulty configuration - each difficulty uses cards from specific rarity tiers
const BOT_DIFFICULTIES = {
    EASY: {
        name: 'Easy',
        description: 'Uses only F, D, and C tier cards',
        rarities: ['F', 'D', 'C'],
        icon: '😊'
    },
    NORMAL: {
        name: 'Normal',
        description: 'Uses C, D, and B tier cards',
        rarities: ['D', 'C', 'B'],
        icon: '🙂'
    },
    HARD: {
        name: 'Hard',
        description: 'Uses B, A, and S tier cards',
        rarities: ['B', 'A', 'S'],
        icon: '😠'
    },
    EXPERT: {
        name: 'Expert',
        description: 'Uses A, S, and SS tier cards',
        rarities: ['A', 'S', 'SS'],
        icon: '😈'
    },
    LEGENDARY: {
        name: 'Legendary',
        description: 'Uses S, SS, and SSS tier cards',
        rarities: ['S', 'SS', 'SSS'],
        icon: '💀'
    }
};

// Bot helper functions
const BotManager = {
    // Create a bot opponent
    createBot(difficulty) {
        return {
            id: 'bot_' + Date.now(),
            username: `${BOT_DIFFICULTIES[difficulty].icon} ${BOT_DIFFICULTIES[difficulty].name} Bot`,
            isBot: true,
            difficulty: difficulty,
            wins: 0,
            losses: 0,
            collection: new Set(CARD_DATABASE.map(c => c.id)) // Bot has all cards
        };
    },

    // Generate bot deck based on difficulty
    generateBotDeck(difficulty, count = 5) {
        const allowedRarities = BOT_DIFFICULTIES[difficulty].rarities;
        const pool = CardRaritySystem.getAvailablePool().filter(card => 
            allowedRarities.includes(card.rarity)
        );
        
        if (pool.length === 0) {
            console.warn('No cards available for bot difficulty:', difficulty);
            return [];
        }

        // Shuffle and pick cards
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // Bot plays a card (instant decision)
    playBotCard(botDeck) {
        if (botDeck.length === 0) return null;
        return botDeck.shift();
    }
};
