
let netIncome = 0;
let totalSpending = 0;
let totalSavings = 0;
let goal = 0;
let methodChosen = "";

function updateReport() {
    const report = `
📅 Budget Summary
--------------------
Net Income: $${netIncome.toFixed(2)}
Total Spending: $${totalSpending.toFixed(2)}
Total Savings: $${totalSavings.toFixed(2)}
Goal: $${goal.toFixed(2)}
Method: ${methodChosen || "Not chosen yet"}
`;
    document.getElementById("report").innerText = report;
}

function calculateNetIncome() {
    const income = parseFloat(document.getElementById("income").value) || 0;
    const actual_expense = parseFloat(document.getElementById("actual_expense").value) || 0;
    netIncome = income - actual_expense;

    if (income === 0 && actual_expense === 0) {
        document.getElementById("netIncomeResult").innerText = "Please enter income and expenses.";
    } else {
        document.getElementById("netIncomeResult").innerText = `Your net income is $${netIncome.toFixed(2)}`;
    }
    updateReport();
}

function trackSpending() {
    const spending = parseFloat(document.getElementById("spending").value) || 0;
    totalSpending += spending;
    document.getElementById("spendingList").innerText = `Total spending so far: $${totalSpending.toFixed(2)}`;
    updateReport();
}

function trackSavings() {
    const savings = parseFloat(document.getElementById("savings").value) || 0;
    totalSavings += savings;
    document.getElementById("savingsList").innerText = `Total savings so far: $${totalSavings.toFixed(2)}`;
    updateReport();
}

function setGoal() {
    goal = parseFloat(document.getElementById("goal").value) || 0;
    document.getElementById("goalResult").innerText = `Your savings goal is $${goal.toFixed(2)}`;
    updateReport();
}

function makePlan() {
    if (netIncome <= 0) {
        document.getElementById("planResult").innerText = "Please calculate your net income first.";
        return;
    }
    const message = `Your budget plan:\nSave $${goal.toFixed(2)} from your net income of $${netIncome.toFixed(2)}.`;
    document.getElementById("planResult").innerText = message;
    updateReport();
}

function showMethod() {
    const method = document.getElementById("method").value;
    let info = "";
    if (method === "50/30/20") {
        info = "The 50/30/20 Rule: 50% needs, 30% wants, 20% savings.";
    } else if (method === "Envelope") {
        info = "Envelope Method: Assign cash to categories (e.g., groceries, gas) and stop spending when it’s gone.";
    } else if (method === "Zero-Based") {
        info = "Zero-Based Budget: Every dollar is assigned a purpose — income minus actual_expense equals zero.";
    } else {
        info = "Please choose a budgeting method.";
    }
    document.getElementById("methodInfo").innerText = info;
    methodChosen = method;
    updateReport();
}

function updateBudget() {
    const result = `Updated Budget Summary:
Net Income: $${netIncome.toFixed(2)}
Total Spending: $${totalSpending.toFixed(2)}
Total Savings: $${totalSavings.toFixed(2)}
Goal: $${goal.toFixed(2)}`;
    document.getElementById("result").innerText = result;
    updateReport();
}

function resetBudget() {
    netIncome = 0;
    totalSpending = 0;
    totalSavings = 0;
    goal = 0;
    methodChosen = "";
    document.querySelectorAll("input").forEach(input => input.value = "");
    document.getElementById("netIncomeResult").innerText = "";
    document.getElementById("spendingList").innerText = "";
    document.getElementById("savingsList").innerText = "";
    document.getElementById("goalResult").innerText = "";
    document.getElementById("planResult").innerText = "";
    document.getElementById("methodInfo").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("report").innerText = "No data yet. Start by entering your income and actual_expense!";
}

// ---------- Chart helper for categories (B: planned vs actual_expense per category) ----------

function getCategoryInputs() {
  const labels = [];
  const planned = [];
  const actual_expense_ex = [];
  for (let i = 0; i < 10; i++) {
    const name = (document.getElementById(`catName${i}`)?.value || "").trim();
    const p = parseFloat(document.getElementById(`planned${i}`)?.value) || 0;
    const a = parseFloat(document.getElementById(`actual_expense${i}`)?.value) || 0;

    // skip rows that have no name and zero values (clean)
    if (name === "" && p === 0 && a === 0) continue;

    // if no name given but amounts exist, generate a fallback
    labels.push(name === "" ? `Category ${labels.length + 1}` : name);
    planned.push(p);
    actual_expense.push(a);
  }
  return { labels, planned, actual_expense };
}

function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
  drawCategoriesChart draws side-by-side bars for each category:
  - planned bars (left, color A)
  - actual_expense bars (right, color B)
