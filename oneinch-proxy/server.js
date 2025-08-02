// server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // enable JSON body parsing

const PORT = 3001;

app.get("/tokens", async (req, res) => {
  try {
    const response = await axios.get("https://api.1inch.dev/swap/v6.1/1/tokens", {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        Accept: "application/json",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching tokens:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add this new route to get swap transaction
app.get("/swap", async (req, res) => {
  const { src, dst, amount, from, slippage } = req.query;

  if (!src || !dst || !amount || !from) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const response = await axios.get("https://api.1inch.dev/swap/v6.0/1/swap", {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        Accept: "application/json",
      },
      params: {
        src,
        dst,
        amount,
        from,
        slippage: slippage || 1,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Swap API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
