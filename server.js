require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const HF_API_KEY = process.env.HF_API_KEY;
// const IMG_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const IMG_API_URL =
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

const session = require("express-session");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

if (!HF_API_KEY) {
  console.error(
    "❌ Error: Missing Hugging Face API Key. Set HF_API_KEY in your .env file."
  );
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views are found

axios.defaults.headers.common["Accept"] = "image/png"; // Force global default
axios.defaults.headers.post["Content-Type"] = "application/json";

// Route for landing page
app.get("/", (req, res) => {
  res.render("front"); // renders front.ejs
});

// Route for generator page
app.get("/generate_page", (req, res) => {
  if (!req.session.history) req.session.history = []; // ✅ Ensure it's initialized
  res.render("index", {
    images: [],
    video: null,
    error: null,
    prompt: "",
    history: req.session.history, // ✅ Pass history here
  });
});

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.redirect("/generate_page");

  try {
    const images = [];

    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay to avoid rate limits

      const response = await axios.post(
        IMG_API_URL,
        { inputs: `${prompt}`, variation: `${i + 1}` },
        {
          headers: { Authorization: `Bearer ${HF_API_KEY}` },
          "Content-Type": "application/json",
          Accept: "image/png",
          responseType: "arraybuffer",
          validateStatus: () => true, // prevent axios auto-throwing
        }
      );

      const base64Image = `data:image/png;base64,${Buffer.from(
        response.data
      ).toString("base64")}`;
      images.push(base64Image);
    }

    // 🧠 Store prompt & images in session for history
    if (!req.session.history) {
      req.session.history = [];
    }

    req.session.history.unshift({ prompt, images });
    req.session.history = req.session.history.slice(0, 10); // keep only last 5

    // 🖼️ Render with current and previous data
    res.render("index", {
      images,
      video: null,
      error: null,
      prompt,
      history: req.session.history,
    });
  } catch (error) {
    console.error(
      "❌ Error:",
      error.response?.data.toString() || error.message.toString()
    );
    const errorMessage = error.response?.data?.error || "Image API error.";

    // Preserve history and prompt even on error
    res.render("index", {
      images: [],
      video: null,
      error: errorMessage,
      prompt,
      history: req.session.history || [],
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
