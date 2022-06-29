import dotenv from "dotenv";
import express from "express";
import { listData, readData, writeData } from "./reduct";

const app = express();
app.use(express.json());

dotenv.config();

app.get("/", async (req, res, next) => {
  try {
    const query = req.query.ts;
    const timestamp = isNaN(+query) ? undefined : BigInt(+query);
    const data = await readData(timestamp);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

app.get("/interval", async (req, res, next) => {
  try {
    const startQuery = req.query.start;
    const stopQuery = req.query.stop;
    const start = isNaN(+startQuery) ? undefined : BigInt(+startQuery);
    const stop = isNaN(+stopQuery) ? undefined : BigInt(+stopQuery);
    const data = await listData(start, stop);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

app.post("/", async (req, res, next) => {
  try {
    const { data } = req.body;
    const timestamp = await writeData(data);
    res.json({ timestamp });
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  return console.log(
    `Express is listening at http://localhost:${process.env.PORT}`
  );
});
