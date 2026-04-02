// 🔥 REPLACE THIS WITH YOUR REAL API URL
const API_URL = "https://live-api.cpx-research.com/api/get-surveys.php?app_id=32235&ext_user_id={ext_user_id}&subid_1=test&subid_2=test2&output_method=api&ip_user={ip_user}&user_agent={user_agent}&limit=12&secure_hash=YOUR_HASH";

// Generate or get user ID
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "user_" + Math.floor(Math.random() * 1000000);
  localStorage.setItem("userId", userId);
}

// Get user IP
async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// Load surveys
async function loadSurveys() {
  try {
    const ip = await getIP();

    const url = API_URL
      .replace("{ext_user_id}", userId)
      .replace("{ip_user}", ip)
      .replace("{user_agent}", navigator.userAgent);

    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("surveyList");
    container.innerHTML = "";

    if (data.count_available_surveys === 0) {
      container.innerHTML = "😢 No surveys available";
      return;
    }

    // Sort best surveys first (by conversion rate)
    data.surveys.sort((a, b) => b.conversion_rate - a.conversion_rate);

    data.surveys.forEach(s => {
      // Skip very bad surveys
      if (s.conversion_rate < 5) return;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${s.category || "General Survey"}</h3>
        <p>💰 ${s.payout} coins (~$${s.payout_publisher_usd})</p>
        <p>⏱️ ${s.loi} min</p>
        <p>🎯 ${s.conversion_rate}% success</p>
        <a class="btn" href="${s.href}" target="_blank">Start Survey</a>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    document.getElementById("surveyList").innerHTML = "⚠️ Error loading surveys";
    console.error(err);
  }
}

// Run
loadSurveys();