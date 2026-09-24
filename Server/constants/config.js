const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://globe-talk-brown.vercel.app",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

const GLOBE_TOKEN = "Globe-token";

export { corsOptions, GLOBE_TOKEN };