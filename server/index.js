const express = require("express");
const app = express();

const cors = require("cors");

// ✅ Allow multiple frontend URLs
const allowedOrigins = [
  "https://study-point-kappa.vercel.app",
  "https://study-point-two.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    credentials: true, // ✅ Allow cookies (if needed)
  })
);

// ✅ Middleware to Add CORS Headers to All Responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ Your routes and other middleware here...

app.listen(process.env.PORT || 4000, () => {
  console.log(`App is Running`);
});
