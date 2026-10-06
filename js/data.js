/**
 * Filmee - Comprehensive Mock Database / Seed Data
 * Featuring Authentic Official Movie Posters, Anime Collection, Hindi & English Blockbusters
 */
const INITIAL_DATA = {
  users: [
    {
      userId: 1,
      fullName: "Administrator",
      email: "admin@filmee.com",
      password: "admin",
      phone: "9876543210",
      role: "ADMIN"
    },
    {
      userId: 2,
      fullName: "Soham Sonawan",
      email: "soham@example.com",
      password: "user123",
      phone: "9876543211",
      role: "CUSTOMER"
    },
    {
      userId: 3,
      fullName: "Rajveer Singh",
      email: "rajveer@example.com",
      password: "user123",
      phone: "9876543212",
      role: "CUSTOMER"
    }
  ],

  theaters: [
    {
      theaterId: 1,
      name: "Filmee IMAX & Multiplex",
      city: "Thane",
      address: "Ghodbunder Road, Thane West",
      screens: [
        { screenId: 1, name: "Audi 1 (IMAX 3D Laser)", rows: ["A", "B", "C", "D", "E", "F", "G", "H"], cols: 10, premiumRows: ["A", "B"] },
        { screenId: 2, name: "Audi 2 (Dolby Atmos 4K)", rows: ["A", "B", "C", "D", "E", "F"], cols: 8, premiumRows: ["A"] }
      ]
    },
    {
      theaterId: 2,
      name: "Filmee PXL Cinemas",
      city: "Mumbai",
      address: "Phoenix Palladium, Lower Parel",
      screens: [
        { screenId: 3, name: "Audi 1 (PXL 4DX)", rows: ["A", "B", "C", "D", "E", "F", "G"], cols: 10, premiumRows: ["A", "B"] },
        { screenId: 4, name: "Audi 2 (VIP Recliner Lounge)", rows: ["A", "B", "C", "D"], cols: 6, premiumRows: ["A", "B"] }
      ]
    },
    {
      theaterId: 3,
      name: "Filmee Cinepolis Luxe",
      city: "Pune",
      address: "Westend Mall, Aundh",
      screens: [
        { screenId: 5, name: "Audi 1 (Dolby Atmos 4K)", rows: ["A", "B", "C", "D", "E", "F", "G"], cols: 10, premiumRows: ["A", "B"] }
      ]
    },
    {
      theaterId: 4,
      name: "Filmee PVR Forum",
      city: "Bengaluru",
      address: "Koramangala, Bengaluru",
      screens: [
        { screenId: 6, name: "Audi 1 (IMAX 3D Laser)", rows: ["A", "B", "C", "D", "E", "F", "G", "H"], cols: 10, premiumRows: ["A", "B"] }
      ]
    }
  ],

  movies: [
    // ==================== ANIME MOVIES COLLECTION ====================
    {
      movieId: 1,
      title: "Demon Slayer: Kimetsu no Yaiba – Mugen Train",
      genre: "Anime / Action / Fantasy / Shonen",
      language: "Japanese, English, Hindi",
      durationMinutes: 117,
      rating: "9.8",
      ageRating: "UA 16+",
      releaseDate: "2020-10-16",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/h8Rb9gBr48ODIwYUttZNYeMWeUU.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/qjGrUmKW78MCFG8PTLDBp67S27p.jpg",
      description: "Tanjiro, Nezuko, Zenitsu, and Inosuke join Flame Hashira Kyojuro Rengoku aboard the mysterious Mugen Train to face Enmu and Upper Rank Three demon Akaza in an earth-shattering battle.",
      director: "Haruo Sotozaki (ufotable)",
      cast: "Natsuki Hanae, Satoshi Hino, Akari Kito, Hiro Shimono, Yoshitsugu Matsuoka, Akira Ishida"
    },
    {
      movieId: 2,
      title: "Jujutsu Kaisen 0",
      genre: "Anime / Action / Supernatural / Dark Fantasy",
      language: "Japanese, English, Hindi",
      durationMinutes: 105,
      rating: "9.6",
      ageRating: "UA 16+",
      releaseDate: "2021-12-24",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/23oJaeBh0FDk2mQ2P240PU9Xxfh.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/cYyUinLXRbQwE4PAt2mQLTGBqti.jpg",
      description: "Yuta Okkotsu is haunted by the cursed spirit of his childhood friend Rika. Satoru Gojo enrolls him into Tokyo Jujutsu High to help him control Rika's overwhelming cursed energy and thwart Suguru Geto's night parade of a hundred demons.",
      director: "Sunghoo Park (MAPPA)",
      cast: "Megumi Ogata, Kana Hanazawa, Mikako Komatsu, Koki Uchiyama, Tomokazu Seki, Yuichi Nakamura"
    },
    {
      movieId: 3,
      title: "Suzume",
      genre: "Anime / Fantasy / Adventure / Drama",
      language: "Japanese, English, Hindi",
      durationMinutes: 122,
      rating: "9.5",
      ageRating: "U",
      releaseDate: "2022-11-11",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/yStW1TXF5s7Tbtu9KjIZEaWl6HL.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/4tdV5AeojEdbvn6VpeQrbuDlmzs.jpg",
      description: "A 17-year-old girl named Suzume helps a mysterious young Closer named Souta close supernatural doors across Japan that are unleashing colossal disasters upon the world.",
      director: "Makoto Shinkai (CoMix Wave Films)",
      cast: "Nanoka Hara, Hokuto Matsumura, Eri Fukatsu, Shota Sometani, Sairi Ito"
    },
    {
      movieId: 4,
      title: "Your Name (Kimi no Na wa)",
      genre: "Anime / Romance / Fantasy / Sci-Fi / Drama",
      language: "Japanese, English, Hindi",
      durationMinutes: 112,
      rating: "9.9",
      ageRating: "U",
      releaseDate: "2016-08-26",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/vfJFJPepRKapMd5G2ro7klIRysq.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
      description: "Two high school students—Mitsuha in rural Itomori and Taki in metropolitan Tokyo—mysteriously begin swapping bodies across time and space, forging an unbreakable bond before a celestial catastrophe unfolds.",
      director: "Makoto Shinkai",
      cast: "Ryunosuke Kamiki, Mone Kamishiraishi, Ryo Narita, Aoi Yuki, Nobunaga Shimazaki"
    },
    {
      movieId: 5,
      title: "The Boy and the Heron",
      genre: "Anime / Fantasy / Adventure / Studio Ghibli",
      language: "Japanese, English",
      durationMinutes: 124,
      rating: "9.4",
      ageRating: "UA 13+",
      releaseDate: "2023-07-14",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/f4oZTcfGrVTXKTWg157AwikXqmP.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/75nSb1fbWooipwcSU5bUttiOriI.jpg",
      description: "Oscar-winning masterpiece by Hayao Miyazaki. Following the loss of his mother during the Pacific War, young Mahito ventures into a magical tower shared by the living and the dead, guided by a talking grey heron.",
      director: "Hayao Miyazaki (Studio Ghibli)",
      cast: "Soma Santoki, Masaki Suda, Aimyon, Yoshino Kimura, Takuya Kimura, Ko Shibasaki"
    },
    {
      movieId: 6,
      title: "Spirited Away",
      genre: "Anime / Fantasy / Adventure / Ghibli Classic",
      language: "Japanese, English, Hindi",
      durationMinutes: 125,
      rating: "9.9",
      ageRating: "U",
      releaseDate: "2001-07-20",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/jUo8cNmU400WtZiJss45HNXlQ2e.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg",
      description: "Ten-year-old Chihiro enters a magical spirit realm ruled by the witch Yubaba. To rescue her parents and return home, she must work at Yubaba's bathhouse with the help of the river spirit Haku.",
      director: "Hayao Miyazaki (Studio Ghibli)",
      cast: "Rumi Hiiragi, Miyu Irino, Mari Natsuki, Takeshi Naito, Yasuko Sawaguchi"
    },
    {
      movieId: 7,
      title: "Weathering With You",
      genre: "Anime / Fantasy / Romance / Drama",
      language: "Japanese, English",
      durationMinutes: 112,
      rating: "9.3",
      ageRating: "U",
      releaseDate: "2019-07-19",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/ize3ZieqSy0TCWljmVoEiy8fSFS.jpg",
      description: "A runaway high school boy befriended in Tokyo meets an orphan girl who possesses the extraordinary ability to stop the relentless rain and clear the sky through prayer.",
      director: "Makoto Shinkai",
      cast: "Kotaro Daigo, Nana Mori, Shun Oguri, Tsubasa Honda, Chieko Baisho"
    },
    {
      movieId: 8,
      title: "One Piece Film: Red",
      genre: "Anime / Action / Musical / Shonen",
      language: "Japanese, English, Hindi",
      durationMinutes: 115,
      rating: "9.2",
      ageRating: "UA 13+",
      releaseDate: "2022-08-06",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/8ibfhe4P7rhmn3lrPhOZzIJHA2B.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/wghKvEjM7UzQzQcKnGbDjOyQO13.jpg",
      description: "Uta, the world's most beloved pop singer and daughter of Red-Haired Shanks, reveals her otherworldly singing voice at an island concert attended by the Straw Hat Pirates, Marines, and world rulers.",
      director: "Goro Taniguchi (Toei Animation)",
      cast: "Mayumi Tanaka, Kaori Nazuka, Ado, Shuichi Ikeda, Kazuya Nakai, Akemi Okamura"
    },
    {
      movieId: 9,
      title: "A Silent Voice (Koe no Katachi)",
      genre: "Anime / Drama / Romance / Psychological",
      language: "Japanese, English",
      durationMinutes: 130,
      rating: "9.7",
      ageRating: "UA 13+",
      releaseDate: "2016-09-17",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/tuFaWiqX0TXoWu7DGNcmX3UW7sT.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg",
      description: "Shoya Ishida seeks redemption and forgiveness from Shoko Nishimiya, a deaf classmate he bullied years earlier in elementary school, embarking on an emotional journey of healing.",
      director: "Naoko Yamada (Kyoto Animation)",
      cast: "Miyu Irino, Saori Hayami, Aoi Yuki, Kensho Ono, Yuki Kaneko"
    },
    {
      movieId: 10,
      title: "The First Slam Dunk",
      genre: "Anime / Sports / Drama / Basketball",
      language: "Japanese, English",
      durationMinutes: 124,
      rating: "9.5",
      ageRating: "U",
      releaseDate: "2022-12-03",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/yq4tSiYvfGw150Ntq8NbsFZ12En.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/rBgzI1a126JWA7YJd7p1NBmC61z.jpg",
      description: "Point guard Ryota Miyagi and the Shohoku High basketball team clash with reigning champions Sannoh Kogyo in the climactic Inter-High National Tournament.",
      director: "Takehiko Inoue (Toei Animation)",
      cast: "Shugo Nakamura, Jun Kasama, Shinichiro Kamio, Subaru Kimura, Kenta Miyake"
    },
    {
      movieId: 11,
      title: "Dragon Ball Super: Super Hero",
      genre: "Anime / Martial Arts / Action / Sci-Fi",
      language: "Japanese, English, Hindi",
      durationMinutes: 100,
      rating: "9.1",
      ageRating: "UA 13+",
      releaseDate: "2022-06-11",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/pi0iZOEHeA3ih4p1IwAG4x2DZNH.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/uR0FopHrAjDlG5q6PZB07a1JOva.jpg",
      description: "The Red Ribbon Army returns with two ultimate androids, Gamma 1 and Gamma 2. Piccolo and Gohan awaken their deepest power forms (Orange Piccolo & Beast Gohan) to protect Earth.",
      director: "Tetsuro Kodama (Toei Animation)",
      cast: "Masako Nozawa, Toshio Furukawa, Yuko Minaguchi, Hiroshi Kamiya, Mamoru Miyano"
    },
    {
      movieId: 12,
      title: "Princess Mononoke",
      genre: "Anime / Epic Fantasy / Adventure / Studio Ghibli",
      language: "Japanese, English",
      durationMinutes: 134,
      rating: "9.8",
      ageRating: "UA 16+",
      releaseDate: "1997-07-12",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/cMYCDADoLKLbB83g4WnJegaZimC.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/gl0jzn4BupSbL2qMVeqrjKkF9Js.jpg",
      description: "Prince Ashitaka journeying through medieval Japan finds himself caught in an epic war between the forest gods and Lady Eboshi's industrial Iron Town.",
      director: "Hayao Miyazaki (Studio Ghibli)",
      cast: "Yoji Matsuda, Yuriko Ishida, Yuko Tanaka, Kaoru Kobayashi, Masahiko Nishimura"
    },

    // ==================== HINDI BLOCKBUSTERS ====================
    {
      movieId: 13,
      title: "Stree 2: Sarkate Ka Aatank",
      genre: "Horror / Comedy / Mystery",
      language: "Hindi",
      durationMinutes: 147,
      rating: "9.2",
      ageRating: "UA 13+",
      releaseDate: "2024-08-15",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/fVV0A67kDjTTQ4CvUn8LoletRmI.jpg",
      description: "The town of Chanderi is haunted once again, this time by a terrifying headless entity named Sarkata who is abducting progressive women. Vicky, Bittu, Janna, and Rudra team up with their mysterious protector to save the town.",
      director: "Amar Kaushik",
      cast: "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi, Abhishek Banerjee, Aparshakti Khurana"
    },
    {
      movieId: 14,
      title: "Kalki 2898 AD",
      genre: "Sci-Fi / Mythological / Action / Epic",
      language: "Hindi, Telugu, Tamil",
      durationMinutes: 181,
      rating: "9.3",
      ageRating: "UA 13+",
      releaseDate: "2024-06-27",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg",
      description: "Set in a post-apocalyptic world in the year 2898 AD, Ashwatthama awaits the arrival of the tenth avatar of Lord Vishnu to protect the unborn savior from Supreme Yaskin's Complex.",
      director: "Nag Ashwin",
      cast: "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone, Disha Patani"
    },
    {
      movieId: 15,
      title: "Bhool Bhulaiyaa 3",
      genre: "Horror / Comedy / Mystery",
      language: "Hindi",
      durationMinutes: 158,
      rating: "8.9",
      ageRating: "UA 13+",
      releaseDate: "2024-11-01",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/3AfHD1HoaQpQwKH8kxRdBKVmzeU.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/1TdCtQaAqZhKRSOSbPi1EPToJxN.jpg",
      description: "Rooh Baba returns to face the dual wrath of Manjulika in the historic palace of Raktaghat, unlocking ancestral secrets with laughter and supernatural chills.",
      director: "Anees Bazmee",
      cast: "Kartik Aaryan, Vidya Balan, Madhuri Dixit, Triptii Dimri, Rajpal Yadav"
    },
    {
      movieId: 16,
      title: "Singham Again",
      genre: "Action / Thriller / Cop Universe",
      language: "Hindi",
      durationMinutes: 144,
      rating: "8.8",
      ageRating: "UA 16+",
      releaseDate: "2024-11-01",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/2JbNkHg8m7LaBy61LyrnnlenaxY.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/lexEx0B4WDOXGfqPTj4R8FCrE7H.jpg",
      description: "DCP Bajirao Singham leads the high-octane Cop Universe squad across borders to rescue his wife Avni from international terror mastermind Danger Lanka.",
      director: "Rohit Shetty",
      cast: "Ajay Devgn, Kareena Kapoor Khan, Ranveer Singh, Akshay Kumar, Deepika Padukone, Tiger Shroff, Arjun Kapoor"
    },
    {
      movieId: 17,
      title: "Jawan",
      genre: "Action / Thriller / Mass Drama",
      language: "Hindi, Tamil, Telugu",
      durationMinutes: 169,
      rating: "9.1",
      ageRating: "UA 16+",
      releaseDate: "2023-09-07",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/5LtSjMNw6j3LkG29Oa4O0iY5U8.jpg",
      description: "A high-octane action thriller outlining the emotional journey of a prison warden and former commando who sets out to rectify the wrongs in society while confronting a dangerous arms dealer.",
      director: "Atlee",
      cast: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone, Priyamani, Sanya Malhotra"
    },
    {
      movieId: 18,
      title: "Fighter",
      genre: "Action / Aviation / Military Drama",
      language: "Hindi",
      durationMinutes: 166,
      rating: "8.9",
      ageRating: "UA 13+",
      releaseDate: "2024-01-25",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/zqFuriKJ6pYDvf72kXNLONnuE8k.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/vcc6NDwsMwNrwHgVuI9lGdWJLB8.jpg",
      description: "Top IAF aviators assemble in the elite 'Air Dragons' unit to defend Indian airspace against terror threats with supersonic dogfights and unwavering courage.",
      director: "Siddharth Anand",
      cast: "Hrithik Roshan, Deepika Padukone, Anil Kapoor, Karan Singh Grover, Akshay Oberoi"
    },

    // ==================== HOLLYWOOD BLOCKBUSTERS ====================
    {
      movieId: 19,
      title: "Deadpool & Wolverine",
      genre: "Action / Comedy / Sci-Fi / Superhero",
      language: "English, Hindi",
      durationMinutes: 128,
      rating: "9.5",
      ageRating: "A 18+",
      releaseDate: "2024-07-26",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
      description: "A listless Wade Wilson toils in civilian life until the Time Variance Authority pulls him into a mission that will change the history of the Marvel Cinematic Universe with Wolverine.",
      director: "Shawn Levy",
      cast: "Ryan Reynolds, Hugh Jackman, Emma Corrin, Matthew Macfadyen, Dafne Keen"
    },
    {
      movieId: 20,
      title: "Gladiator II",
      genre: "Action / Adventure / Historical Drama",
      language: "English, Hindi",
      durationMinutes: 148,
      rating: "9.2",
      ageRating: "A 18+",
      releaseDate: "2024-11-15",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
      description: "Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the tyrannical emperors conquer his home in Numidia.",
      director: "Ridley Scott",
      cast: "Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen, Joseph Quinn"
    },
    {
      movieId: 21,
      title: "Dune: Part Two",
      genre: "Sci-Fi / Action / Adventure",
      language: "English, Hindi",
      durationMinutes: 166,
      rating: "9.7",
      ageRating: "UA 16+",
      releaseDate: "2024-03-01",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family on Arrakis, seizing destiny across the cosmos.",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler, Florence Pugh"
    },
    {
      movieId: 22,
      title: "Oppenheimer",
      genre: "Biography / Drama / History",
      language: "English, Hindi",
      durationMinutes: 180,
      rating: "9.6",
      ageRating: "UA 16+",
      releaseDate: "2023-07-21",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project at Los Alamos.",
      director: "Christopher Nolan",
      cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh"
    },
    {
      movieId: 23,
      title: "Interstellar",
      genre: "Sci-Fi / Adventure / Drama",
      language: "English, Hindi",
      durationMinutes: 169,
      rating: "9.8",
      ageRating: "UA 13+",
      releaseDate: "2014-11-07",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
      description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      director: "Christopher Nolan",
      cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine, Matt Damon"
    },
    {
      movieId: 24,
      title: "Spider-Man: Across the Spider-Verse",
      genre: "Animation / Action / Adventure / Sci-Fi",
      language: "English, Hindi, Tamil",
      durationMinutes: 140,
      rating: "9.7",
      ageRating: "U",
      releaseDate: "2024-12-25",
      status: "UPCOMING",
      posterUrl: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence and must redefine what it means to be a hero.",
      director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
      cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Daniel Kaluuya, Karan Soni"
    },
    {
      movieId: 25,
      title: "Avatar: The Way of Water",
      genre: "Sci-Fi / Action / Adventure",
      language: "English, Hindi",
      durationMinutes: 192,
      rating: "9.1",
      ageRating: "UA 13+",
      releaseDate: "2025-12-19",
      status: "UPCOMING",
      posterUrl: "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/kJsPVzdyBrYHLomuNv5SJDXUQ2f.jpg",
      description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
      director: "James Cameron",
      cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Kate Winslet"
    },

    // ==================== MARATHI CINEMA BLOCKBUSTERS ====================
    {
      movieId: 26,
      title: "Sairat",
      genre: "Marathi / Romance / Drama / Social",
      language: "Marathi, Hindi",
      durationMinutes: 174,
      rating: "9.8",
      ageRating: "UA 13+",
      releaseDate: "2016-04-29",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/d8K4ZI1RSxMkIIwu5cuvZmzwohq.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/vBId5iBnayC6yyqKFeX9shSaoCQ.jpg",
      description: "Archie, a fierce upper-class girl, and Parshya, a gifted lower-class fisherman's son, fall passionately in love defying deep-rooted societal divides in rural Maharashtra.",
      director: "Nagraj Manjule",
      cast: "Rinku Rajguru, Akash Thosar, Tanaji Galgunde, Arbaz Shaikh, Anuja Mule"
    },
    {
      movieId: 27,
      title: "Baipan Bhaari Deva",
      genre: "Marathi / Comedy / Family / Drama",
      language: "Marathi",
      durationMinutes: 140,
      rating: "9.7",
      ageRating: "U",
      releaseDate: "2023-06-30",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/lRT4McN9haKNzktzgTigehpb0TU.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/lRT4McN9haKNzktzgTigehpb0TU.jpg",
      description: "Six estranged sisters reunite to participate in a traditional Mangalagaur dance competition, rediscovering their unbreakable sisterhood, healing past wounds, and reclaiming their joy.",
      director: "Kedar Shinde",
      cast: "Rohini Hattangadi, Vandana Gupte, Sukanya Kulkarni, Shilpa Navalkar, Suchitra Bandekar, Deepa Parab"
    },
    {
      movieId: 28,
      title: "Ved",
      genre: "Marathi / Romance / Drama / Musical",
      language: "Marathi, Hindi",
      durationMinutes: 154,
      rating: "9.3",
      ageRating: "UA 13+",
      releaseDate: "2022-12-30",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/kNd1IkaAVOvrkDqvCsjEiSrWn29.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/kNd1IkaAVOvrkDqvCsjEiSrWn29.jpg",
      description: "Former star cricketer Satya descends into grief after losing his first love Nisha, until his devoted childhood friend Shravani stands by him through every storm.",
      director: "Riteish Deshmukh",
      cast: "Riteish Deshmukh, Genelia D'Souza, Jiya Shankar, Ashok Saraf, Salman Khan"
    },
    {
      movieId: 29,
      title: "Pawankhind",
      genre: "Marathi / Historical Action / Epic / War",
      language: "Marathi, Hindi",
      durationMinutes: 153,
      rating: "9.8",
      ageRating: "UA 16+",
      releaseDate: "2022-02-18",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/ArI2G4lRFQz5eqo8cXUZ7PDVgdY.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/xLnY4h2GMgtKtV5DJV5pGjTZdmL.jpg",
      description: "The legendary last stand of Baji Prabhu Deshpande and 300 brave Bandal warriors holding off a massive Adilshahi army at Ghodkhind pass to ensure Chhatrapati Shivaji Maharaj safely reaches Vishalgad.",
      director: "Digpal Lanjekar",
      cast: "Chinmay Mandlekar, Ajay Purkar, Sameer Dharmadhikari, Ankit Mohan, Prajakta Mali"
    },
    {
      movieId: 30,
      title: "Subhedar",
      genre: "Marathi / Historical Action / Epic",
      language: "Marathi",
      durationMinutes: 148,
      rating: "9.5",
      ageRating: "UA 16+",
      releaseDate: "2023-08-25",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/vnM26ChrGes8dlT106LK9g3kaQu.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/3XOOvMWkqPeknaCzYLvcR7wXTxK.jpg",
      description: "The heroic saga of Subhedar Tanaji Malusare, who pledged his life and conquered the impregnable Kondhana fort (Sinhagad) for Swarajya.",
      director: "Digpal Lanjekar",
      cast: "Ajay Purkar, Chinmay Mandlekar, Mrinal Kulkarni, Smita Shewale, Shivani Rangole"
    },
    {
      movieId: 31,
      title: "Jhimma 2",
      genre: "Marathi / Comedy / Drama / Travel",
      language: "Marathi",
      durationMinutes: 133,
      rating: "9.2",
      ageRating: "U",
      releaseDate: "2023-11-24",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/cwzG6NY6LDQQfpt7LYXYob5NUaG.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/cwzG6NY6LDQQfpt7LYXYob5NUaG.jpg",
      description: "The beloved group of women embark on another heartwarming and hilarious vacation to the picturesque United Kingdom to celebrate Indu Darling's 75th birthday.",
      director: "Hemant Dhome",
      cast: "Suhas Joshi, Nirmiti Sawant, Suchitra Bandekar, Kshitee Jog, Sayali Sanjeev, Rinku Rajguru, Siddharth Chandekar"
    },
    {
      movieId: 32,
      title: "Katyar Kaljat Ghusali",
      genre: "Marathi / Musical / Classical / Drama",
      language: "Marathi",
      durationMinutes: 162,
      rating: "9.6",
      ageRating: "U",
      releaseDate: "2015-11-12",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/8FwgAZTVVtqMbW4y2dBuoJjdNXt.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/tBH3CVthbZUESP3sdLvYrPL3i7b.jpg",
      description: "An epic musical rivalry between royal court singers Pandit Bhanu Shankar Shastri and Khangsaheb Aftab Hussain Bareliwale spanning decades of unmatched classical ragas.",
      director: "Subodh Bhave",
      cast: "Sachin Pilgaonkar, Subodh Bhave, Shankar Mahadevan, Amruta Khanvilkar, Sakshi Tanwar"
    },
    {
      movieId: 33,
      title: "Natsamrat",
      genre: "Marathi / Drama / Emotional Masterpiece",
      language: "Marathi",
      durationMinutes: 166,
      rating: "9.9",
      ageRating: "UA 16+",
      releaseDate: "2016-01-01",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/x4KvM8NBi8m44aqwEMgsJPzA5Ne.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/mUbq0l1nGHbyFyNncxvLJMKXMUw.jpg",
      description: "Celebrated Shakespearean theater actor Ganpat Ramchandra Belwalkar faces devastating abandonment and betrayal from his own children after retiring from the stage.",
      director: "Mahesh Manjrekar",
      cast: "Nana Patekar, Medha Manjrekar, Vikram Gokhale, Sunil Barve, Mrunmayee Deshpande"
    },

    // ==================== CARTOON, DORAEMON & ANIMATION COLLECTION ====================
    {
      movieId: 34,
      title: "Doraemon the Movie: Nobita's Sky Utopia",
      genre: "Cartoon / Doraemon / Anime / Kids / Sci-Fi",
      language: "Hindi, English, Japanese",
      durationMinutes: 108,
      rating: "9.7",
      ageRating: "U",
      releaseDate: "2023-03-03",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/uux6M8z3hxLDkq8LXSzq8528mrq.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/zaAo7ytwAIaQZxIPBC4kfRSPlM0.jpg",
      description: "Doraemon, Nobita, and their friends embark on a majestic zeppelin airship voyage to discover Paradapia, a utopian flying island where everyone is supposedly perfect, uncovering a cosmic mystery.",
      director: "Takumi Doyama",
      cast: "Wasabi Mizuta, Megumi Ohara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki, Ren Nagase"
    },
    {
      movieId: 35,
      title: "Stand by Me Doraemon 2",
      genre: "Cartoon / Doraemon / 3D Animation / Kids",
      language: "Hindi, English, Japanese",
      durationMinutes: 96,
      rating: "9.8",
      ageRating: "U",
      releaseDate: "2020-11-20",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/vBv8iOFPLnXmtELUjcFc7OKHsR4.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/fStC0dSCRQslE9NzXa36EyOom81.jpg",
      description: "Nobita travels back in time to show his beloved grandmother his future bride Shizuka. But on the wedding day in the future, adult Nobita goes missing!",
      director: "Ryuichi Yagi, Takashi Yamazaki",
      cast: "Wasabi Mizuta, Megumi Ohara, Satoshi Tsumabuki, Nobuko Miyamoto"
    },
    {
      movieId: 36,
      title: "Doraemon: Nobita's Earth Symphony",
      genre: "Cartoon / Doraemon / Musical / Fantasy / Kids",
      language: "Hindi, English, Japanese",
      durationMinutes: 115,
      rating: "9.5",
      ageRating: "U",
      releaseDate: "2024-03-01",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/Z3mSxuPRNiFYxf1LBoGz3YrJzC.jpg",
      description: "When an alien creature threatens to erase music from the universe, Doraemon and Nobita use musical instruments powered by magical gadgets to save Earth's harmony.",
      director: "Kazuaki Imai",
      cast: "Wasabi Mizuta, Megumi Ohara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki"
    },
    {
      movieId: 37,
      title: "Shinchan: The Super-Powered Climax",
      genre: "Cartoon / 3D Comedy / Superhero / Kids",
      language: "Hindi, English, Japanese",
      durationMinutes: 94,
      rating: "9.4",
      ageRating: "U",
      releaseDate: "2023-08-04",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/a56Fm2YWrlnqlC3TIgDvCJdzlKI.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/gjEiHrj8dSsgL25XbIxT9o5qO3u.jpg",
      description: "Shinchan is hit by a mysterious glowing beam from outer space giving him superhuman telekinetic powers, just as a dark villain receives sinister psychic abilities.",
      director: "Hitoshi One",
      cast: "Yumiko Kobayashi, Miki Narahashi, Toshiyuki Morikawa, Satomi Korogi"
    },
    {
      movieId: 38,
      title: "Inside Out 2",
      genre: "Cartoon / Disney Pixar / Comedy / Family / Kids",
      language: "English, Hindi",
      durationMinutes: 96,
      rating: "9.8",
      ageRating: "U",
      releaseDate: "2024-06-14",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg",
      description: "Joy, Sadness, Anger, Fear, and Disgust have headquarters running smoothly, until Anxiety, Envy, Ennui, and Embarrassment suddenly arrive as Riley enters teenage years.",
      director: "Kelsey Mann",
      cast: "Amy Poehler, Maya Hawke, Phyllis Smith, Lewis Black, Tony Hale, Liza Lapira"
    },
    {
      movieId: 39,
      title: "Kung Fu Panda 4",
      genre: "Cartoon / DreamWorks Animation / Action / Kids",
      language: "English, Hindi",
      durationMinutes: 94,
      rating: "9.3",
      ageRating: "U",
      releaseDate: "2024-03-08",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/3ffPx9jqg0yj9y1KWeagT7D20CB.jpg",
      description: "Po must train a new Dragon Warrior while facing the formidable sorceress Chameleon, who can shapeshift into every master villain Po has ever defeated.",
      director: "Mike Mitchell",
      cast: "Jack Black, Awkwafina, Viola Davis, Dustin Hoffman, Bryan Cranston, James Hong"
    },
    {
      movieId: 40,
      title: "Despicable Me 4",
      genre: "Cartoon / Illumination / Comedy / Family / Kids",
      language: "English, Hindi",
      durationMinutes: 95,
      rating: "9.1",
      ageRating: "U",
      releaseDate: "2024-07-03",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/twsxsfao6ZOVvT8LfudH603MMi6.jpg",
      description: "Gru and Lucy welcome Gru Jr. to the family, but must go on the run when vengeful supervillain Maxime Le Mal escapes prison seeking revenge.",
      director: "Chris Renaud",
      cast: "Steve Carell, Kristen Wiig, Will Ferrell, Sofia Vergara, Pierre Coffin"
    },
    {
      movieId: 41,
      title: "Chhota Bheem and the Curse of Damyaan",
      genre: "Cartoon / Adventure / Action / Fantasy / Kids",
      language: "Hindi, English",
      durationMinutes: 125,
      rating: "9.0",
      ageRating: "U",
      releaseDate: "2024-05-31",
      status: "NOW_SHOWING",
      posterUrl: "https://image.tmdb.org/t/p/w780/wQvja2azMSrxYy30D9Skq76pdhz.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/vt6ZkHyrrfLlTdiomnoGlNcgcHy.jpg",
      description: "Bheem and his squad travel back 1,000 years to the ancient kingdom of Sonapur to defeat the immortal demon king Damyaan before he conquers Dholakpur.",
      director: "Rajiv Chilaka",
      cast: "Yagya Bhasin, Anupam Kher, Makarand Deshpande, Surabhi Tiwari"
    }
  ],

  // Auto-generate active showtimes across all theaters for today & upcoming days
  shows: [],

  bookings: [
    {
      bookingId: 1,
      bookingRef: "FLM-2026-X89AD",
      userId: 2,
      movieId: 1,
      theaterId: 1,
      screenId: 1,
      showDate: new Date().toISOString().split("T")[0],
      showTime: "06:30 PM",
      seats: ["C4", "C5"],
      totalAmount: 424.80,
      paymentMethod: "UPI (filmee.customer@okaxis)",
      bookingTime: new Date().toISOString(),
      status: "CONFIRMED"
    }
  ]
};

