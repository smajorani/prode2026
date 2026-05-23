// Planteles del Mundial 2026 — fuente: ESPN (mayo 2026)
// Clave = nombre exacto del equipo en el fixture

export interface TeamSquad {
  flagCode: string;
  players: string[];
}

export const SQUADS: Record<string, TeamSquad> = {
  // ── Grupo A ──────────────────────────────────────────────────────────────
  "México": {
    flagCode: "mx",
    players: [
      "Álex Padilla", "Antonio Rodríguez", "Carlos Acevedo", "Carlos Moreno", "Guillermo Ochoa", "Raúl Rangel",
      "Bryan González", "César Montes", "Edson Álvarez", "Eduardo Águila", "Everardo López", "Israel Reyes",
      "Jesús Angulo", "Jesús Gallardo", "Jesús Gómez", "Johan Vásquez", "Jorge Sánchez", "Julián Araujo",
      "Luis Rey", "Mateo Chávez", "Ramón Juárez", "Richard Ledezma", "Víctor Guzmán",
      "Alexei Domínguez", "Alexis Gutiérrez", "Álvaro Fidalgo", "Brian Gutiérrez", "Carlos Rodríguez",
      "Denzell Garcia", "Diego Lainez", "Efrain Álvarez", "Elias Montiel", "Érick Sánchez", "Erik Lira",
      "Gilberto Mora", "Isaías Violante", "Jeremy Márquez", "Jordan Carrillo", "Jorge Ruvalcaba",
      "Kevin Castañeda", "Luis Chávez", "Luis Romo", "Marcel Ruiz", "Obed Vargas", "Orbelín Pineda",
      "Alexis Vega", "Armando González", "César Huerta", "Germán Berterame", "Guillermo Martínez",
      "Julián Quiñoones", "Raúl Jiménez", "Roberto Alvarado", "Santiago Gimenez",
    ],
  },
  "Sudáfrica": { flagCode: "za", players: [] },
  "Corea del Sur": {
    flagCode: "kr",
    players: [
      "Jo Hyun-Woo", "Kim Seung-Gyu", "Song Bum-Keun",
      "Kim Min-Jae", "Jo Yu-Min", "Lee Han-Beom", "Kim Tae-Hyun", "Park Jin-Seop", "Lee Ki-Hyeok",
      "Lee Tae-Seok", "Seol Young-Woo", "Jens Castrop", "Kim Moon-Hwan",
      "Yang Hyun-Jun", "Paik Seung-Ho", "Hwang In-Beom", "Kim Jin-Kyu", "Bae Jun-Ho", "Um Ji-Sung",
      "Hwang Hee-Chan", "Lee Dong-Gyeong", "Lee Jae-Sung", "Lee Kang-In",
      "Oh Hyun-Kyu", "Son Heung-Min", "Cho Kyu-Sung",
    ],
  },
  "Rep. Checa": {
    flagCode: "cz",
    players: [
      "Lukas Hornicek", "Matej Kovar", "Jindrich Stanek",
      "Vladimír Coufal", "David Douděra", "Tomáš Holeš", "Robin Hranáč", "Štěpán Chaloupek",
      "David Jurásek", "Ladislav Krejcí", "Jaroslav Zelený", "David Zima",
      "Pavel Bucha", "Lukás Cerv", "Vladimir Darida", "Tomáš Ladra", "Lukás Provod", "Michal Sadílek",
      "Hugo Sochůrek", "Alexandr Sojka", "Tomáš Souček", "Pavel Šulc", "Denis Višinský",
      "Adam Hložek", "Tomáš Chorý", "Mojmír Chytil", "Christophe Kabongo", "Jan Kuchta", "Patrik Schick",
    ],
  },

  // ── Grupo B ──────────────────────────────────────────────────────────────
  "Canadá": { flagCode: "ca", players: [] },
  "Bosnia Herz.": {
    flagCode: "ba",
    players: [
      "Nikola Vasilj", "Martin Zlomislic", "Osman Hadzikic",
      "Sead Kolasinac", "Amar Dedic", "Nihad Mujakic", "Nikola Katic", "Tarik Muharemovic",
      "Stjepan Radeljic", "Dennis Hadzikadunic", "Nidal Celik",
      "Amir Hadziahmetovic", "Ivan Sunjic", "Ivan Basic", "Dzenis Burnic", "Ermin Mahmic",
      "Benjamin Tahirovic", "Amar Memic", "Armin Gigovic", "Kerim Alajbegovic", "Esmir Bajraktarevic",
      "Ermedin Demirovic", "Jovo Lukic", "Samed Bazdar", "Haris Tabakovic", "Edin Dzeko",
    ],
  },
  "Catar": {
    flagCode: "qa",
    players: [
      "Shehab Elleithy", "Salah Zakaria", "Meshaal Barsham", "Mahmoud Abunada",
      "Boualem Khoukhi", "Pedro Miguel", "Sultan Al Brake", "Tarek Salman", "Al-Hashmi Al-Hussain",
      "Ayoub Al-Alawi", "Bassam Al-Rawi", "Rayyan Al-Ali", "Issa Laye", "Lucas Mendes",
      "Mohammed Waad", "Niall Mason",
      "Ahmed Fathi", "Jassim Gaber", "Assim Madibo", "Abdulaziz Hatem", "Karim Boudiaf",
      "Mohammed Mannai", "Homam Al-Amin",
      "Almoez Ali", "Akram Afif", "Tahsin Mohammed", "Edmílson Junior", "Ahmed Al-Ganehi",
      "Ahmed Alaa", "Sebastián Soria", "Hassan Al-Haydos", "Mubarak Shannan",
      "Mohammed Muntari", "Yusuf Abdurisag",
    ],
  },
  "Suiza": {
    flagCode: "ch",
    players: [
      "Gregor Kobel", "Yvon Mvogo", "Marvin Keller",
      "Manuel Akanji", "Nico Elvedi", "Ricardo Rodríguez", "Silvan Widmer", "Miro Muheim",
      "Aurèle Amenda", "Eray Cömert", "Luca Jaquez",
      "Granit Xhaka", "Johan Manzambi", "Remo Freuler", "Denis Zakaria", "Ardon Jashari",
      "Djibril Sow", "Christian Fassnacht", "Michel Aebischer", "Fabian Rieder", "Rubén Vargas",
      "Breel Embolo", "Noah Okafor", "Dan Ndoye", "Zeki Amdouni", "Cedric Itten",
    ],
  },

  // ── Grupo C ──────────────────────────────────────────────────────────────
  "Brasil": {
    flagCode: "br",
    players: [
      "Alisson", "Éderson", "Weverton",
      "Alex Sandro", "Bremer", "Danilo", "Douglas Santos", "Gabriel Magalhães", "Léo Pereira",
      "Marquinhos", "Roger Ibañez", "Wesley",
      "Bruno Guimarães", "Casemiro", "Danilo Santos", "Fabinho", "Lucas Paquetá",
      "Endrick", "Gabriel Martinelli", "Igor Thiago", "Luiz Henrique", "Matheus Cunha",
      "Neymar", "Raphinha", "Rayan", "Vinícius Júnior",
    ],
  },
  "Marruecos": { flagCode: "ma", players: [] },
  "Haití": {
    flagCode: "ht",
    players: [
      "Johny Placide", "Alexandre Pierre", "Josue Duverger",
      "Carlens Arcus", "Wilguens Paugain", "Duke Lacroix", "Martin Expérience", "Jean-Kévin Duverne",
      "Ricardo Adé", "Hannes Delcroix", "Keeto Thermoncy",
      "Carl Fred Sainté", "Leverton Pierre", "Danley Jean Jacques", "Jean-Ricner Bellegarde",
      "Woodensky Pierre", "Dominique Simon",
      "Don Deedson Louicius", "Josué Casimir", "Derrick Etienne", "Ruben Providence",
      "Duckens Nazon", "Frantzdy Pierrot", "Wilson Isidor", "Yassin Fortuné", "Lenny Joseph",
    ],
  },
  "Escocia": {
    flagCode: "gb-sct",
    players: [
      "Craig Gordon", "Angus Gunn", "Liam Kelly",
      "Grant Hanley", "Jack Hendry", "Aaron Hickey", "Dom Hyam", "Scott McKenna",
      "Nathan Patterson", "Anthony Ralston", "Andy Robertson", "John Souttar", "Kieran Tierney",
      "Ryan Christie", "Finlay Curtis", "Lewis Ferguson", "Ben Gannon-Doak", "Billy Gilmour",
      "John McGinn", "Kenny McLean", "Scott McTominay",
      "Ché Adams", "Lyndon Dykes", "George Hirst", "Lawrence Shankland", "Ross Stewart",
    ],
  },

  // ── Grupo D ──────────────────────────────────────────────────────────────
  "Estados Unidos": { flagCode: "us", players: [] },
  "Paraguay": {
    flagCode: "py",
    players: [
      "Roberto Fernández", "Orlando Gill", "Gastón Olveira", "Carlos Coronel", "Santiago Rojas", "Juan Espínola",
      "Gustavo Gómez", "Júnior Alonso", "Fabián Balbuena", "Omar Alderete", "Juan Caceres",
      "Blas Riveros", "Alan Benitez", "Agustin Sandez", "Mateo Gamarra", "Saul Salcedo",
      "Jose Canale", "Diego León", "Alexandro Maidana", "Alcides Benitez", "Ronaldo Dejesus", "Alan Nuñez",
      "Miguel Almirón", "Mathías Villasanti", "Kaku", "Andrés Cubas", "Ramón Sosa",
      "Diego Gómez", "Damián Bobadilla", "Braian Ojeda", "Matías Galarza", "Robert Piris Da Motta",
      "Alvaro Campuzano", "Diego Gonzalez", "Hugo Cuenca", "Mauricio Magalhaes", "Lucas Romero",
      "Enso González", "Ruben Lezcano",
      "Oscar Romero", "Ángel Romero", "Antonio Sanabria", "Julio Enciso", "Gabriel Avalos",
      "Carlos Gonzalez", "Alex Arce", "Adam Bareiro", "Lorenzo Melgarejo", "Isidro Pitta",
      "Ronaldo Martinez", "Gustavo Caballero", "Robert Morales", "Adrian Alcaraz", "Rodney Redes",
    ],
  },
  "Australia": { flagCode: "au", players: [] },
  "Turquía": {
    flagCode: "tr",
    players: [
      "Altay Bayindir", "Ersin Destanoglu", "Mert Günok", "Muhhamed Sengezer", "Ugurcan Çakir",
      "Abdülkerim Bardakci", "Ahmetcan Kaplan", "Caglar Söyüncü", "Eren Elmali", "Ferdi Kadioglu",
      "Merih Demiral", "Mert Müldür", "Mustafa Eskihellac", "Ozan Kabak", "Samet Akaydin",
      "Yusuf Akcicek", "Zeki Çelik",
      "Atakan Karazor", "Demir Ege Tiknaz", "Hakan Çalhanoglu", "Ismail Yüksek", "Kaan Ayhan",
      "Orkun Kökçü", "Salih Özcan", "Aral Simsir", "Arda Güler", "Baris Alper Yilmaz", "Can Uzun",
      "Deniz Gül", "Irfan Can Kahveci", "Kenan Yildiz", "Karem Akturkoglu", "Oguz Aydin",
      "Yunus Akgün", "Yusuf Sari",
    ],
  },

  // ── Grupo E ──────────────────────────────────────────────────────────────
  "Alemania": {
    flagCode: "de",
    players: [
      "Oliver Baumann", "Manuel Neuer", "Alexander Nübel",
      "Waldemar Anton", "Nathaniel Brown", "David Raum", "Antonio Rüdiger", "Nico Schlotterbeck",
      "Jonathan Tah", "Malick Thiaw",
      "Pascal Gross", "Joshua Kimmich", "Aleksandar Pavlovic", "Felix Nmecha", "Angelo Stiller",
      "Nadiem Amiri", "Leon Goretzka", "Jamie Leweling",
      "Maximilian Beier", "Kai Havertz", "Lennart Karl", "Jamal Musiala", "Leroy Sané",
      "Deniz Undav", "Florian Wirtz", "Nick Woltemade",
    ],
  },
  "Curazao": {
    flagCode: "cw",
    players: [
      "Eloy Room", "Tyrick Bodak", "Trevor Doornbusch",
      "Riechedly Bazoer", "Joshua Brenet", "Roshon van Eijma", "Sherel Floranus",
      "Deveron Fonville", "Juriën Gaari", "Armando Obispo", "Shurandy Sambo",
      "Juninho Bacuna", "Leandro Bacuna", "Livano Comenencia", "Kevin Felida",
      "Ar'jany Martha", "Tyrese Noslin", "Godfried Roemeratoe",
      "Jeremy Antonisse", "Tahith Chong", "Kenji Gorré", "Sontje Hansen",
      "Gervane Kastaneer", "Brandley Kuwas", "Jürgen Locadia", "Jearl Margaritha",
    ],
  },
  "Costa de Marfil": {
    flagCode: "ci",
    players: [
      "Yahia Fofana", "Mohamed Koné", "Alban Lafont",
      "Emmanuel Agbadou", "Clément Akpa", "Ousmane Diomande", "Guela Doué", "Ghislain Konan",
      "Odilon Kossounou", "Evan Ndicka", "Wilfried Singo",
      "Seko Fofana", "Parfait Guiagon", "Franck Kessié", "Christ Inao Oulaï",
      "Ibrahim Sangaré", "Jean Michaël Seri",
      "Simon Adingra", "Ange-Yoan Bonny", "Amad Diallo", "Oumar Diakité", "Yan Diomande",
      "Evann Guessand", "Nicolas Pépé", "Bazoumana Touré", "Elye Wahi",
    ],
  },
  "Ecuador": { flagCode: "ec", players: [] },

  // ── Grupo F ──────────────────────────────────────────────────────────────
  "Países Bajos": { flagCode: "nl", players: [] },
  "Japón": {
    flagCode: "jp",
    players: [
      "Zion Suzuki", "Keisuke Osako", "Tomoki Hayakawa",
      "Yūto Nagatomo", "Shogo Taniguchi", "Ko Itakura", "Tsuyoshi Watanabe", "Takehiro Tomiyasu",
      "Hiroki Ito", "Ayumu Seko", "Yukinari Sugawara",
      "Junnosuke Suzuki", "Wataru Endo", "Junya Ito", "Daichi Kamada", "Ritsu Doan",
      "Ao Tanaka", "Keito Nakamura", "Kaishu Sano", "Takefusa Kubo", "Yuito Suzuki",
      "Koki Ogawa", "Daizen Maeda", "Ayase Ueda", "Kento Shiogai", "Keisuke Goto",
    ],
  },
  "Suecia": {
    flagCode: "se",
    players: [
      "Viktor Johansson", "Kristoffer Nordfeldt", "Jacob Widell Zetterstrom",
      "Hjalmar Ekdal", "Gabriel Gudmundsson", "Isak Hien", "Emil Holm", "Gustaf Lagerbielke",
      "Victor Lindelöf", "Erik Smith", "Carl Starfelt", "Elliot Stroud", "Daniel Svensson",
      "Taha Ali", "Yasin Ayari", "Lucas Bergvall", "Jesper Karlström", "Ken Sema",
      "Mattias Svanberg", "Besfort Zeneli",
      "Alexander Bernhardsson", "Anthony Elanga", "Viktor Gyökeres", "Alexander Isak",
      "Gustaf Nilsson", "Benjamin Nygren",
    ],
  },
  "Túnez": {
    flagCode: "tn",
    players: [
      "Aymen Dahmen", "Sabri Ben Hessen", "Abdelmouhib Chamakh",
      "Montassar Talbi", "Dylan Bronn", "Omar Rekik", "Yan Valery", "Ali Abdi",
      "Moutaz Neffati", "Raed Chikhaoui", "Adam Arous", "Mohamed Amine Ben Hamida",
      "Ellyes Skhiri", "Hannibal Mejbri", "Anis Ben Slimane", "Hadj Mahmoud",
      "Rani Khedira", "Mortadha Ben Ouanes",
      "Elias Achouri", "Ismaël Gharbi", "Elias Saad", "Sebastian Tounekti", "Firas Chaouat",
      "Khalil Ayari", "Hazem Mastouri", "Rayan Elloumi",
    ],
  },

  // ── Grupo G ──────────────────────────────────────────────────────────────
  "Bélgica": {
    flagCode: "be",
    players: [
      "Thibaut Courtois", "Senne Lammens", "Mike Penders",
      "Timothy Castagne", "Zeno Debast", "Maxim De Cuyper", "Koni De Winter", "Brandon Mechele",
      "Thomas Meunier", "Nathan Ngoy", "Joaquin Seys", "Arthur Theate",
      "Kevin De Bruyne", "Amadou Onana", "Nicolas Raskin", "Youri Tielemans",
      "Hans Vanaken", "Axel Witsel",
      "Charles De Ketelaere", "Jérémy Doku", "Matias Fernandez-Pardo", "Romelu Lukaku",
      "Dodi Lukebakio", "Diego Moreira", "Alexis Saelemaekers", "Leandro Trossard",
    ],
  },
  "Egipto": {
    flagCode: "eg",
    players: [
      "Mohamed El Shenawy", "Mostafa Shobeir", "El Mahdi Soliman", "Mohamed Alaa",
      "Mohamed Hany", "Tarek Alaa", "Hamdy Fathy", "Rami Rabia", "Yasser Ibrahim",
      "Hossam Abdelmaguid", "Mohamed Abdelmonemn", "Ahmed Fatouh", "Karim Hafez",
      "Marwan Ateya", "Mohanad Lasheen", "Nabil Emad", "Mahmoud Saber", "Ahmed Zizo",
      "Emam Ashour", "Mostafa Ziko", "Mahmoud Trezeguet", "Ibrahim Adel", "Haissem Hassan",
      "Omar Marmoush", "Mohamed Salah", "Aqtay Abdallah", "Hamza Abdelkarim",
    ],
  },
  "Irán": {
    flagCode: "ir",
    players: [
      "Alireza Beiranvand", "Hossein Hosseini", "Payam Niazmand", "Mohammed Khalifeh",
      "Danial Eiri", "Ehsan Hajsafi", "Saleh Hardani", "Hossein Kanaani", "Shoka Khalilzadeh",
      "Milad Mohammadi", "Ali Nemati", "Omid Noorafkan", "Ramin Rezaeian",
      "Rouzbeh Cheshmi", "Saeid Ezatolahi", "Mehdi Ghaedi", "Saman Ghoddos",
      "Mohammad Ghorbani", "Alireza Jahanbakhsh", "Mohammad Mohebi",
      "Amir Mohammad Razzaghinia", "Mehdi Torabi", "Aria Yousefi",
      "Ali Alipour", "Dennis Dargahi", "Hadi Habibinejad", "Amirhossein Hosseinzadeh",
      "Amirhossein Mahmoudi", "Kasra Taheri", "Mehdi Taremi",
    ],
  },
  "Nueva Zelanda": {
    flagCode: "nz",
    players: [
      "Max Crocombe", "Alex Paulsen", "Michael Woud",
      "Tim Payne", "Francis De Vries", "Tyler Bindon", "Michael Boxall", "Liberato Cacace",
      "Nando Pijnaker", "Finn Surman", "Callan Elliot", "Tommy Smith",
      "Joe Bell", "Matt Garbett", "Marko Stamenic", "Sarpreet Singh", "Alex Rufer", "Ryan Thomas",
      "Chris Wood", "Eli Just", "Kosta Barbarouses", "Ben Waine", "Ben Old",
      "Callum McCowatt", "Jesse Randall", "Lachlan Bayliss",
    ],
  },

  // ── Grupo H ──────────────────────────────────────────────────────────────
  "España": { flagCode: "es", players: [] },
  "Cabo Verde": {
    flagCode: "cv",
    players: [
      "Vozinha", "Marcio Rosa", "CJ dos Santos",
      "Steven Moreira", "Wagner Pina", "Joao Paulo", "Sidny Lopes Cabral", "Logan Costa",
      "Pico", "Kelvin Pires", "Stopira", "Diney",
      "Jamiro Monteiro", "Telmo Arcanjo", "Yannick Semedo", "Laros Duarte",
      "Deroy Duarte", "Kevin Pina",
      "Ryan Mendes", "Willy Semedo", "Garry Rodrigues", "Jovane Cabral", "Nuno da Costa",
      "Dailon Livramento", "Gilson Benchimol", "Helio Varela",
    ],
  },
  "Arabia Saudí": { flagCode: "sa", players: [] },
  "Uruguay": { flagCode: "uy", players: [] },

  // ── Grupo I ──────────────────────────────────────────────────────────────
  "Francia": {
    flagCode: "fr",
    players: [
      "Mike Maignan", "Robin Risser", "Brice Samba",
      "Lucas Digne", "Malo Gusto", "Lucas Hernández", "Theo Hernández", "Ibrahima Konaté",
      "Jules Koundé", "Maxence Lacroix", "William Saliba", "Dayot Upamecano",
      "N'Golo Kanté", "Manu Koné", "Adrien Rabiot", "Aurélien Tchouaméni", "Warren Zaïre-Emery",
      "Maghnes Akliouche", "Bradley Barcola", "Rayan Cherki", "Desiré Doué",
      "Jean-Philippe Mateta", "Kylian Mbappé", "Michael Olise", "Marcus Thuram",
    ],
  },
  "Senegal": {
    flagCode: "sn",
    players: [
      "Édouard Mendy", "Mory Diaw", "Yehvann Diouf",
      "Krépin Diatta", "Antoine Mendy", "Kalidou Koulibaly", "El Hadji Malick Diouf",
      "Mamadou Sarr", "Moussa Niakhaté", "Moustapha Mbow", "Abdoulaye Seck",
      "Ismail Jakobs", "Ilay Camara",
      "Idrissa Gana Gueye", "Pape Gueye", "Lamine Camara", "Habib Diarra",
      "Pathé Ciss", "Pape Matar Sarr", "Bara Sapoko Ndiaye",
      "Sadio Mané", "Ismaïla Sarr", "Iliman Ndiaye", "Assane Diao", "Ibrahim Mbaye",
      "Nicolas Jackson", "Bamba Dieng", "Cherif Ndiaye",
    ],
  },
  "Irak": { flagCode: "iq", players: [] },
  "Noruega": {
    flagCode: "no",
    players: [
      "Ørjan Nyland", "Egil Selvik", "Sander Tangvik",
      "Julian Ryerson", "Kristoffer Ajer", "Leo Østigard", "David Møller Wolfe",
      "Marcus Pedersen", "Torbjørn Heggem", "Fredrik André Bjørkan", "Henrik Falchener", "Sondre Langås",
      "Martin Ødegaard", "Sander Berge", "Patrick Berg", "Kristian Thorstvedt",
      "Morten Thorsby", "Thelo Aasgaard", "Andreas Schjelderup", "Jens Petter Hauge",
      "Fredrik Aursnes", "Oscar Bobb", "Antonio Nusa",
      "Erling Haaland", "Alexander Sørloth", "Jørgen Strand Larsen",
    ],
  },

  // ── Grupo J ──────────────────────────────────────────────────────────────
  "Argentina": {
    flagCode: "ar",
    players: [
      "Emiliano Martínez", "Gerónimo Rulli", "Juan Musso", "Walter Benítez", "Facundo Cambeses", "Santiago Beltran",
      "Agustín Giay", "Gonzalo Montiel", "Nahuel Molina", "Nicolás Capaldo", "Kevin Mac Allister",
      "Lucas Martínez Quarta", "Marcos Senesi", "Lisandro Martínez", "Nicolás Otamendi",
      "Germán Pezzella", "Leonardo Balerdi", "Cristian Romero", "Lautaro Di Lollo",
      "Zaid Romero", "Facundo Medina", "Marcos Acuña", "Nicolás Tagliafico", "Gabriel Rojas",
      "Máximo Perrone", "Leandro Paredes", "Guido Rodríguez", "Anibal Moreno", "Milton Delgado",
      "Alan Varela", "Ezequiel Fernández", "Rodrigo De Paul", "Exequiel Palacios",
      "Enzo Fernández", "Alexis Mac Allister", "Giovani Lo Celso", "Nicolás Domínguez",
      "Emiliano Buendía", "Valentín Barco",
      "Lionel Messi", "Nicolas Paz", "Franco Mastantuono", "Thiago Almada", "Tomas Aranda",
      "Nicolás González", "Alejandro Garnacho", "Giuliano Simeone", "Matías Soulè",
      "Claudio Echeverri", "Gianluca Prestianni", "Santiago Castro", "Lautaro Martínez",
      "Jose Manuel Lopez", "Julián Álvarez", "Mateo Pellegrino",
    ],
  },
  "Argelia": { flagCode: "dz", players: [] },
  "Austria": {
    flagCode: "at",
    players: [
      "Alexander Schlager", "Florian Wiegele", "Patrick Pentz",
      "David Affengruber", "Kevin Danso", "Stefan Posch", "David Alaba", "Philipp Lienhart",
      "Philipp Mwene", "Alexander Prass", "Marco Friedl", "Michael Svoboda",
      "Xaver Schlager", "Nicolas Seiwald", "Marcel Sabitzer", "Florian Grillitsch",
      "Carney Chukwuemeka", "Romano Schmid", "Christoph Baumgartner", "Konrad Laimer",
      "Patrick Wimmer", "Paul Wanner", "Alessandro Schopf",
      "Marko Arnautovic", "Michael Gregoritsch", "Sasa Kalajdzic",
    ],
  },
  "Jordania": {
    flagCode: "jo",
    players: [
      "Yazid Abulaila", "Abdallah Al-Fakhouri", "Ahmad Al-Juiadi", "Nour Bani Attiah",
      "Mohammad Abualnadi", "Yousef Abu Al-Jazar", "Husam Abu Dahab", "Mohammed Abu Hashish",
      "Mohannad Abu Taha", "Yazan Al-Arab", "Saed Al-Rosna", "Ahmad Assaf", "Anas Badawi",
      "Abdallah Nasib", "Ehsan Haddad", "Saleem Obaid",
      "Mohammed Al-Dawoud", "Nizar Al-Rashdan", "Noor Al-Rawabdeh", "Rajaei Ayed",
      "Amer Jamous", "Yousef Qashi", "Ibrahim Sadeh",
      "Mohammed Abu Zraiq", "Mousa Al-Tamari", "Ali Azaizeh", "Odeh Al-Fakhouri",
      "Ali Olwan", "Ibrahim Sabra",
    ],
  },

  // ── Grupo K ──────────────────────────────────────────────────────────────
  "Portugal": {
    flagCode: "pt",
    players: [
      "Diogo Costa", "José Sá", "Rui Silva", "Ricardo Velho",
      "Rúben Dias", "João Cancelo", "Diogo Dalot", "Nuno Mendes", "Nélson Semedo",
      "Matheus Nunes", "Gonçalo Inacio", "Renato Veiga", "Tomás Araújo",
      "Bruno Fernandes", "Bernardo Silva", "Vitinha", "João Neves", "Rúben Neves", "Samú Costa",
      "Cristiano Ronaldo", "Rafael Leão", "João Félix", "Gonçalo Ramos", "Pedro Neto",
      "Francisco Conceição", "Gonçalo Guedes", "Francisco Trincão",
    ],
  },
  "RD Congo": {
    flagCode: "cd",
    players: [
      "Lionel Mpasi", "Timothy Fayulu", "Matthieu Epolo",
      "Chancel Mbemba", "Axel Tuanzebe", "Arthur Masuaku", "Gedeon Kalulu", "Joris Kayembe",
      "Aaron Wan-Bissaka", "Aaron Tshibola", "Steve Kapuadi", "Dylan Batubinsika",
      "Noah Sadiki", "Charles Pickel", "Edo Kayembe", "Samuel Moutoussamy", "Ngal'ayel Mukau",
      "Nathanaël Mbuku", "Meschak Elia", "Brian Cipenga", "Gaël Kakuta", "Théo Bongonda",
      "Simon Banza", "Yoane Wissa", "Fiston Mayele", "Cédric Bakambu",
    ],
  },
  "Uzbekistán": {
    flagCode: "uz",
    players: [
      "Vladimir Nazarov", "Utkir Yusupov", "Botirali Ergashev", "Abduvokhid Nematov",
      "Ibrohimkhalil Yuldoshev", "Avazbek Ulmasaliev", "Jakhongir Urozov", "Rustamjon Ashurmatov",
      "Mukhammadkodir Hamraliev", "Umarbek Eshmurodov", "Abdukodir Khusanov",
      "Abdulla Abdullaev", "Farrukh Sayfiev", "Khojiakbar Alijonov", "Sherzod Nasrullaev",
      "Muhammadrasul Abdumajidov", "Behruz Karimov", "Diyor Ortikboev",
      "Kuvondik Ruziev", "Sherzod Esanov", "Nodirbek Abdurazzokov", "Odiljon Khamrobekov",
      "Umarali Rakhmonaliev", "Alisher Odilov", "Sardorbek Rakhmonov", "Akmal Mozgovoy",
      "Otabek Shukurov", "Jamshid Iskanderov", "Jasurbek Jaloliddinov", "Azizjon Ganiev",
      "Abbosek Fayzullaev", "Jaloliddin Masharipov", "Dostonbek Khamdamov", "Oston Urunov",
      "Ruslanbek Jiyanov", "Azizbek Amonov", "Khusain Norchaev", "Sherzod Temirov",
      "Igor Sergeev", "Eldor Shomurodov",
    ],
  },
  "Colombia": {
    flagCode: "co",
    players: [
      "David Ospina", "Álvaro Montero", "Camilo Vargas", "Mosquera Marmolejo",
      "Aldair Quintana", "Kevin Mier",
      "Daniel Muñoz", "Jhon Lucumí", "Álvaro Angulo", "Santiago Arias", "Davinson Sánchez",
      "Johan Mojica", "Yerry Mina", "Cristian Borja", "Juan Cabal", "Carlos Cuesta",
      "Willer Ditta", "Junior Hernández", "Deiver Machado", "Yerson Mosquera",
      "Édier Ocampo", "Jhohan Romana", "Andrés Román",
      "Jorge Carrascal", "Sebastian Gomez", "Johan Rojas", "Juan Fernando Quintero",
      "Juan Portilla", "Jordan Barrera", "Jhon Solís", "Jefferson Lerma", "Richard Ríos",
      "Jhon Arias", "Wilmar Barrios", "Juan Cuadrado", "Yáser Asprilla", "James Rodríguez",
      "Luis Díaz", "Jhon Córdoba", "Luis Suárez", "Sebastián Villa", "Neyser Villarreal",
      "Kevin Viveros", "Stiven Mendoza", "Edwuin Cetré", "Jhon Durán", "Andrés Gómez",
      "Rafael Santos Borré", "Jaminton Campaz", "Johan Carbonero", "Cucho Hernández",
    ],
  },

  // ── Grupo L ──────────────────────────────────────────────────────────────
  "Inglaterra": {
    flagCode: "gb-eng",
    players: [
      "Jordan Pickford", "Dean Henderson", "James Trafford",
      "Reece James", "Ezri Konsa", "Jarell Quansah", "John Stones", "Marc Guéhi",
      "Dan Burn", "Nico O'Reilly", "Djed Spence", "Tino Livramento",
      "Declan Rice", "Elliot Anderson", "Kobbie Mainoo", "Jordan Henderson",
      "Morgan Rogers", "Jude Bellingham", "Eberechi Eze",
      "Harry Kane", "Ivan Toney", "Ollie Watkins", "Bukayo Saka",
      "Marcus Rashford", "Anthony Gordon", "Noni Madueke",
    ],
  },
  "Croacia": {
    flagCode: "hr",
    players: [
      "Dominik Livakovic", "Dominik Kotarski", "Ivor Pandur",
      "Josko Gvardiol", "Duje Caleta-Car", "Josip Sutalo", "Josip Stanisic",
      "Marin Pongracic", "Martin Erlic", "Luka Vuskovic",
      "Luka Modric", "Mateo Kovacic", "Mario Pasalic", "Nikola Vlasic", "Luka Sucic",
      "Martin Baturina", "Kristijan Jakic", "Petar Sucic", "Nikola Moro", "Toni Fruk",
      "Ivan Perisic", "Andrej Kramaric", "Ante Budimir", "Marco Pasalic",
      "Petar Musa", "Igor Matanovic",
    ],
  },
  "Ghana": { flagCode: "gh", players: [] },
  "Panamá": { flagCode: "pa", players: [] },
};

// All 48 teams in fixture order (A→L)
export const ALL_TEAMS = Object.entries(SQUADS).map(([team, { flagCode }]) => ({ team, flagCode }));
