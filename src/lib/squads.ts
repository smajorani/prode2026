// Planteles del Mundial 2026 — fuente: ESPN (mayo 2026)
// Clave = nombre exacto del equipo en el fixture

export interface TeamSquad {
  flagCode: string;
  porteros: string[];
  defensas: string[];
  mediocampistas: string[];
  delanteros: string[];
}

export const SQUADS: Record<string, TeamSquad> = {
  // ── Grupo A ──────────────────────────────────────────────────────────────
  "México": {
    flagCode: "mx",
    porteros: ["Álex Padilla", "Antonio Rodríguez", "Carlos Acevedo", "Carlos Moreno", "Guillermo Ochoa", "Raúl Rangel"],
    defensas: ["Bryan González", "César Montes", "Edson Álvarez", "Eduardo Águila", "Everardo López", "Israel Reyes", "Jesús Angulo", "Jesús Gallardo", "Jesús Gómez", "Johan Vásquez", "Jorge Sánchez", "Julián Araujo", "Luis Rey", "Mateo Chávez", "Ramón Juárez", "Richard Ledezma", "Víctor Guzmán"],
    mediocampistas: ["Alexei Domínguez", "Alexis Gutiérrez", "Álvaro Fidalgo", "Brian Gutiérrez", "Carlos Rodríguez", "Denzell Garcia", "Diego Lainez", "Efrain Álvarez", "Elias Montiel", "Érick Sánchez", "Erik Lira", "Gilberto Mora", "Isaías Violante", "Jeremy Márquez", "Jordan Carrillo", "Jorge Ruvalcaba", "Kevin Castañeda", "Luis Chávez", "Luis Romo", "Marcel Ruiz", "Obed Vargas", "Orbelín Pineda"],
    delanteros: ["Alexis Vega", "Armando González", "César Huerta", "Germán Berterame", "Guillermo Martínez", "Julián Quiñoones", "Raúl Jiménez", "Roberto Alvarado", "Santiago Gimenez"],
  },
  "Sudáfrica": {
    flagCode: "za",
    porteros: ["Ricardo Goss", "Ronwen Williams", "Sipho Chaine"],
    defensas: ["Aubrey Modiba", "Bradley Cross", "Ime Okon", "Khuliso Mudau", "Mbekezeli Mbokazi", "Mothobi Mvala", "Nkosinathi Sibisi", "Olwethu Makhanya", "Siyabonga Ngezana", "Thapelo Monyane"],
    mediocampistas: ["Bathusi Aubaas", "Jayden Adams", "Lebogang Maboe", "Sphephelo Sithole", "Teboho Mokoena", "Thalente Mbatha", "Themba Zwane"],
    delanteros: ["Elias Mokwana", "Evidence Makgopa", "Iqraam Rayners", "Lyle Foster", "Oswin Appollis", "Percy Tau", "Relebohile Mofokeng", "Shandre Campbell"],
  },
  "Corea del Sur": {
    flagCode: "kr",
    porteros: ["Jo Hyun-Woo", "Kim Seung-Gyu", "Song Bum-Keun"],
    defensas: ["Jo Yu-Min", "Jens Castrop", "Kim Min-Jae", "Kim Moon-Hwan", "Kim Tae-Hyun", "Lee Han-Beom", "Lee Ki-Hyeok", "Lee Tae-Seok", "Park Jin-Seop", "Seol Young-Woo"],
    mediocampistas: ["Bae Jun-Ho", "Hwang Hee-Chan", "Hwang In-Beom", "Kim Jin-Kyu", "Lee Dong-Gyeong", "Lee Jae-Sung", "Lee Kang-In", "Paik Seung-Ho", "Um Ji-Sung", "Yang Hyun-Jun"],
    delanteros: ["Cho Kyu-Sung", "Oh Hyun-Kyu", "Son Heung-Min"],
  },
  "Rep. Checa": {
    flagCode: "cz",
    porteros: ["Jindrich Stanek", "Lukas Hornicek", "Matej Kovar"],
    defensas: ["David Douděra", "David Jurásek", "David Zima", "Jaroslav Zelený", "Ladislav Krejcí", "Robin Hranáč", "Štěpán Chaloupek", "Tomáš Holeš", "Vladimír Coufal"],
    mediocampistas: ["Alexandr Sojka", "Denis Višinský", "Hugo Sochůrek", "Lukás Cerv", "Lukás Provod", "Michal Sadílek", "Pavel Bucha", "Pavel Šulc", "Tomáš Ladra", "Tomáš Souček", "Vladimir Darida"],
    delanteros: ["Adam Hložek", "Christophe Kabongo", "Jan Kuchta", "Mojmír Chytil", "Patrik Schick", "Tomáš Chorý"],
  },

  // ── Grupo B ──────────────────────────────────────────────────────────────
  "Canadá": {
    flagCode: "ca",
    porteros: ["Dayne St. Clair", "Maxime Crépeau", "Owen Goodman"],
    defensas: ["Alistair Johnston", "Derek Cornelius", "Jahkeele Marshall-Rutty", "Joel Waterman", "Kamal Miller", "Luc de Fougerolles", "Moïse Bombito", "Niko Sigur", "Richie Laryea"],
    mediocampistas: ["Ali Ahmed", "Ismaël Koné", "Jonathan Osorio", "Junior Hoilett", "Liam Millar", "Marcelo Flores", "Mathieu Choinière", "Nathan Saliba", "Ralph Priso", "Tajon Buchanan"],
    delanteros: ["Aribim Pepple", "Cyle Larin", "Jonathan David", "Tani Oluwaseyi"],
  },
  "Bosnia Herz.": {
    flagCode: "ba",
    porteros: ["Martin Zlomislic", "Nikola Vasilj", "Osman Hadzikic"],
    defensas: ["Amar Dedic", "Dennis Hadzikadunic", "Nidal Celik", "Nihad Mujakic", "Nikola Katic", "Sead Kolasinac", "Stjepan Radeljic", "Tarik Muharemovic"],
    mediocampistas: ["Amar Memic", "Amir Hadziahmetovic", "Armin Gigovic", "Benjamin Tahirovic", "Dzenis Burnic", "Ermin Mahmic", "Esmir Bajraktarevic", "Ivan Basic", "Ivan Sunjic", "Kerim Alajbegovic"],
    delanteros: ["Edin Dzeko", "Ermedin Demirovic", "Haris Tabakovic", "Jovo Lukic", "Samed Bazdar"],
  },
  "Catar": {
    flagCode: "qa",
    porteros: ["Mahmoud Abunada", "Meshaal Barsham", "Salah Zakaria", "Shehab Elleithy"],
    defensas: ["Al-Hashmi Al-Hussain", "Ayoub Al-Alawi", "Bassam Al-Rawi", "Boualem Khoukhi", "Issa Laye", "Lucas Mendes", "Mohammed Waad", "Niall Mason", "Pedro Miguel", "Rayyan Al-Ali", "Sultan Al Brake", "Tarek Salman"],
    mediocampistas: ["Abdulaziz Hatem", "Ahmed Fathi", "Assim Madibo", "Homam Al-Amin", "Jassim Gaber", "Karim Boudiaf", "Mohammed Mannai"],
    delanteros: ["Ahmed Al-Ganehi", "Ahmed Alaa", "Akram Afif", "Almoez Ali", "Edmílson Junior", "Hassan Al-Haydos", "Mohammed Muntari", "Mubarak Shannan", "Sebastián Soria", "Tahsin Mohammed", "Yusuf Abdurisag"],
  },
  "Suiza": {
    flagCode: "ch",
    porteros: ["Gregor Kobel", "Marvin Keller", "Yvon Mvogo"],
    defensas: ["Aurèle Amenda", "Eray Cömert", "Luca Jaquez", "Manuel Akanji", "Miro Muheim", "Nico Elvedi", "Ricardo Rodríguez", "Silvan Widmer"],
    mediocampistas: ["Ardon Jashari", "Christian Fassnacht", "Denis Zakaria", "Djibril Sow", "Fabian Rieder", "Granit Xhaka", "Johan Manzambi", "Michel Aebischer", "Remo Freuler", "Rubén Vargas"],
    delanteros: ["Breel Embolo", "Cedric Itten", "Dan Ndoye", "Noah Okafor", "Zeki Amdouni"],
  },

  // ── Grupo C ──────────────────────────────────────────────────────────────
  "Brasil": {
    flagCode: "br",
    porteros: ["Alisson", "Éderson", "Weverton"],
    defensas: ["Alex Sandro", "Bremer", "Danilo", "Douglas Santos", "Gabriel Magalhães", "Léo Pereira", "Marquinhos", "Roger Ibañez", "Wesley"],
    mediocampistas: ["Bruno Guimarães", "Casemiro", "Danilo Santos", "Fabinho", "Lucas Paquetá"],
    delanteros: ["Endrick", "Gabriel Martinelli", "Igor Thiago", "Luiz Henrique", "Matheus Cunha", "Neymar", "Raphinha", "Rayan", "Vinícius Júnior"],
  },
  "Marruecos": {
    flagCode: "ma",
    porteros: ["Al Harrar El Mehdi", "Benchaouch Yanis", "El Kajoui Munir", "Gomis Ibrahim"],
    defensas: ["Ait Boudlal Abdelhamid", "Baoue Ismaël", "Belammari Youssef", "Bouftini Souhiane", "Chibi Mohamed", "El Karouani Souffian", "El Mourabet Samir", "Saadane Marouane", "Salahdine Anass"],
    mediocampistas: ["Amaymouni-Echghouyab Ayoub", "Bouaddi Ayyoub", "El-Faouzi Soufiane", "Gessime Yassine", "Louza Imran", "Saibari Ismael", "Targhalline Oussama"],
    delanteros: ["Begraoui Yanis", "Benjdida Soufiane", "Bentayeb Tawfik", "Boufal Soufiane", "Bounida Rayane", "El Kaabi Ayoub", "Maamma Othmane", "Zabir Yassir"],
  },
  "Haití": {
    flagCode: "ht",
    porteros: ["Alexandre Pierre", "Johny Placide", "Josue Duverger"],
    defensas: ["Carlens Arcus", "Duke Lacroix", "Hannes Delcroix", "Jean-Kévin Duverne", "Keeto Thermoncy", "Martin Expérience", "Ricardo Adé", "Wilguens Paugain"],
    mediocampistas: ["Carl Fred Sainté", "Danley Jean Jacques", "Dominique Simon", "Jean-Ricner Bellegarde", "Leverton Pierre", "Woodensky Pierre"],
    delanteros: ["Derrick Etienne", "Don Deedson Louicius", "Duckens Nazon", "Frantzdy Pierrot", "Josué Casimir", "Lenny Joseph", "Ruben Providence", "Wilson Isidor", "Yassin Fortuné"],
  },
  "Escocia": {
    flagCode: "gb-sct",
    porteros: ["Angus Gunn", "Craig Gordon", "Liam Kelly"],
    defensas: ["Aaron Hickey", "Andy Robertson", "Anthony Ralston", "Dom Hyam", "Grant Hanley", "Jack Hendry", "John Souttar", "Kieran Tierney", "Nathan Patterson", "Scott McKenna"],
    mediocampistas: ["Ben Gannon-Doak", "Billy Gilmour", "Finlay Curtis", "John McGinn", "Kenny McLean", "Lewis Ferguson", "Ryan Christie", "Scott McTominay"],
    delanteros: ["Ché Adams", "George Hirst", "Lawrence Shankland", "Lyndon Dykes", "Ross Stewart"],
  },

  // ── Grupo D ──────────────────────────────────────────────────────────────
  "Estados Unidos": {
    flagCode: "us",
    porteros: ["Chris Brady", "Matt Turner"],
    defensas: ["Antonee Robinson", "Chris Richards", "Joe Scally", "Mark McKenzie", "Miles Robinson", "Sergiño Dest", "Tim Ream"],
    mediocampistas: ["Gio Reyna", "Sebastian Berhalter", "Tyler Adams", "Weston McKennie", "Yunus Musah"],
    delanteros: ["Alejandro Zendejas", "Brenden Aaronson", "Christian Pulisic", "Folarin Balogun", "Haji Wright", "Ricardo Pepi", "Tim Weah"],
  },
  "Paraguay": {
    flagCode: "py",
    porteros: ["Carlos Coronel", "Gastón Olveira", "Juan Espínola", "Orlando Gill", "Roberto Fernández", "Santiago Rojas"],
    defensas: ["Agustin Sandez", "Alan Benitez", "Alan Nuñez", "Alcides Benitez", "Alexandro Maidana", "Blas Riveros", "Diego León", "Fabián Balbuena", "Gustavo Gómez", "Jose Canale", "Juan Caceres", "Júnior Alonso", "Mateo Gamarra", "Omar Alderete", "Ronaldo Dejesus", "Saul Salcedo"],
    mediocampistas: ["Alvaro Campuzano", "Andrés Cubas", "Braian Ojeda", "Damián Bobadilla", "Diego Gómez", "Diego Gonzalez", "Enso González", "Hugo Cuenca", "Kaku", "Lucas Romero", "Matías Galarza", "Mathías Villasanti", "Mauricio Magalhaes", "Miguel Almirón", "Ramón Sosa", "Robert Piris Da Motta", "Ruben Lezcano"],
    delanteros: ["Adam Bareiro", "Adrian Alcaraz", "Alex Arce", "Ángel Romero", "Antonio Sanabria", "Carlos Gonzalez", "Gabriel Avalos", "Gustavo Caballero", "Isidro Pitta", "Julio Enciso", "Lorenzo Melgarejo", "Oscar Romero", "Robert Morales", "Rodney Redes", "Ronaldo Martinez"],
  },
  "Australia": {
    flagCode: "au",
    porteros: ["Joe Gauci", "Patrick Beach", "Paul Izzo"],
    defensas: ["Ante Suto", "Aziz Behich", "Cameron Burgess", "Dylan Leonard", "Harry Souttar", "Jason Geria", "Jordan Bos", "Milos Degenek"],
    mediocampistas: ["Aiden O'Neill", "Ajdin Hrustic", "Alex Robertson", "Anthony Caceres", "Cameron Devlin", "Connor Metcalfe", "Gianni Stensness", "Jackson Irvine", "Jacob Italiano"],
    delanteros: ["Brandon Borrello", "Daniel Bennie", "Martin Boyle", "Mathew Leckie", "Mitch Duke", "Mohamed Toure", "Nestory Irankunda", "Nick D'Agostino", "Nishan Velupillay", "Raphael Borges Rodrigues"],
  },
  "Turquía": {
    flagCode: "tr",
    porteros: ["Altay Bayindir", "Ersin Destanoglu", "Mert Günok", "Muhhamed Sengezer", "Ugurcan Çakir"],
    defensas: ["Abdülkerim Bardakci", "Ahmetcan Kaplan", "Caglar Söyüncü", "Eren Elmali", "Ferdi Kadioglu", "Merih Demiral", "Mert Müldür", "Mustafa Eskihellac", "Ozan Kabak", "Samet Akaydin", "Yusuf Akcicek", "Zeki Çelik"],
    mediocampistas: ["Arda Güler", "Aral Simsir", "Atakan Karazor", "Baris Alper Yilmaz", "Can Uzun", "Demir Ege Tiknaz", "Hakan Çalhanoglu", "Ismail Yüksek", "Kaan Ayhan", "Orkun Kökçü", "Salih Özcan"],
    delanteros: ["Deniz Gül", "Irfan Can Kahveci", "Karem Akturkoglu", "Kenan Yildiz", "Oguz Aydin", "Yunus Akgün", "Yusuf Sari"],
  },

  // ── Grupo E ──────────────────────────────────────────────────────────────
  "Alemania": {
    flagCode: "de",
    porteros: ["Alexander Nübel", "Manuel Neuer", "Oliver Baumann"],
    defensas: ["Antonio Rüdiger", "David Raum", "Jonathan Tah", "Malick Thiaw", "Nathaniel Brown", "Nico Schlotterbeck", "Waldemar Anton"],
    mediocampistas: ["Aleksandar Pavlovic", "Angelo Stiller", "Felix Nmecha", "Jamie Leweling", "Joshua Kimmich", "Leon Goretzka", "Nadiem Amiri", "Pascal Gross"],
    delanteros: ["Deniz Undav", "Florian Wirtz", "Jamal Musiala", "Kai Havertz", "Lennart Karl", "Leroy Sané", "Maximilian Beier", "Nick Woltemade"],
  },
  "Curazao": {
    flagCode: "cw",
    porteros: ["Eloy Room", "Trevor Doornbusch", "Tyrick Bodak"],
    defensas: ["Armando Obispo", "Deveron Fonville", "Joshua Brenet", "Juriën Gaari", "Riechedly Bazoer", "Roshon van Eijma", "Sherel Floranus", "Shurandy Sambo"],
    mediocampistas: ["Ar'jany Martha", "Godfried Roemeratoe", "Juninho Bacuna", "Kevin Felida", "Leandro Bacuna", "Livano Comenencia", "Tyrese Noslin"],
    delanteros: ["Brandley Kuwas", "Gervane Kastaneer", "Jearl Margaritha", "Jeremy Antonisse", "Jürgen Locadia", "Kenji Gorré", "Sontje Hansen", "Tahith Chong"],
  },
  "Costa de Marfil": {
    flagCode: "ci",
    porteros: ["Alban Lafont", "Mohamed Koné", "Yahia Fofana"],
    defensas: ["Clément Akpa", "Emmanuel Agbadou", "Evan Ndicka", "Ghislain Konan", "Guela Doué", "Odilon Kossounou", "Ousmane Diomande", "Wilfried Singo"],
    mediocampistas: ["Christ Inao Oulaï", "Franck Kessié", "Ibrahim Sangaré", "Jean Michaël Seri", "Parfait Guiagon", "Seko Fofana"],
    delanteros: ["Amad Diallo", "Ange-Yoan Bonny", "Bazoumana Touré", "Elye Wahi", "Evann Guessand", "Nicolas Pépé", "Oumar Diakité", "Simon Adingra", "Yan Diomande"],
  },
  "Ecuador": {
    flagCode: "ec",
    porteros: ["Gonzalo Valle", "Hernán Galíndez", "Moisés Ramírez"],
    defensas: ["Ángelo Preciado", "Félix Torres", "Jhoanner Chávez", "José Hurtado", "Pervis Estupiñán", "Piero Hincapié", "Willian Pacho", "Yaimar Medina", "Jackson Porozo"],
    mediocampistas: ["Alan Franco", "Carlos Gruezo", "Jordy Alcívar", "Kendry Páez", "Moisés Caicedo", "Nilson Angulo", "Pedro Vite"],
    delanteros: ["Enner Valencia", "Gonzalo Plata", "Jeremy Arévalo", "Janner Corozo", "John Mercado", "John Yeboah", "Jordy Caicedo", "Kevin Rodríguez"],
  },

  // ── Grupo F ──────────────────────────────────────────────────────────────
  "Países Bajos": {
    flagCode: "nl",
    porteros: ["Bart Verbruggen", "Justin Bijlow", "Mark Flekken"],
    defensas: ["Denzel Dumfries", "Jan Paul van Hecke", "Jeremie Frimpong", "Jorrel Hato", "Lutsharel Geertruida", "Micky van de Ven", "Nathan Aké", "Stefan de Vrij", "Virgil van Dijk"],
    mediocampistas: ["Jerdy Schouten", "Kees Smit", "Luciano Valente", "Quinten Timber", "Ryan Gravenberch", "Teun Koopmeiners", "Tijjani Reijnders", "Xavi Simons"],
    delanteros: ["Brian Brobbey", "Cody Gakpo", "Donyell Malen", "Memphis Depay", "Noa Lang", "Wout Weghorst"],
  },
  "Japón": {
    flagCode: "jp",
    porteros: ["Keisuke Osako", "Tomoki Hayakawa", "Zion Suzuki"],
    defensas: ["Ayumu Seko", "Hiroki Ito", "Ko Itakura", "Shogo Taniguchi", "Takehiro Tomiyasu", "Tsuyoshi Watanabe", "Yukinari Sugawara", "Yūto Nagatomo"],
    mediocampistas: ["Ao Tanaka", "Daichi Kamada", "Junya Ito", "Junnosuke Suzuki", "Kaishu Sano", "Keito Nakamura", "Ritsu Doan", "Takefusa Kubo", "Wataru Endo", "Yuito Suzuki"],
    delanteros: ["Ayase Ueda", "Daizen Maeda", "Keisuke Goto", "Kento Shiogai", "Koki Ogawa"],
  },
  "Suecia": {
    flagCode: "se",
    porteros: ["Jacob Widell Zetterstrom", "Kristoffer Nordfeldt", "Viktor Johansson"],
    defensas: ["Carl Starfelt", "Daniel Svensson", "Elliot Stroud", "Emil Holm", "Erik Smith", "Gabriel Gudmundsson", "Gustaf Lagerbielke", "Hjalmar Ekdal", "Isak Hien", "Victor Lindelöf"],
    mediocampistas: ["Besfort Zeneli", "Jesper Karlström", "Ken Sema", "Lucas Bergvall", "Mattias Svanberg", "Taha Ali", "Yasin Ayari"],
    delanteros: ["Alexander Bernhardsson", "Alexander Isak", "Anthony Elanga", "Benjamin Nygren", "Gustaf Nilsson", "Viktor Gyökeres"],
  },
  "Túnez": {
    flagCode: "tn",
    porteros: ["Abdelmouhib Chamakh", "Aymen Dahmen", "Sabri Ben Hessen"],
    defensas: ["Adam Arous", "Ali Abdi", "Dylan Bronn", "Mohamed Amine Ben Hamida", "Montassar Talbi", "Moutaz Neffati", "Omar Rekik", "Raed Chikhaoui", "Yan Valery"],
    mediocampistas: ["Anis Ben Slimane", "Ellyes Skhiri", "Hadj Mahmoud", "Hannibal Mejbri", "Mortadha Ben Ouanes", "Rani Khedira"],
    delanteros: ["Elias Achouri", "Elias Saad", "Firas Chaouat", "Hazem Mastouri", "Ismaël Gharbi", "Khalil Ayari", "Rayan Elloumi", "Sebastian Tounekti"],
  },

  // ── Grupo G ──────────────────────────────────────────────────────────────
  "Bélgica": {
    flagCode: "be",
    porteros: ["Mike Penders", "Senne Lammens", "Thibaut Courtois"],
    defensas: ["Arthur Theate", "Brandon Mechele", "Joaquin Seys", "Koni De Winter", "Maxim De Cuyper", "Nathan Ngoy", "Thomas Meunier", "Timothy Castagne", "Zeno Debast"],
    mediocampistas: ["Amadou Onana", "Axel Witsel", "Hans Vanaken", "Kevin De Bruyne", "Nicolas Raskin", "Youri Tielemans"],
    delanteros: ["Alexis Saelemaekers", "Charles De Ketelaere", "Diego Moreira", "Dodi Lukebakio", "Jérémy Doku", "Leandro Trossard", "Matias Fernandez-Pardo", "Romelu Lukaku"],
  },
  "Egipto": {
    flagCode: "eg",
    porteros: ["El Mahdi Soliman", "Mohamed Alaa", "Mohamed El Shenawy", "Mostafa Shobeir"],
    defensas: ["Ahmed Fatouh", "Hamdy Fathy", "Hossam Abdelmaguid", "Karim Hafez", "Mohamed Abdelmonemn", "Mohamed Hany", "Rami Rabia", "Tarek Alaa", "Yasser Ibrahim"],
    mediocampistas: ["Ahmed Zizo", "Emam Ashour", "Haissem Hassan", "Ibrahim Adel", "Mahmoud Saber", "Mahmoud Trezeguet", "Marwan Ateya", "Mohanad Lasheen", "Mostafa Ziko", "Nabil Emad"],
    delanteros: ["Aqtay Abdallah", "Hamza Abdelkarim", "Mohamed Salah", "Omar Marmoush"],
  },
  "Irán": {
    flagCode: "ir",
    porteros: ["Alireza Beiranvand", "Hossein Hosseini", "Mohammed Khalifeh", "Payam Niazmand"],
    defensas: ["Ali Nemati", "Danial Eiri", "Ehsan Hajsafi", "Hossein Kanaani", "Milad Mohammadi", "Omid Noorafkan", "Ramin Rezaeian", "Saleh Hardani", "Shoka Khalilzadeh"],
    mediocampistas: ["Alireza Jahanbakhsh", "Amir Mohammad Razzaghinia", "Aria Yousefi", "Mehdi Ghaedi", "Mehdi Torabi", "Mohammad Ghorbani", "Mohammad Mohebi", "Rouzbeh Cheshmi", "Saeid Ezatolahi", "Saman Ghoddos"],
    delanteros: ["Ali Alipour", "Amirhossein Hosseinzadeh", "Amirhossein Mahmoudi", "Dennis Dargahi", "Hadi Habibinejad", "Kasra Taheri", "Mehdi Taremi"],
  },
  "Nueva Zelanda": {
    flagCode: "nz",
    porteros: ["Alex Paulsen", "Max Crocombe", "Michael Woud"],
    defensas: ["Callan Elliot", "Francis De Vries", "Finn Surman", "Liberato Cacace", "Michael Boxall", "Nando Pijnaker", "Tim Payne", "Tommy Smith", "Tyler Bindon"],
    mediocampistas: ["Alex Rufer", "Joe Bell", "Marco Stamenic", "Matt Garbett", "Ryan Thomas", "Sarpreet Singh"],
    delanteros: ["Ben Old", "Ben Waine", "Callum McCowatt", "Chris Wood", "Eli Just", "Jesse Randall", "Kosta Barbarouses", "Lachlan Bayliss"],
  },

  // ── Grupo H ──────────────────────────────────────────────────────────────
  "España": {
    flagCode: "es",
    porteros: ["Álex Remiro", "David Raya", "Joan García", "Unai Simón"],
    defensas: ["Álex Grimaldo", "Aymeric Laporte", "Cristhian Mosquera", "Dean Huijsen", "Marc Cucurella", "Marcos Llorente", "Pau Cubarsí", "Pedro Porro"],
    mediocampistas: ["Carlos Soler", "Dani Olmo", "Fermín López", "Pablo Fornals", "Pedri", "Rodri"],
    delanteros: ["Álex Baena", "Borja Iglesias", "Ferran Torres", "Lamine Yamal", "Mikel Oyarzabal", "Víctor Muñoz", "Yéremy Pino"],
  },
  "Cabo Verde": {
    flagCode: "cv",
    porteros: ["CJ dos Santos", "Marcio Rosa", "Vozinha"],
    defensas: ["Diney", "Joao Paulo", "Kelvin Pires", "Logan Costa", "Pico", "Sidny Lopes Cabral", "Stopira", "Steven Moreira", "Wagner Pina"],
    mediocampistas: ["Deroy Duarte", "Jamiro Monteiro", "Kevin Pina", "Laros Duarte", "Telmo Arcanjo", "Yannick Semedo"],
    delanteros: ["Dailon Livramento", "Garry Rodrigues", "Gilson Benchimol", "Helio Varela", "Jovane Cabral", "Nuno da Costa", "Ryan Mendes", "Willy Semedo"],
  },
  "Arabia Saudí": {
    flagCode: "sa",
    porteros: ["Ahmed Al-Kassar", "Mohammed Al-Owais", "Nawaf Al-Aqidi"],
    defensas: ["Abdulelah Al-Amri", "Ali Al-Bulaihi", "Ali Majrashi", "Hassan Tambakti", "Saud Abdulhamid", "Yasser Al-Shahrani"],
    mediocampistas: ["Abdullah Al-Khaibari", "Abdulrahman Ghareeb", "Ayman Yahya", "Faisal Al-Ghamdi", "Mohamed Kanno", "Marwan Al-Sahafi", "Musab Al-Juwayr", "Salem Al-Dawsari", "Turki Al-Ammar", "Ziyad Al-Johani"],
    delanteros: ["Abdullah Radif", "Firas Al-Buraikan", "Saleh Al-Shehri"],
  },
  "Uruguay": {
    flagCode: "uy",
    porteros: ["Fernando Muslera", "Santiago Mele", "Sergio Rochet"],
    defensas: ["Guillermo Varela", "José María Giménez", "Lucas Olaza", "Matías Viña", "Mathías Olivera", "Nahitan Nández", "Ronald Araújo", "Santiago Bueno", "Sebastián Cáceres"],
    mediocampistas: ["Facundo Pellistri", "Federico Valverde", "Giorgian de Arrascaeta", "Juan Manuel Sanabria", "Manuel Ugarte", "Nicolás de la Cruz", "Rodrigo Bentancur", "Rodrigo Zalazar"],
    delanteros: ["Agustín Álvarez Martínez", "Agustín Canobbio", "Brian Rodríguez", "Darwin Núñez", "Federico Viñas", "Maximiliano Araújo", "Rodrigo Aguirre"],
  },

  // ── Grupo I ──────────────────────────────────────────────────────────────
  "Francia": {
    flagCode: "fr",
    porteros: ["Brice Samba", "Mike Maignan", "Robin Risser"],
    defensas: ["Dayot Upamecano", "Ibrahima Konaté", "Jules Koundé", "Lucas Digne", "Lucas Hernández", "Malo Gusto", "Maxence Lacroix", "Theo Hernández", "William Saliba"],
    mediocampistas: ["Adrien Rabiot", "Aurélien Tchouaméni", "Manu Koné", "N'Golo Kanté", "Warren Zaïre-Emery"],
    delanteros: ["Bradley Barcola", "Desiré Doué", "Jean-Philippe Mateta", "Kylian Mbappé", "Maghnes Akliouche", "Marcus Thuram", "Michael Olise", "Rayan Cherki"],
  },
  "Senegal": {
    flagCode: "sn",
    porteros: ["Édouard Mendy", "Mory Diaw", "Yehvann Diouf"],
    defensas: ["Abdoulaye Seck", "Antoine Mendy", "El Hadji Malick Diouf", "Ilay Camara", "Ismail Jakobs", "Kalidou Koulibaly", "Krépin Diatta", "Mamadou Sarr", "Moussa Niakhaté", "Moustapha Mbow"],
    mediocampistas: ["Bara Sapoko Ndiaye", "Habib Diarra", "Idrissa Gana Gueye", "Lamine Camara", "Pape Gueye", "Pape Matar Sarr", "Pathé Ciss"],
    delanteros: ["Assane Diao", "Bamba Dieng", "Cherif Ndiaye", "Ibrahim Mbaye", "Iliman Ndiaye", "Ismaïla Sarr", "Nicolas Jackson", "Sadio Mané"],
  },
  "Irak": {
    flagCode: "iq",
    porteros: ["Ahmed Basil", "Fahad Talib", "Jalal Hassan", "Kumel Al-Rekabe"],
    defensas: ["Ali Adnan", "Frans Putros", "Hussein Ali", "Manaf Younis", "Merchas Doski", "Mustafa Nadhim", "Rebin Sulaka", "Zaid Tahseen"],
    mediocampistas: ["Amir Al-Ammari", "Ibrahim Bayesh", "Jussef Nasrawe", "Karar Nabeel", "Osama Rashid", "Safaa Hadi", "Zidane Iqbal"],
    delanteros: ["Ali Jasim", "Aymen Hussein", "Danilo Al-Saed", "Marko Farji", "Mohanad Ali", "Youssef Amyn"],
  },
  "Noruega": {
    flagCode: "no",
    porteros: ["Egil Selvik", "Sander Tangvik", "Ørjan Nyland"],
    defensas: ["Fredrik André Bjørkan", "Henrik Falchener", "Julian Ryerson", "Kristoffer Ajer", "Leo Østigard", "Marcus Pedersen", "David Møller Wolfe", "Sondre Langås", "Torbjørn Heggem"],
    mediocampistas: ["Andreas Schjelderup", "Antonio Nusa", "Fredrik Aursnes", "Jens Petter Hauge", "Kristian Thorstvedt", "Martin Ødegaard", "Morten Thorsby", "Oscar Bobb", "Patrick Berg", "Sander Berge", "Thelo Aasgaard"],
    delanteros: ["Alexander Sørloth", "Erling Haaland", "Jørgen Strand Larsen"],
  },

  // ── Grupo J ──────────────────────────────────────────────────────────────
  "Argentina": {
    flagCode: "ar",
    porteros: ["Emiliano Martínez", "Facundo Cambeses", "Gerónimo Rulli", "Juan Musso", "Santiago Beltran", "Walter Benítez"],
    defensas: ["Agustín Giay", "Anibal Moreno", "Cristian Romero", "Facundo Medina", "Gabriel Rojas", "Germán Pezzella", "Gonzalo Montiel", "Kevin Mac Allister", "Lautaro Di Lollo", "Leonardo Balerdi", "Lisandro Martínez", "Lucas Martínez Quarta", "Marcos Acuña", "Marcos Senesi", "Nahuel Molina", "Nicolás Capaldo", "Nicolás Otamendi", "Nicolás Tagliafico", "Zaid Romero"],
    mediocampistas: ["Alan Varela", "Alexis Mac Allister", "Emiliano Buendía", "Enzo Fernández", "Exequiel Palacios", "Ezequiel Fernández", "Giovani Lo Celso", "Guido Rodríguez", "Leandro Paredes", "Máximo Perrone", "Milton Delgado", "Nicolás Domínguez", "Rodrigo De Paul", "Valentín Barco"],
    delanteros: ["Alejandro Garnacho", "Claudio Echeverri", "Franco Mastantuono", "Gianluca Prestianni", "Giuliano Simeone", "Jose Manuel Lopez", "Julián Álvarez", "Lautaro Martínez", "Lionel Messi", "Mateo Pellegrino", "Matías Soulè", "Nicolas Paz", "Nicolás González", "Santiago Castro", "Thiago Almada", "Tomas Aranda"],
  },
  "Argelia": {
    flagCode: "dz",
    porteros: ["Anthony Mandréa", "Kilian Belazzoug", "Luca Zidane", "Melvin Mastil"],
    defensas: ["Aïssa Mandi", "Jaouen Hadjam", "Mohamed Amine Tougaï", "Rafik Belghali", "Ramy Bensebaini", "Samir Chergui", "Sohaib Naïr", "Zineddine Belaïd"],
    mediocampistas: ["Adil Aouchiche", "Farès Chaïbi", "Hicham Boudaoui", "Houssem Aouar", "Ismaël Bennacer", "Ramiz Zerrouki", "Yassine Titraoui"],
    delanteros: ["Amine Gouiri", "Baghdad Bounedjah", "Islam Slimani", "Mohamed Amoura", "Riyad Mahrez", "Saïd Benrahma", "Adil Boulbina"],
  },
  "Austria": {
    flagCode: "at",
    porteros: ["Alexander Schlager", "Florian Wiegele", "Patrick Pentz"],
    defensas: ["David Affengruber", "David Alaba", "Kevin Danso", "Marco Friedl", "Michael Svoboda", "Philipp Lienhart", "Philipp Mwene", "Alexander Prass", "Stefan Posch"],
    mediocampistas: ["Alessandro Schopf", "Carney Chukwuemeka", "Christoph Baumgartner", "Florian Grillitsch", "Konrad Laimer", "Marcel Sabitzer", "Nicolas Seiwald", "Patrick Wimmer", "Paul Wanner", "Romano Schmid", "Xaver Schlager"],
    delanteros: ["Marko Arnautovic", "Michael Gregoritsch", "Sasa Kalajdzic"],
  },
  "Jordania": {
    flagCode: "jo",
    porteros: ["Abdallah Al-Fakhouri", "Ahmad Al-Juiadi", "Nour Bani Attiah", "Yazid Abulaila"],
    defensas: ["Abdallah Nasib", "Anas Badawi", "Ehsan Haddad", "Husam Abu Dahab", "Mohammad Abualnadi", "Mohammad Abu Taha", "Mohammed Abu Hashish", "Mohannad Abu Taha", "Saed Al-Rosna", "Saleem Obaid", "Yazan Al-Arab", "Yousef Abu Al-Jazar", "Ahmad Assaf"],
    mediocampistas: ["Amer Jamous", "Ibrahim Sadeh", "Mohammed Al-Dawoud", "Nizar Al-Rashdan", "Noor Al-Rawabdeh", "Rajaei Ayed", "Yousef Qashi"],
    delanteros: ["Ali Azaizeh", "Ali Olwan", "Ibrahim Sabra", "Mohammed Abu Zraiq", "Mousa Al-Tamari", "Odeh Al-Fakhouri"],
  },

  // ── Grupo K ──────────────────────────────────────────────────────────────
  "Portugal": {
    flagCode: "pt",
    porteros: ["Diogo Costa", "José Sá", "Ricardo Velho", "Rui Silva"],
    defensas: ["Diogo Dalot", "Gonçalo Inacio", "João Cancelo", "Matheus Nunes", "Nélson Semedo", "Nuno Mendes", "Renato Veiga", "Rúben Dias", "Tomás Araújo"],
    mediocampistas: ["Bernardo Silva", "Bruno Fernandes", "João Neves", "Rúben Neves", "Samú Costa", "Vitinha"],
    delanteros: ["Cristiano Ronaldo", "Francisco Conceição", "Francisco Trincão", "Gonçalo Guedes", "Gonçalo Ramos", "João Félix", "Pedro Neto", "Rafael Leão"],
  },
  "RD Congo": {
    flagCode: "cd",
    porteros: ["Lionel Mpasi", "Matthieu Epolo", "Timothy Fayulu"],
    defensas: ["Aaron Tshibola", "Aaron Wan-Bissaka", "Axel Tuanzebe", "Arthur Masuaku", "Chancel Mbemba", "Dylan Batubinsika", "Gedeon Kalulu", "Joris Kayembe", "Steve Kapuadi"],
    mediocampistas: ["Brian Cipenga", "Edo Kayembe", "Gaël Kakuta", "Meschak Elia", "Nathanaël Mbuku", "Ngal'ayel Mukau", "Noah Sadiki", "Samuel Moutoussamy", "Charles Pickel", "Théo Bongonda"],
    delanteros: ["Cédric Bakambu", "Fiston Mayele", "Simon Banza", "Yoane Wissa"],
  },
  "Uzbekistán": {
    flagCode: "uz",
    porteros: ["Abduvokhid Nematov", "Botirali Ergashev", "Utkir Yusupov", "Vladimir Nazarov"],
    defensas: ["Abdulla Abdullaev", "Avazbek Ulmasaliev", "Behruz Karimov", "Diyor Ortikboev", "Farrukh Sayfiev", "Ibrohimkhalil Yuldoshev", "Jakhongir Urozov", "Khojiakbar Alijonov", "Muhammadrasul Abdumajidov", "Mukhammadkodir Hamraliev", "Rustamjon Ashurmatov", "Sherzod Nasrullaev", "Umarbek Eshmurodov"],
    mediocampistas: ["Akmal Mozgovoy", "Alisher Odilov", "Azizjon Ganiev", "Jamshid Iskanderov", "Jasurbek Jaloliddinov", "Kuvondik Ruziev", "Nodirbek Abdurazzokov", "Odiljon Khamrobekov", "Otabek Shukurov", "Sardorbek Rakhmonov", "Sherzod Esanov", "Umarali Rakhmonaliev"],
    delanteros: ["Abbosek Fayzullaev", "Azizbek Amonov", "Dostonbek Khamdamov", "Eldor Shomurodov", "Igor Sergeev", "Jaloliddin Masharipov", "Khusain Norchaev", "Oston Urunov", "Ruslanbek Jiyanov", "Sherzod Temirov"],
  },
  "Colombia": {
    flagCode: "co",
    porteros: ["Aldair Quintana", "Álvaro Montero", "Camilo Vargas", "David Ospina", "Kevin Mier", "Mosquera Marmolejo"],
    defensas: ["Álvaro Angulo", "Andrés Román", "Carlos Cuesta", "Cristian Borja", "Daniel Muñoz", "Davinson Sánchez", "Deiver Machado", "Édier Ocampo", "Jhohan Romana", "Jhon Lucumí", "Johan Mojica", "Juan Cabal", "Junior Hernández", "Santiago Arias", "Willer Ditta", "Yerry Mina", "Yerson Mosquera"],
    mediocampistas: ["James Rodríguez", "Jefferson Lerma", "Jhon Arias", "Jhon Solís", "Johan Rojas", "Jordan Barrera", "Jorge Carrascal", "Juan Cuadrado", "Juan Fernando Quintero", "Juan Portilla", "Richard Ríos", "Sebastian Gomez", "Wilmar Barrios", "Yáser Asprilla"],
    delanteros: ["Andrés Gómez", "Cucho Hernández", "Edwuin Cetré", "Jaminton Campaz", "Jhon Córdoba", "Jhon Durán", "Johan Carbonero", "Kevin Viveros", "Luis Díaz", "Luis Suárez", "Neyser Villarreal", "Rafael Santos Borré", "Sebastián Villa", "Stiven Mendoza"],
  },

  // ── Grupo L ──────────────────────────────────────────────────────────────
  "Inglaterra": {
    flagCode: "gb-eng",
    porteros: ["Dean Henderson", "James Trafford", "Jordan Pickford"],
    defensas: ["Dan Burn", "Djed Spence", "Ezri Konsa", "Jarell Quansah", "John Stones", "Marc Guéhi", "Nico O'Reilly", "Reece James", "Tino Livramento"],
    mediocampistas: ["Declan Rice", "Eberechi Eze", "Elliot Anderson", "Jordan Henderson", "Jude Bellingham", "Kobbie Mainoo", "Morgan Rogers"],
    delanteros: ["Anthony Gordon", "Bukayo Saka", "Harry Kane", "Ivan Toney", "Marcus Rashford", "Noni Madueke", "Ollie Watkins"],
  },
  "Croacia": {
    flagCode: "hr",
    porteros: ["Dominik Kotarski", "Dominik Livakovic", "Ivor Pandur"],
    defensas: ["Duje Caleta-Car", "Josip Stanisic", "Josip Sutalo", "Josko Gvardiol", "Luka Vuskovic", "Marin Pongracic", "Martin Erlic"],
    mediocampistas: ["Kristijan Jakic", "Luka Modric", "Luka Sucic", "Martin Baturina", "Mario Pasalic", "Mateo Kovacic", "Nikola Moro", "Nikola Vlasic", "Petar Sucic", "Toni Fruk"],
    delanteros: ["Andrej Kramaric", "Ante Budimir", "Igor Matanovic", "Ivan Perisic", "Marco Pasalic", "Petar Musa"],
  },
  "Ghana": {
    flagCode: "gh",
    porteros: ["Benjamin Asare", "Joseph Anang", "Lawrence Ati-Zigi"],
    defensas: ["Alexander Djiku", "Caleb Yirenkyi", "Derrick Köhn", "Derrick Luckassen", "Gideon Mensah", "Jerome Opoku", "Jonas Adjetey", "Kojo Oppong Pepprah", "Marvin Senaya", "Patrick Pfeiffer"],
    mediocampistas: ["Elisha Owusu", "Ibrahim Sulemana", "Kwasi Sibo", "Thomas Partey"],
    delanteros: ["Abdul Fatawu Issahaku", "Antoine Semenyo", "Brandon Thomas-Asante", "Christopher Bonsu Baah", "Daniel Agyei", "Iñaki Williams", "Jordan Ayew", "Kamal Deen Sulemana", "Prince Adu"],
  },
  "Panamá": {
    flagCode: "pa",
    porteros: ["Luis Mejía", "Orlando Mosquera"],
    defensas: ["Amir Murillo", "Andrés Andrade", "César Blackman", "Edgardo Fariña", "Eric Davis", "Fidel Escobar"],
    mediocampistas: ["Adalberto Carrasquilla", "Aníbal Godoy", "Cristian Martínez"],
    delanteros: ["Cecilio Waterman", "Eduardo Guerrero", "Ismael Díaz", "José Fajardo", "José Luis Rodríguez"],
  },
};

export const ALL_TEAMS = Object.entries(SQUADS).map(([team, { flagCode }]) => ({ team, flagCode }));
