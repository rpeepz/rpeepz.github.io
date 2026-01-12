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

// Card data for 10 One Piece arcs - 52 characters total
// Enhanced Card Database with rarity and availability
const CARD_DATABASE = [
    // Romance Dawn Arc (5 cards)
    { id: 1, name: "Monkey D. Luffy", arc: "Romance Dawn", power: 65, rarity: "A", weight: 800, available: true },
    { id: 2, name: "Roronoa Zoro", arc: "Romance Dawn", power: 62, rarity: "A", weight: 800, available: true },
    { id: 3, name: "Koby", arc: "Romance Dawn", power: 15, rarity: "C", weight: 3000, available: true },
    { id: 4, name: "Alvida", arc: "Romance Dawn", power: 25, rarity: "D", weight: 2500, available: true },
    { id: 5, name: "Shanks", arc: "Romance Dawn", power: 98, rarity: "SSS", weight: 10, available: true },

    // Orange Town Arc (4 cards)
    { id: 6, name: "Nami", arc: "Orange Town", power: 35, rarity: "B", weight: 2000, available: true },
    { id: 7, name: "Buggy", arc: "Orange Town", power: 45, rarity: "B", weight: 2000, available: true },
    { id: 8, name: "Mohji", arc: "Orange Town", power: 18, rarity: "D", weight: 2500, available: true },
    { id: 9, name: "Cabaji", arc: "Orange Town", power: 22, rarity: "D", weight: 2500, available: true },

    // Syrup Village Arc (6 cards)
    { id: 10, name: "Usopp", arc: "Syrup Village", power: 28, rarity: "B", weight: 2000, available: true },
    { id: 11, name: "Kuro", arc: "Syrup Village", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 12, name: "Kaya", arc: "Syrup Village", power: 5, rarity: "F", weight: 1440, available: true },
    { id: 13, name: "Jango", arc: "Syrup Village", power: 30, rarity: "C", weight: 3000, available: true },
    { id: 14, name: "Sham", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true },
    { id: 15, name: "Buchi", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true },

    // Baratie Arc (7 cards)
    { id: 16, name: "Sanji", arc: "Baratie", power: 60, rarity: "A", weight: 800, available: true },
    { id: 17, name: "Zeff", arc: "Baratie", power: 55, rarity: "A", weight: 800, available: true },
    { id: 18, name: "Don Krieg", arc: "Baratie", power: 52, rarity: "B", weight: 2000, available: true },
    { id: 19, name: "Gin", arc: "Baratie", power: 42, rarity: "B", weight: 2000, available: true },
    { id: 20, name: "Pearl", arc: "Baratie", power: 35, rarity: "C", weight: 3000, available: true },
    { id: 21, name: "Mihawk", arc: "Baratie", power: 90, rarity: "SS", weight: 50, available: true },
    { id: 22, name: "Patty", arc: "Baratie", power: 25, rarity: "D", weight: 2500, available: true },

    // Arlong Park Arc (6 cards)
    { id: 23, name: "Arlong", arc: "Arlong Park", power: 68, rarity: "S", weight: 200, available: true },
    { id: 24, name: "Nami (Arlong Park)", arc: "Arlong Park", power: 38, rarity: "B", weight: 2000, available: true },
    { id: 25, name: "Kuroobi", arc: "Arlong Park", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 26, name: "Chew", arc: "Arlong Park", power: 38, rarity: "C", weight: 3000, available: true },
    { id: 27, name: "Hatchan", arc: "Arlong Park", power: 36, rarity: "C", weight: 3000, available: true },
    { id: 28, name: "Nojiko", arc: "Arlong Park", power: 12, rarity: "F", weight: 1440, available: true },

    // Loguetown Arc (4 cards)
    { id: 29, name: "Smoker", arc: "Loguetown", power: 72, rarity: "S", weight: 200, available: true },
    { id: 30, name: "Tashigi", arc: "Loguetown", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 31, name: "Dragon", arc: "Loguetown", power: 95, rarity: "SSS", weight: 10, available: true },
    { id: 32, name: "Bartolomeo (Young)", arc: "Loguetown", power: 20, rarity: "D", weight: 2500, available: true },

    // Whiskey Peak Arc (4 cards)
    { id: 33, name: "Mr. 9", arc: "Whiskey Peak", power: 30, rarity: "C", weight: 3000, available: true },
    { id: 34, name: "Miss Monday", arc: "Whiskey Peak", power: 32, rarity: "C", weight: 3000, available: true },
    { id: 35, name: "Igaram", arc: "Whiskey Peak", power: 35, rarity: "C", weight: 3000, available: true },
    { id: 36, name: "Princess Vivi", arc: "Whiskey Peak", power: 28, rarity: "B", weight: 2000, available: true },

    // Little Garden Arc (5 cards)
    { id: 37, name: "Dorry", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true },
    { id: 38, name: "Broggy", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true },
    { id: 39, name: "Mr. 3", arc: "Little Garden", power: 44, rarity: "B", weight: 2000, available: true },
    { id: 40, name: "Miss Goldenweek", arc: "Little Garden", power: 26, rarity: "C", weight: 3000, available: true },
    { id: 41, name: "Mr. 5", arc: "Little Garden", power: 42, rarity: "B", weight: 2000, available: true },

    // Drum Island Arc (6 cards)
    { id: 42, name: "Tony Tony Chopper", arc: "Drum Island", power: 50, rarity: "A", weight: 800, available: true },
    { id: 43, name: "Wapol", arc: "Drum Island", power: 46, rarity: "B", weight: 2000, available: true },
    { id: 44, name: "Dr. Kureha", arc: "Drum Island", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 45, name: "Dalton", arc: "Drum Island", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 46, name: "Chess", arc: "Drum Island", power: 32, rarity: "C", weight: 3000, available: true },
    { id: 47, name: "Kuromarimo", arc: "Drum Island", power: 30, rarity: "C", weight: 3000, available: true },

    // Alabasta Arc (5 cards)
    { id: 48, name: "Crocodile", arc: "Alabasta", power: 85, rarity: "SS", weight: 50, available: true },
    { id: 49, name: "Nico Robin", arc: "Alabasta", power: 58, rarity: "A", weight: 800, available: true },
    { id: 50, name: "Mr. 1 (Daz Bones)", arc: "Alabasta", power: 65, rarity: "A", weight: 800, available: true },
    { id: 51, name: "Mr. 2 (Bon Clay)", arc: "Alabasta", power: 56, rarity: "A", weight: 800, available: true },
    { id: 52, name: "Miss Doublefinger", arc: "Alabasta", power: 50, rarity: "B", weight: 2000, available: true },

    // Jaya Arc (5 cards)
    { id: 53, name: "Bellamy", arc: "Jaya", power: 54, rarity: "B", weight: 2000, available: true },
    { id: 54, name: "Sarquiss", arc: "Jaya", power: 38, rarity: "C", weight: 3000, available: true },
    { id: 55, name: "Masira", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: true },
    { id: 56, name: "Shoujou", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: true },
    { id: 57, name: "Montblanc Cricket", arc: "Jaya", power: 42, rarity: "B", weight: 2000, available: true },

    // Skypiea Arc (14 cards)
    { id: 58, name: "Enel", arc: "Skypiea", power: 90, rarity: "SS", weight: 50, available: true },
    { id: 59, name: "Gan Fall", arc: "Skypiea", power: 62, rarity: "A", weight: 800, available: true },
    { id: 60, name: "Wyper", arc: "Skypiea", power: 66, rarity: "A", weight: 800, available: true },
    { id: 61, name: "Gedatsu", arc: "Skypiea", power: 52, rarity: "B", weight: 2000, available: true },
    { id: 62, name: "Shura", arc: "Skypiea", power: 50, rarity: "B", weight: 2000, available: true },
    { id: 63, name: "Ohm", arc: "Skypiea", power: 54, rarity: "B", weight: 2000, available: true },
    { id: 64, name: "Satori", arc: "Skypiea", power: 46, rarity: "B", weight: 2000, available: true },
    { id: 65, name: "Braham", arc: "Skypiea", power: 40, rarity: "C", weight: 3000, available: true },
    { id: 66, name: "Kamakiri", arc: "Skypiea", power: 38, rarity: "C", weight: 3000, available: true },
    { id: 67, name: "Laki", arc: "Skypiea", power: 36, rarity: "C", weight: 3000, available: true },
    { id: 68, name: "Conis", arc: "Skypiea", power: 10, rarity: "F", weight: 1440, available: true },
    { id: 69, name: "Aisa", arc: "Skypiea", power: 8, rarity: "F", weight: 1440, available: true },
    { id: 70, name: "Pagaya", arc: "Skypiea", power: 18, rarity: "D", weight: 2500, available: true },
    { id: 71, name: "Yama", arc: "Skypiea", power: 44, rarity: "B", weight: 2000, available: true },

    // Long Ring Long Land Arc (4 cards)
    { id: 163, name: "Monkey D. Luffy (Afro)", arc: "Long Ring Long Land", power: 85, rarity: "SS", weight: 44, available: true },
    { id: 72, name: "Foxy", arc: "Long Ring Long Land", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 73, name: "Porche", arc: "Long Ring Long Land", power: 28, rarity: "C", weight: 3000, available: true },
    { id: 74, name: "Hamburg", arc: "Long Ring Long Land", power: 32, rarity: "C", weight: 3000, available: true },

    // Water 7 Arc (13 cards)
    { id: 75, name: "Franky", arc: "Water 7", power: 70, rarity: "S", weight: 200, available: true },
    { id: 76, name: "Iceburg", arc: "Water 7", power: 52, rarity: "B", weight: 2000, available: true },
    { id: 77, name: "Paulie", arc: "Water 7", power: 46, rarity: "B", weight: 2000, available: true },
    { id: 78, name: "Rob Lucci", arc: "Water 7", power: 88, rarity: "SS", weight: 50, available: true },
    { id: 79, name: "Kaku", arc: "Water 7", power: 76, rarity: "S", weight: 200, available: true },
    { id: 80, name: "Kalifa", arc: "Water 7", power: 64, rarity: "A", weight: 800, available: true },
    { id: 81, name: "Blueno", arc: "Water 7", power: 68, rarity: "S", weight: 200, available: true },
    { id: 82, name: "Tilestone", arc: "Water 7", power: 38, rarity: "C", weight: 3000, available: true },
    { id: 83, name: "Peepley Lulu", arc: "Water 7", power: 36, rarity: "C", weight: 3000, available: true },
    { id: 84, name: "Zambai", arc: "Water 7", power: 34, rarity: "C", weight: 3000, available: true },
    { id: 85, name: "Mozu", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: true },
    { id: 86, name: "Kiwi", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: true },
    { id: 87, name: "Kokoro", arc: "Water 7", power: 14, rarity: "F", weight: 1440, available: true },

    // Enies Lobby Arc (16 cards)
    { id: 88, name: "Spandam", arc: "Enies Lobby", power: 22, rarity: "D", weight: 2500, available: true },
    { id: 89, name: "Jabra", arc: "Enies Lobby", power: 72, rarity: "S", weight: 200, available: true },
    { id: 90, name: "Kumadori", arc: "Enies Lobby", power: 70, rarity: "S", weight: 200, available: true },
    { id: 91, name: "Fukurou", arc: "Enies Lobby", power: 68, rarity: "S", weight: 200, available: true },
    { id: 92, name: "Nero", arc: "Enies Lobby", power: 42, rarity: "B", weight: 2000, available: true },
    { id: 93, name: "Wanze", arc: "Enies Lobby", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 94, name: "T-Bone", arc: "Enies Lobby", power: 50, rarity: "B", weight: 2000, available: true },
    { id: 96, name: "Kashii", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 97, name: "Oimo", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 98, name: "Chimney", arc: "Enies Lobby", power: 6, rarity: "F", weight: 1440, available: true },
    { id: 100, name: "Monkey D. Luffy (Gear 2)", arc: "Enies Lobby", power: 82, rarity: "SS", weight: 50, available: true },
    { id: 101, name: "Roronoa Zoro (Asura)", arc: "Enies Lobby", power: 80, rarity: "S", weight: 200, available: true },
    { id: 102, name: "Sanji (Diable Jambe)", arc: "Enies Lobby", power: 78, rarity: "S", weight: 200, available: true },
    { id: 103, name: "Nico Robin (Enies Lobby)", arc: "Enies Lobby", power: 66, rarity: "A", weight: 800, available: true },
    { id: 163, name: "Nico Robin (Ohara)", arc: "Enies Lobby", power: 35, rarity: "B", weight: 2000, available: true },
    { id: 104, name: "Sogeking", arc: "Enies Lobby", power: 44, rarity: "B", weight: 2000, available: true },

    // Thriller Bark Arc (14 cards)
    { id: 105, name: "Gecko Moria", arc: "Thriller Bark", power: 82, rarity: "SS", weight: 50, available: true },
    { id: 106, name: "Bartholomew Kuma", arc: "Thriller Bark", power: 92, rarity: "SSS", weight: 10, available: true },
    { id: 107, name: "Perona", arc: "Thriller Bark", power: 56, rarity: "A", weight: 800, available: true },
    { id: 108, name: "Absalom", arc: "Thriller Bark", power: 58, rarity: "A", weight: 800, available: true },
    { id: 109, name: "Ryuma", arc: "Thriller Bark", power: 74, rarity: "S", weight: 200, available: true },
    { id: 110, name: "Oars", arc: "Thriller Bark", power: 80, rarity: "S", weight: 200, available: true },
    { id: 111, name: "Brook", arc: "Thriller Bark", power: 64, rarity: "A", weight: 800, available: true },
    { id: 112, name: "Hogback", arc: "Thriller Bark", power: 36, rarity: "C", weight: 3000, available: true },
    { id: 113, name: "Cindry", arc: "Thriller Bark", power: 40, rarity: "C", weight: 3000, available: true },
    { id: 114, name: "Lola", arc: "Thriller Bark", power: 42, rarity: "B", weight: 2000, available: true },
    { id: 115, name: "Risky Brothers", arc: "Thriller Bark", power: 30, rarity: "C", weight: 3000, available: true },
    { id: 116, name: "Nightmare Luffy", arc: "Thriller Bark", power: 86, rarity: "SS", weight: 50, available: true },
    { id: 118, name: "Hildon", arc: "Thriller Bark", power: 28, rarity: "D", weight: 2500, available: true },
    { id: 119, name: "Kumacy", arc: "Thriller Bark", power: 22, rarity: "D", weight: 2500, available: true },

    // Sabaody Archipelago Arc (12 cards)
    { id: 120, name: "Silvers Rayleigh", arc: "Sabaody Archipelago", power: 96, rarity: "SSS", weight: 10, available: true },
    { id: 121, name: "Kizaru (Sabaody)", arc: "Sabaody Archipelago", power: 94, rarity: "SSS", weight: 10, available: true },
    { id: 122, name: "Sentomaru", arc: "Sabaody Archipelago", power: 70, rarity: "S", weight: 200, available: true },
    { id: 123, name: "Trafalgar Law", arc: "Sabaody Archipelago", power: 76, rarity: "S", weight: 200, available: true },
    { id: 164, name: "Bepo", arc: "Sabaody Archipelago", power: 54, rarity: "B", weight: 2000, available: true },
    { id: 124, name: "Eustass Kid", arc: "Sabaody Archipelago", power: 74, rarity: "S", weight: 200, available: true },
    { id: 125, name: "Jewelry Bonney", arc: "Sabaody Archipelago", power: 62, rarity: "A", weight: 800, available: true },
    { id: 126, name: "Basil Hawkins", arc: "Sabaody Archipelago", power: 66, rarity: "A", weight: 800, available: true },
    { id: 127, name: "X Drake", arc: "Sabaody Archipelago", power: 68, rarity: "S", weight: 200, available: true },
    { id: 128, name: "Killer", arc: "Sabaody Archipelago", power: 60, rarity: "A", weight: 800, available: true },
    { id: 129, name: "Capone Bege", arc: "Sabaody Archipelago", power: 58, rarity: "A", weight: 800, available: true },
    { id: 130, name: "Duval", arc: "Sabaody Archipelago", power: 44, rarity: "B", weight: 2000, available: true },

    // Amazon Lily Arc (6 cards)
    { id: 131, name: "Boa Hancock", arc: "Amazon Lily", power: 84, rarity: "SS", weight: 50, available: true },
    { id: 132, name: "Boa Sandersonia", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: true },
    { id: 133, name: "Boa Marigold", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: true },
    { id: 134, name: "Marguerite", arc: "Amazon Lily", power: 38, rarity: "C", weight: 3000, available: false },
    { id: 135, name: "Sweet Pea", arc: "Amazon Lily", power: 34, rarity: "C", weight: 3000, available: false },
    { id: 136, name: "Aphelandra", arc: "Amazon Lily", power: 36, rarity: "C", weight: 3000, available: false },

    // Impel Down Arc (11 cards)
    { id: 137, name: "Magellan", arc: "Impel Down", power: 88, rarity: "SS", weight: 50, available: true },
    { id: 138, name: "Hannyabal", arc: "Impel Down", power: 54, rarity: "B", weight: 2000, available: true },
    { id: 139, name: "Shiryu", arc: "Impel Down", power: 78, rarity: "S", weight: 200, available: true },
    { id: 140, name: "Emporio Ivankov", arc: "Impel Down", power: 72, rarity: "S", weight: 200, available: true },
    { id: 141, name: "Inazuma", arc: "Impel Down", power: 56, rarity: "A", weight: 800, available: true },
    { id: 142, name: "Saldeath", arc: "Impel Down", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 143, name: "Sadi", arc: "Impel Down", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 144, name: "Minozebra", arc: "Impel Down", power: 52, rarity: "B", weight: 2000, available: true },
    { id: 145, name: "Minotaurus", arc: "Impel Down", power: 50, rarity: "B", weight: 2000, available: true },
    { id: 146, name: "Domino", arc: "Impel Down", power: 42, rarity: "B", weight: 2000, available: true },
    { id: 147, name: "Buggy (Impel Down)", arc: "Impel Down", power: 46, rarity: "B", weight: 2000, available: true },

    // Marineford Arc (15 cards)
    { id: 148, name: "Whitebeard", arc: "Marineford", power: 100, rarity: "SSS", weight: 10, available: true },
    { id: 149, name: "Akainu", arc: "Marineford", power: 98, rarity: "SSS", weight: 10, available: true },
    { id: 150, name: "Aokiji", arc: "Marineford", power: 94, rarity: "SSS", weight: 10, available: true },
    { id: 151, name: "Marco", arc: "Marineford", power: 86, rarity: "SS", weight: 50, available: true },
    { id: 152, name: "Jozu", arc: "Marineford", power: 80, rarity: "S", weight: 200, available: true },
    { id: 153, name: "Vista", arc: "Marineford", power: 76, rarity: "S", weight: 200, available: true },
    { id: 154, name: "Doflamingo", arc: "Marineford", power: 82, rarity: "SS", weight: 50, available: true },
    { id: 155, name: "Portgas D. Ace", arc: "Marineford", power: 84, rarity: "SS", weight: 50, available: true },
    { id: 156, name: "Sengoku", arc: "Marineford", power: 92, rarity: "SS", weight: 50, available: true },
    { id: 157, name: "Kizaru (Marineford)", arc: "Marineford", power: 96, rarity: "SSS", weight: 10, available: true },
    { id: 158, name: "Dracule Mihawk", arc: "Marineford", power: 100, rarity: "SSS", weight: 10, available: true },
    { id: 169, name: "Jinbei", arc: "Marineford", power: 78, rarity: "S", weight: 200, available: true },
    { id: 160, name: "Garp", arc: "Marineford", power: 88, rarity: "SS", weight: 50, available: true },
    { id: 161, name: "Squard", arc: "Marineford", power: 62, rarity: "A", weight: 500, available: true },
    { id: 162, name: "Tsuru", arc: "Marineford", power: 64, rarity: "A", weight: 500, available: true },
    
];

