const TOURNOI = "636a8c9421b6b38c9f47fd7c"

const fetchTournament = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id, {
        method: "GET",
    })).json();

    return response;
}

const fetchTeams = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id + "/teams", {
        method: "GET"
    })).json();

    return response;
}

const fetchMatches = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id + "/matches", {
        method: "GET"
    })).json();
}

const main = async () => {
    // Chargé le nom du tournoi
    const tournament = await fetchTournament(TOURNOI);
    const tName = document.createElement("span");
    tName.textContent = "Nom du tournoi: " + tournament.name;
    document.querySelector("#root").appendChild(tName);

    // Chargé les équipes
    const teams = await fetchTeams(TOURNOI);
    for (const team of teams) {
        const teamO = document.createElement("div");
        teamO.className = "team";
        const name = document.createElement("span");
        const players = document.createElement("div");
        const player1 = document.createElement("span");
        const player2 = document.createElement("span");
        teamO.appendChild(name);
        teamO.appendChild(players);
        players.appendChild(player1);
        players.appendChild(player2);
    
        name.textContent = team.name;
        player1.textContent = team.players[0];
        player2.textContent = team.players[1];
    
        document.querySelector("#root").appendChild(teamO);
    }

    // Chargé les matches
    const matches = await fetchMatches(TOURNOI);
}

main();