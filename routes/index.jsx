
import "../TekkenRankWidget.css"; // Import the separate CSS file

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

function getRank(rankPoints) {
  return (
    ranks.find((rank) => rankPoints >= rank.min && rankPoints <= rank.max) ||
    ranks[0]
  );
}

function calculateProgress(currentRP, targetRankName) {
  const currentRank = getRank(currentRP);
  const targetRank = ranks.find((r) => r.name === targetRankName);

  if (!targetRank) {
    return 0; // Return 0 if target rank is not found
  }

  // If already at or past the target rank, progress is 100%
  if (currentRP >= targetRank.min) {
    return 100;
  }

  const currentRankIndex = ranks.indexOf(currentRank);
  const targetRankIndex = ranks.indexOf(targetRank);

  // If goal is a lower rank (shouldn't happen with the selector, but for safety)
  if (targetRankIndex < currentRankIndex) {
    return 100;
  }

  // Calculate progress within the relevant range
  const totalRPRange = targetRank.min - currentRank.min;
  const progressInPoints = currentRP - currentRank.min;

  if (totalRPRange <= 0) {
    return 0; // Avoid division by zero
  }

  const progress = (progressInPoints / totalRPRange) * 100;
  return Math.min(progress, 100);
}

// Function to fetch rank data from your server
async function fetchRankData() {
  try {
    const response = await unfetch("/api/rank"); // Use unfetch for universal fetching
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch rank data:", error);
    // Return mock data for demo purposes if API fails
    return { rankpoints: 85000 };
  }
}

export default function TekkenRankWidget() {
  const [rankPoints, setRankPoints] = useState(0);
  const [rank, setRank] = useState(ranks[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalRank, setGoalRank] = useState("Tekken King");

  useEffect(() => {
    async function fetchRank() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRankData();
        setRankPoints(data.rankpoints);
        const foundRank = getRank(data.rankpoints);
        if (foundRank) setRank(foundRank);
      } catch (err) {
        setError("Failed to load rank data");
        console.error("Error fetching rank:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRank();
    const interval = setInterval(fetchRank, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const progress = calculateProgress(rankPoints, goalRank);
  const targetRankObj = ranks.find((r) => r.name === goalRank);

  const rpToGoal = targetRankObj?.min ? targetRankObj.min - rankPoints : null;

  if (loading) {
    return (
      <div class="tekken-widget">
        <div class="loading">Loading rank data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="tekken-widget">
        <div class="error">{error}</div>
      </div>
    );
  }

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
          <div class="rank-icon">{goalRank}</div>
          <div class="rank-rp">
            {targetRankObj
              ? targetRankObj.min.toLocaleString() + " RP"
              : "N/A"}
          </div>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-info">
          <span>Progress to {goalRank}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div class="next-rank-info">
        {progress < 100 ? (
          <div>
            Need{" "}
            <span class="rp-count">{rpToGoal?.toLocaleString() || "N/A"}</span>{" "}
            RP to reach {goalRank}
          </div>
        ) : (
          <div>🎉 You've reached your goal! 🎉</div>
        )}
      </div>

      <div class="goal-selector">
        <label for="goal-select">Change goal: </label>
        <select
          id="goal-select"
          value={goalRank}
          // @ts-ignore
          onChange={(e) => setGoalRank(e.target.value)}
        >
          {ranks.map((rank) => (
            <option value={rank.name} key={rank.name}>
              {rank.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}