const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/data", (req, res) => {
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data file.");
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post("/data", (req, res) => {
    const newData = req.body;
    fs.writeFile("data.json", JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            res.status(500).send("Error writing to data file.");
            return;
        }
        res.status(200).send("Data saved successfully.");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