*/
function drawCategoriesChart() {
  const { labels, planned, actual_expense } = getCategoryInputs();

  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // handle no data
  if (labels.length === 0) {
    // clear and show a message
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    ctx.scale(dpr, dpr);
    clearCanvas(canvas, ctx);
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText("No category data to display. Fill some rows and click Draw Chart.", canvas.clientWidth / 2, canvas.clientHeight / 2);
    return;
  }

  // size canvas for crisp drawing
  const dpr = window.devicePixelRatio || 1;
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  canvas.width = Math.floor(cw * dpr);
  canvas.height = Math.floor(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset transform and scale for dpr

  clearCanvas(canvas, ctx);

  // layout
  const padding = 40;              // left & right padding
  const topPad = 20;
  const bottomPad = 60;            // space for category labels rotated
  const chartWidth = cw - padding * 2;
  const chartHeight = ch - topPad - bottomPad;

  // compute max value for scale
  const allValues = planned.concat(actual_expense);
  const maxVal = Math.max(1, ...allValues); // ensure at least 1

  // bars
  const numCats = labels.length;
  const groupWidth = chartWidth / numCats;      // width available per category
  const barGap = 8;                             // gap between planned and actual_expense within group
  const singleBarWidth = Math.max(8, (groupWidth - 12) / 2 - barGap); // width of each bar

  // draw y-axis grid lines and ticks
  ctx.strokeStyle = "#e6e6e6";
  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";

  const numTicks = 5;
  for (let t = 0; t <= numTicks; t++) {
    const y = topPad + (chartHeight * t) / numTicks;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();

    const tickValue = Math.round(maxVal * (1 - t / numTicks));
    ctx.fillStyle = "#666";
    ctx.fillText(tickValue.toString(), padding - 6, y + 4);
  }

  // draw bars
  for (let i = 0; i < numCats; i++) {
    const groupX = padding + i * groupWidth;
    const centerX = groupX + groupWidth / 2;

    // compute heights
    const plannedHeight = (planned[i] / maxVal) * chartHeight;
    const actual_expenseHeight = (actual_expense[i] / maxVal) * chartHeight;

    // left bar (planned)
    const plannedX = centerX - singleBarWidth - barGap / 2;
    const plannedY = topPad + (chartHeight - plannedHeight);
    ctx.fillStyle = "#2f5cb5"; // planned color
    ctx.fillRect(plannedX, plannedY, singleBarWidth, plannedHeight);

    // right bar (actual_expense)
    const actual_expenseX = centerX + barGap / 2;
    const actual_expenseY = topPad + (chartHeight - actual_expenseHeight);
    ctx.fillStyle = "#2aa84f"; // actual_expense color
    ctx.fillRect(actual_expenseX, actual_expenseY, singleBarWidth, actual_expenseHeight);

    // category labels (rotated)
    ctx.save();
    ctx.translate(centerX, topPad + chartHeight + 8);
    ctx.rotate(-Math.PI / 4); // rotate label
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    const labelText = labels[i].length > 18 ? labels[i].slice(0, 15) + "…" : labels[i];
    ctx.fillText(labelText, 0, 0);
    ctx.restore();

    // numeric values above bars (optional)
    ctx.fillStyle = "#000";
    ctx.font = "11px Arial";
    // planned value
    ctx.textAlign = "center";
    ctx.fillText(planned[i].toFixed(0), plannedX + singleBarWidth / 2, plannedY - 6);
    // actual_expense value
    ctx.fillText(actual_expense[i].toFixed(0), actual_expenseX + singleBarWidth / 2, actual_expenseY - 6);
  }

  // draw x,y axis lines
  ctx.strokeStyle = "#999";
  ctx.beginPath();
  ctx.moveTo(padding, topPad);
  ctx.lineTo(padding, topPad + chartHeight);
  ctx.lineTo(padding + chartWidth, topPad + chartHeight);
  ctx.stroke();

  // draw title inside canvas (optional)
  ctx.fillStyle = "#222";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Planned vs actual_expense by Category", padding, 14);
}

// Optionally call this automatically whenever you call updateBudget()
// If you have updateBudget function, append this call at end of updateBudget():
// drawCategoriesChart();

// For safety: if updateBudget already exists, monkey-patch it to also attempt chart draw
if (typeof updateBudget === "function") {
  const originalUpdateBudget = updateBudget;
  updateBudget = function () {
    originalUpdateBudget();
    // attempt to draw chart after budget updates (fail silently if no canvas)
    try { drawCategoriesChart(); } catch (e) { /* ignore */ }
  };
}