// Get all unique arcs
const ARCS = [...new Set(CARD_DATABASE.map(card => card.arc))];

// Helper functions for the rarity system
const CardRaritySystem = {
    // Get available card pool based on arc availability and card availability
    getAvailablePool() {
        return CARD_DATABASE.filter(card => 
            card.available && ARC_AVAILABILITY[card.arc]
        );
    },

    // Weighted random selection based on rarity weights
    drawRandomCard(excludeIds = []) {
        const pool = this.getAvailablePool().filter(card => !excludeIds.includes(card.id));
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
    drawMultipleCards(count, excludeIds = []) {
        const drawn = [];
        const excluded = new Set(excludeIds);
        
        for (let i = 0; i < count; i++) {
            const card = this.drawRandomCard([...excluded]);
            if (!card) break;
            drawn.push(card);
            excluded.add(card.id);
        }
        
        return drawn;
    },

    // Generate starter deck (5 cards) - weighted random from available pool
    generateStarterDeck() {
        const startingCards = (typeof DEV_CONFIG !== 'undefined' && DEV_CONFIG.GAME.STARTING_CARDS) || 5;
        return this.drawMultipleCards(startingCards);
    },

    // Get cards by rarity tier
    getCardsByRarity(rarity) {
        return this.getAvailablePool().filter(card => card.rarity === rarity);
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
