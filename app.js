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

const requiredPlayerConvert = (requiredPlayer) => {
  return {
    playerId: requiredPlayer.player_id,
    playerName: requiredPlayer.player_name,
    jerseyNumber: requiredPlayer.jersey_number,
    role: requiredPlayer.role,
  };
};

app.get("/players/", async (request, response) => {
  const playersQuery = `
    SELECT
      *
    FROM
      cricket_team
    `;

  let responseArray = await db.all(playersQuery);
  responseArray = responseArray.map(requiredPlayerConvert);
  response.send(responseArray);
});

// Create New Player

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  console.log(request.body);
  const createPlayerQuery = `
   INSERT INTO 
   cricket_team (player_name, jersey_number, role) 
   VALUES ('${playerName}', ${jerseyNumber},'${role}');`;
  try {
    await db.run(createPlayerQuery);
  } catch (e) {
    console.log(`Response Post Error: ${e.message}`);
  }
  response.send("Player Added to Team");
});

// Get PlayerWith given Id

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  //   console.log(playerId);

  const getPlayerQuery = `
    Select * 
    FROM cricket_team
    WHERE 
        player_id = ${playerId};`;

  const requiredPlayer = await db.get(getPlayerQuery);
  response.send(requiredPlayerConvert(requiredPlayer));
});

module.exports = app;
