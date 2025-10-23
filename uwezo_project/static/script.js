const API = location.origin;
const ws = new WebSocket(`ws://${location.host}/ws`);

const feed = document.getElementById("audit-feed");
const retrainBtn = document.getElementById("retrain-btn");
const simulateBtn = document.getElementById("simulate-btn");

let confChart = new Chart(document.getElementById("confChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "Confidence (%)", data: [], borderColor: "#0077b6" }] }
});
let distChart = new Chart(document.getElementById("distChart"), {
  type: "doughnut",
  data: { labels: ["Approved", "Flagged"], datasets: [{ backgroundColor: ["#1dd1a1", "#ff6b6b"], data: [0, 0] }] }
});

function addLog(message) {
  const p = document.createElement("p");
  p.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
  feed.prepend(p);
}

function updateCharts(conf, verdict) {
  confChart.data.labels.push(new Date().toLocaleTimeString());
  confChart.data.datasets[0].data.push(conf);
  confChart.update();
  const idx = verdict === "approved" ? 0 : 1;
  distChart.data.datasets[0].data[idx]++;
  distChart.update();
}

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.event === "new_prediction") {
    addLog(`Prediction: ${msg.verdict.toUpperCase()} ${Math.round(msg.confidence*100)}%`);
    updateCharts(msg.confidence * 100, msg.verdict);
  }
  if (msg.event === "manual_review") {
    addLog(`Review by ${msg.reviewer}: ${msg.msg}`);
  }
  if (msg.event === "model_update") {
    addLog(msg.msg);
  }
};

retrainBtn.onclick = async () => {
  const res = await fetch(`${API}/trigger-retrain`, { method: "POST" });
  const data = await res.json();
  addLog(data.status);
};

simulateBtn.onclick = async () => {
  const res = await fetch(`${API}/predict-sim`, { method: "POST" });
  const data = await res.json();
  addLog(`Simulated new document analyzed.`);
  updateCharts(data.confidence * 100, data.verdict);
};

document.getElementById("review-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const note = document.getElementById("manual-note").value.trim();
  if (!note) return alert("Please add a note before submitting.");
  await fetch(`${API}/review`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ reviewer: "User1", note: note })
  });
  document.getElementById("manual-note").value = "";
});
