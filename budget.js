
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
    const expenses = parseFloat(document.getElementById("expenses").value) || 0;
    netIncome = income - expenses;

    if (income === 0 && expenses === 0) {
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
        info = "Zero-Based Budget: Every dollar is assigned a purpose — income minus expenses equals zero.";
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
    document.getElementById("report").innerText = "No data yet. Start by entering your income and expenses!";
}
