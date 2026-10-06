/**
 * Filmee - Initial Mock Database / Seed Data
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
        { screenId: 3, name: "Audi 1 (PXL 4DX)", rows: ["A", "B", "C", "D", "E", "F", "G"], cols: 10, premiumRows: ["A", "B"] }
      ]
    }
  ],

  movies: [
    {
      movieId: 1,
      title: "Dune: Part Two",
      genre: "Sci-Fi / Action / Adventure",
      language: "English, Hindi",
      durationMinutes: 166,
      rating: "9.4",
      ageRating: "UA 16+",
      releaseDate: "2024-03-01",
      status: "NOW_SHOWING",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future.",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem"
    },
    {
      movieId: 2,
      title: "Oppenheimer",
      genre: "Biography / Drama / History",
      language: "English",
      durationMinutes: 180,
      rating: "9.1",
      ageRating: "A",
      releaseDate: "2023-07-21",
      status: "NOW_SHOWING",
      posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II at the Manhattan Project.",
      director: "Christopher Nolan",
      cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr."
    },
    {
      movieId: 3,
      title: "Interstellar: 10th Anniversary Re-Release",
      genre: "Sci-Fi / Drama / Adventure",
      language: "English, IMAX",
      durationMinutes: 169,
      rating: "9.6",
      ageRating: "UA",
      releaseDate: "2024-11-01",
      status: "NOW_SHOWING",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      director: "Christopher Nolan",
      cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine"
    },
    {
      movieId: 4,
      title: "Spider-Man: Beyond the Spider-Verse",
      genre: "Animation / Action / Superhero",
      language: "English, Hindi, Tamil",
      durationMinutes: 142,
      rating: "Upcoming",
      ageRating: "UA",
      releaseDate: "2025-06-15",
      status: "UPCOMING",
      posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1200&auto=format&fit=crop&q=80",
      description: "Miles Morales embarks across the Multiverse to protect its very existence against an unfathomable cosmic threat alongside Gwen Stacy and fellow Spider-Heroes.",
      director: "Joaquim Dos Santos, Kemp Powers",
      cast: "Shameik Moore, Hailee Steinfeld, Oscar Isaac"
    }
  ],

  shows: [
    {
      showId: 101,
      movieId: 1,
      theaterId: 1,
      screenId: 1,
      showDate: new Date().toISOString().split("T")[0],
      startTime: "14:30",
      endTime: "17:16",
      standardPrice: 180,
      premiumPrice: 300,
      status: "ACTIVE"
    },
    {
      showId: 102,
      movieId: 1,
      theaterId: 1,
      screenId: 1,
      showDate: new Date().toISOString().split("T")[0],
      startTime: "18:45",
      endTime: "21:31",
      standardPrice: 220,
      premiumPrice: 350,
      status: "ACTIVE"
    },
    {
      showId: 103,
      movieId: 2,
      theaterId: 1,
      screenId: 2,
      showDate: new Date().toISOString().split("T")[0],
      startTime: "19:00",
      endTime: "22:00",
      standardPrice: 160,
      premiumPrice: 260,
      status: "ACTIVE"
    },
    {
      showId: 104,
      movieId: 3,
      theaterId: 1,
      screenId: 1,
      showDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      startTime: "20:00",
      endTime: "22:49",
      standardPrice: 200,
      premiumPrice: 320,
      status: "ACTIVE"
    }
  ],

  bookings: [
    {
      bookingId: 1,
      bookingReference: "FLM-2026-X89AD",
      userId: 2,
      showId: 101,
      movieId: 1,
      movieTitle: "Dune: Part Two",
      theaterName: "Filmee IMAX & Multiplex",
      screenName: "Audi 1 (IMAX 3D Laser)",
      showDate: new Date().toISOString().split("T")[0],
      showTime: "14:30",
      seats: ["C4", "C5"],
      totalTickets: 2,
      subtotal: 360,
      tax: 64.8,
      grandTotal: 424.8,
      status: "CONFIRMED",
      createdAt: new Date().toISOString()
    }
  ],

  bookedSeatsMap: {
    "101": ["C4", "C5", "D6", "D7", "A5"] // showId -> array of booked seat labels
  }
};
