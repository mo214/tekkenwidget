import { useState, useEffect } from "preact/hooks";

const ranks = [
  { name: "Beginner", min: 0, max: 3999 },
  { name: "1st Dan", min: 4000, max: 7999 },
  { name: "2nd Dan", min: 8000, max: 12000 },
  { name: "Fighter", min: 12001, max: 17001 },
  { name: "Strategist", min: 17002, max: 22002 },
  { name: "Combatant", min: 22003, max: 27003 },
  { name: "Brawler", min: 27004, max: 33004 },
  { name: "Ranger", min: 33005, max: 39005 },
  { name: "Cavalry", min: 39006, max: 45006 },
  { name: "Warrior", min: 45007, max: 51007 },
  { name: "Assailant", min: 51008, max: 57008 },
  { name: "Dominator", min: 57009, max: 63009 },
  { name: "Vanquisher", min: 63010, max: 70010 },
  { name: "Destroyer", min: 70011, max: 77011 },
  { name: "Eliminator", min: 77012, max: 84012 },
  { name: "Garyu", min: 84013, max: 94013 },
  { name: "Shinryu", min: 94014, max: 104014 },
  { name: "Tenryu", min: 104015, max: 114015 },
  { name: "Mighty Ruler", min: 114016, max: 125016 },
  { name: "Flame Ruler", min: 125017, max: 136017 },
  { name: "Battle Ruler", min: 136018, max: 147018 },
  { name: "Fujin", min: 147019, max: 159019 },
  { name: "Raijin", min: 159020, max: 171020 },
  { name: "Kishin", min: 171021, max: 183021 },
  { name: "Bushin", min: 183022, max: 195022 },
  { name: "Tekken King", min: 195023, max: 208023 },
  { name: "Tekken Emperor", min: 208024, max: 222024 },
  { name: "Tekken God", min: 222025, max: 237025 },
  { name: "Tekken God Supreme", min: 237026, max: 253026 },
  { name: "God of Destruction", min: 253027, max: 308027 },
];

function getRankByPoints(rankPoints) {
  return ranks.findLast((r) => rankPoints >= r.min) ?? ranks[0];
}

async function fetchRankData() {
  try {
    const response = await fetch("/api/rank");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch rank data:", error);
    return { rankpoints: 85000 }; // Mock data on failure
  }
}

export default function TekkenRankWidget() {
  const [rankPoints, setRankPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalRankName, setGoalRankName] = useState("Tekken King");

  useEffect(() => {
    const fetchAndSetRank = async () => {
      try {
        const data = await fetchRankData();
        setRankPoints(data.rankpoints);
      } catch (err) {
        setError("Failed to load rank data");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAndSetRank();
    const interval = setInterval(fetchAndSetRank, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const rank = getRankByPoints(rankPoints);
  const targetRankObj = ranks.find((r) => r.name === goalRankName);
  const rpToGoal = targetRankObj ? targetRankObj.min - rankPoints : 0;

  const progress = (() => {
    if (!targetRankObj || !rank || rpToGoal <= 0) return 100;
    const journeyStart = rank.min;
    const journeyEnd = targetRankObj.min;
    const totalJourney = journeyEnd - journeyStart;
    if (totalJourney <= 0) return 100;
    const journeyCompleted = rankPoints - journeyStart;
    return Math.min((journeyCompleted / totalJourney) * 100, 100);
  })();

  if (loading) return <div class="tekken-widget loading">Loading...</div>;
  if (error) return <div class="tekken-widget error">{error}</div>;

  return (
    <div class="tekken-widget">
      <div class="widget-header">
        <h2>Tekken Rank Progress</h2>
      </div>
      <div class="rank-container">
        <div class="rank-box">
          <div class="rank-name">Current Rank</div>
          <div class="rank-icon">{rank.name}</div>
          <div class="rank-rp">{rankPoints.toLocaleString()} RP</div>
        </div>
        <div class="rank-box">
          <div class="rank-name">Goal</div>
          <div class="rank-icon">{goalRankName}</div>
          <div class="rank-rp">{targetRankObj?.min.toLocaleString()} RP</div>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-info">
          <span>Progress to {goalRankName}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div class="next-rank-info">
        {progress < 100 ? (
          <div>
            Need <span class="rp-count">{rpToGoal.toLocaleString()}</span> RP to
            reach {goalRankName}
          </div>
        ) : (
          <div>🎉 You've reached your goal! 🎉</div>
        )}
      </div>
      <div class="goal-selector">
        <label for="goal-select">Change goal: </label>
        <select
          id="goal-select"
          value={goalRankName}
          onChange={(e) => setGoalRankName(e.target.value)}
        >
          {ranks.map((r) => <option value={r.name} key={r.name}>{r.name}</option>)}
        </select>
      </div>
    </div>
  );
}