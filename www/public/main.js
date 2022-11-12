const TOURNOI = "636a8c9421b6b38c9f47fd7c"

const fetchTournament = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id, {
        method: "GET",
        credentials: "include"
    })).json();

    return response;
}

const fetchTeams = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id + "/teams", {
        method: "GET",
        credentials: "include"
    })).json();

    return response;
}

const fetchMatches = async (id) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + id + "/matches", {
        method: "GET",
        credentials: "include"
    })).json();

    return response;
}

const login = async (email, password) => {
    const response = await (await fetch("http://localhost:8080/api/v1/auth/login", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })).json();

    return response;
}

const deleteTeam = async (tournamentId, teamId) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + tournamentId + "/teams/" + teamId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
        credentials: 'include'
    })).json();

    return response;
}

const generateTree = async (tournamentId) => {
    const response = await (await fetch("http://localhost:8080/api/v1/tournaments/" + tournamentId + "/matches/generate-tree", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include'
    })).json();

    return response;
}

const main = async () => {
    // Chargé le nom du tournoi
    const tournament = await fetchTournament(TOURNOI);

    if (!tournament?.name) {
        // Pas connecté alors affiché page de connexion
        console.log("pas login");
        document.querySelector("#root").innerHTML = '<div class="login-form-container"><form><input class="login-form-field" id="email" type="email" placeholder="Votre adresse e-mail"></input><input class="login-form-field" type="password" id="password" placeholder="Votre mot de passe"></input><button id="submit" class="login-form-submit">SE CONNECTER</button><span id="error"></span></form></div>';
        document.querySelector("#submit").addEventListener("click", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const response = await login(email, password);

            if (!response?.logged) {
                document.querySelector("#error").innerHTML = response.message;
                return;
            }

            document.querySelector(".login-form-container").remove();

            main();
        });
        return;
    }

    const tName = document.createElement("span");
    const treeButton = document.createElement("button");
    treeButton.innerHTML = "Générer les matchs"
    treeButton.addEventListener("click", async (e) => {
        e.preventDefault();

        await generateTree(TOURNOI);

        document.querySelector("#root").innerHTML = "";

        main();
    });
    tName.textContent = "Nom du tournoi: " + tournament.name;
    document.querySelector("#root").appendChild(tName);
    document.querySelector("#root").appendChild(treeButton);

    // Chargé les équipes
    const teams = await fetchTeams(TOURNOI);
    for (const team of teams) {
        const teamO = document.createElement("div");
        teamO.className = "team";
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Supprimer";
        deleteButton.value = team._id;
        deleteButton.className = "delete-team-button";
        deleteButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const teamId = e.currentTarget.value;

            deleteTeam(TOURNOI, teamId);
        });
        const name = document.createElement("span");
        const players = document.createElement("div");
        const player1 = document.createElement("span");
        const player2 = document.createElement("span");
        teamO.appendChild(name);
        teamO.appendChild(players);
        teamO.appendChild(deleteButton);
        players.appendChild(player1);
        players.appendChild(player2);

        name.textContent = team.name;
        player1.textContent = team.players[0];
        player2.textContent = team.players[1];

        document.querySelector("#root").appendChild(teamO);
    }

    // Chargé les matches
    const matches = await fetchMatches(TOURNOI);

    console.log(matches);

    if (matches.length >= 1) {
        const roundNumber = matches[matches.length - 1].round;

        const treeContainer = document.createElement("div");
        treeContainer.className = "tree-container";

        var i = 0;
        while (i < roundNumber) {
            const roundMatches = matches.filter(m => m.round === i + 1);

            console.log(roundMatches);

            const roundContainer = document.createElement("div");
            roundContainer.className = "round-container";

            for (const match of roundMatches) {
                const matchContainer = document.createElement("div");
                matchContainer.className = "match-container";

                const matchRef = document.createElement("span");
                matchRef.className = "match-ref";

                const team1Container = document.createElement("div");
                team1Container.className = "team-container";
                const team2Container = document.createElement("div");
                team2Container.className = "team-container";

                const team1Name = document.createElement("div");
                team1Name.className = "team-name";
                const team2Name = document.createElement("div");
                team2Name.className = "team-name";

                const team1Score = document.createElement("div");
                team1Score.className = "team-score";
                const team2Score = document.createElement("div");
                team2Score.className = "team-score";

                team1Container.appendChild(team1Name);
                team1Container.appendChild(team1Score);

                team2Container.appendChild(team2Name);
                team2Container.appendChild(team2Score);

                matchContainer.appendChild(matchRef);
                matchContainer.appendChild(team1Container);
                matchContainer.appendChild(team2Container);

                matchRef.innerText = match.current + " -> " + match.next;

                if (match.teams.length == 2) {
                    team1Name.innerText = match.teams[0].name;
                    team2Name.innerText = match.teams[1].name;

                    team1Score.innerText = match.score[0] ? match.score[0] : 0;
                    team2Score.innerText = match.score[0] ? match.score[0] : 0;
                }

                if (match.teams.length == 1) {
                    team1Name.innerText = match.teams[0].name;
                    team1Score.innerText = 0;
                }

                roundContainer.append(matchContainer);
            }

            treeContainer.appendChild(roundContainer);

            i++;
        }

        document.querySelector("#root").appendChild(treeContainer);
    }
}

main();