// Generate comprehensive multi-day showtimes (multiple slots per screen/theater) for all movies
(function generateDynamicShows() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // Multi-slot schedules for different screens
  const screenTimeSchedules = {
    // Audi 1 (IMAX 3D Laser / PXL 4DX)
    1: [
      { time: "09:15 AM", type: "Morning Special" },
      { time: "12:30 PM", type: "Matinee Show" },
      { time: "03:45 PM", type: "Afternoon Prime" },
      { time: "07:00 PM", type: "Evening Blockbuster" },
      { time: "10:15 PM", type: "Night Premiere" }
    ],
    // Audi 2 (Dolby Atmos 4K / VIP Recliner Lounge)
    2: [
      { time: "10:30 AM", type: "Morning Matinee" },
      { time: "01:45 PM", type: "Afternoon Show" },
      { time: "05:15 PM", type: "Sunset Show" },
      { time: "08:30 PM", type: "Prime Time" },
      { time: "11:30 PM", type: "Midnight Special" }
    ],
    // Default / Single screen audis
    default: [
      { time: "09:30 AM", type: "Morning Show" },
      { time: "11:45 AM", type: "Matinee" },
      { time: "02:15 PM", type: "Afternoon Prime" },
      { time: "05:00 PM", type: "Evening Prime" },
      { time: "07:45 PM", type: "Blockbuster Night" },
      { time: "10:45 PM", type: "Midnight Laser" }
    ]
  };

  let showCounter = 1;
  const showsList = [];

  INITIAL_DATA.movies.forEach((movie, mIndex) => {
    // Generate shows for Now Showing and Advance Booking for Upcoming
    dates.forEach((dateStr, dIndex) => {
      // For upcoming movies, generate shows starting from day 2 or 3 as Advance Booking Previews
      if (movie.status === "COMING_SOON" && dIndex < 2) {
        return;
      }

      INITIAL_DATA.theaters.forEach((theater) => {
        theater.screens.forEach((screen) => {
          const schedule = screenTimeSchedules[screen.screenId] || screenTimeSchedules.default;
          const isWeekend = (new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6);

          const stdBase = isWeekend ? 240 : 190;
          const premBase = isWeekend ? 390 : 320;

          // Add multiple showtimes per screen
          schedule.forEach((slot, slotIdx) => {
            // Slight price variation for prime evening
            const isPrimeTime = slot.time.includes("07:") || slot.time.includes("08:") || slot.time.includes("05:");
            const stdPrice = isPrimeTime ? stdBase + 30 : stdBase;
            const premPrice = isPrimeTime ? premBase + 40 : premBase;

            showsList.push({
              showId: showCounter++,
              movieId: movie.movieId,
              theaterId: theater.theaterId,
              screenId: screen.screenId,
              showDate: dateStr,
              startTime: slot.time,
              slotType: slot.type,
              standardPrice: stdPrice,
              premiumPrice: premPrice,
              status: "ACTIVE",
              bookedSeats: (dIndex === 0 && (mIndex + slotIdx) % 3 === 0) ? ["A3", "A4", "C6", "D5", "E2"] : ["B2", "B3"]
            });
          });
        });
      });
    });
  });

  INITIAL_DATA.shows = showsList;
})();

