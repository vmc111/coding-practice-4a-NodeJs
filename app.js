const express = require("express");

const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const { open } = require("sqlite");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const InitializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

InitializeDbServer();

//List of Players

app.get("/players/", async (request, response) => {
  const playersQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const booksArray = await db.all(playersQuery);
  response.send(booksArray);
});

// Create New Player

app.post("players", async (request, response) => {
  const playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;

  const createPlayerQuery = `
    Insert into 
    cricket_team (player_name,jersey_number, role)
    Values (${playerName}, ${jerseyNumber}, ${role});`;

  const dbResponse = await db.run(createPlayerQuery);
  const playerId = dbResponse.lastId;
  response.send("Player Added to Team");
});

module.exports = app;