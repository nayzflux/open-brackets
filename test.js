const PLAYERS = 7;

const knownBrackets = [2, 4, 8, 16, 32, 64];

const exampleTeams = ["New Jersey Devils","New York Islanders","New York Rangers","Philadelphia Flyers","Pittsburgh Penguins","Boston Bruins","Buffalo Sabres","Montreal Canadiens","Ottawa Senators","Toronto Maple Leafs","Carolina Hurricanes","Florida Panthers","Tampa Bay Lightning","Washington Capitals","Winnipeg Jets","Chicago Blackhawks","Columbus Blue Jackets","Detroit Red Wings","Nashville Predators","St. Louis Blues","Calgary Flames","Colorado Avalanche","Edmonton Oilers","Minnesota Wild","Vancouver Canucks","Anaheim Ducks","Dallas Stars","Los Angeles Kings","Phoenix Coyotes","San Jose Sharks","Montreal Wanderers","Quebec Nordiques","Hartford Whalers"]

const main = (base) => {
    var closest = knownBrackets.find(b => b >= base);
        byes = closest - base;

    console.log(closest, byes);

    if (byes > 0) base = closest;

    var brackets = [],
        round = 1,
        baseT = base / 2,
        baseC = base / 2,
        teamMark = 0,
        nextInc = base / 2;

    for (i = 1; i <= (base - 1); i++) {
        var baseR = i / baseT,
            isBye = false;

        if (byes > 0 && (i % 2 != 0 || byes >= (baseT - i))) {
            isBye = true;
            byes--;
        }

        var last = brackets.filter(b => b.nextGame == i).map(b => ({ game: b.bracketNo, teams: b.teamnames }));

        if (round != 1) break;

        brackets.push({
            lastGames: round == 1 ? null : [last[0].game, last[1].game],
            nextGame: nextInc + i > base - 1 ? null : nextInc + i,
            teamnames: round == 1 ? [exampleTeams[teamMark], exampleTeams[teamMark + 1]] : ["round+1", "round+1"],
            bracketNo: i,
            roundNo: round,
            bye: isBye
        });

        teamMark += 2;
        if (i % 2 != 0) nextInc--;
        while (baseR >= 1) {
            round++;
            baseC /= 2;
            baseT = baseT + baseC;
            baseR = i / baseT;
        }
    }

    console.log(JSON.stringify(brackets));
}

main(PLAYERS);