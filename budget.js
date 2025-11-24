let totalIncomePlanned = 0;
let totalIncomeActual = 0;
let totalExpensePlanned = 0;
let totalExpenseActual = 0;
let netIncomePlanned = 0;
let netIncomeActual = 0;
let goal = 0;
let methodChosen = "";

// Function to calculate the budget
function calculateBudget() {
    // Reset totals to zero
    totalIncomePlanned = 0;
    totalIncomeActual = 0;
    totalExpensePlanned = 0;
    totalExpenseActual = 0;

    // Add up all income
    for (let i = 0; i < 4; i++) {
        let planned = document.getElementById("incomePlanned" + i).value;
        let actual = document.getElementById("incomeActual" + i).value;
        
        if (planned !== "") {
            totalIncomePlanned = totalIncomePlanned + parseFloat(planned);
        }
        if (actual !== "") {
            totalIncomeActual = totalIncomeActual + parseFloat(actual);
        }
    }

    // Add up all expenses
    for (let i = 0; i < 10; i++) {
        let planned = document.getElementById("expensePlanned" + i).value;
        let actual = document.getElementById("expenseActual" + i).value;
        
        if (planned !== "") {
            totalExpensePlanned = totalExpensePlanned + parseFloat(planned);
        }
        if (actual !== "") {
            totalExpenseActual = totalExpenseActual + parseFloat(actual);
        }
    }

    // Calculate net income
    netIncomePlanned = totalIncomePlanned - totalExpensePlanned;
    netIncomeActual = totalIncomeActual - totalExpenseActual;

    // Show results
    if (totalIncomePlanned > 0 || totalIncomeActual > 0) {
        document.getElementById("incomeResult").innerText = "Total Income:\nPlanned: $" + totalIncomePlanned.toFixed(2) + "\nActual: $" + totalIncomeActual.toFixed(2);
        document.getElementById("incomeResult").style.display = "block";
    }

    if (totalExpensePlanned > 0 || totalExpenseActual > 0) {
        document.getElementById("expenseResult").innerText = "Total Expenses:\nPlanned: $" + totalExpensePlanned.toFixed(2) + "\nActual: $" + totalExpenseActual.toFixed(2);
        document.getElementById("expenseResult").style.display = "block";
    }

    updateReport();
    generateChart();
}

// Function to update the budget report
function updateReport() {
    let report = "Budget Summary\n";
    report = report + "--------------------\n";
    report = report + "INCOME:\n";
    report = report + "  Planned: $" + totalIncomePlanned.toFixed(2) + "\n";
    report = report + "  Actual:  $" + totalIncomeActual.toFixed(2) + "\n\n";
    report = report + "EXPENSES:\n";
    report = report + "  Planned: $" + totalExpensePlanned.toFixed(2) + "\n";
    report = report + "  Actual:  $" + totalExpenseActual.toFixed(2) + "\n\n";
    report = report + "NET INCOME:\n";
    report = report + "  Planned: $" + netIncomePlanned.toFixed(2) + "\n";
    report = report + "  Actual:  $" + netIncomeActual.toFixed(2) + "\n\n";
    report = report + "SAVINGS:\n";
    report = report + "  Current: $" + netIncomeActual.toFixed(2) + "\n";
    report = report + "  Goal:    $" + goal.toFixed(2) + "\n\n";
    report = report + "Method: " + methodChosen + "\n";
    report = report + "--------------------";

    document.getElementById("report").innerText = report;
}

// Function to set savings goal
function setGoal() {
    let goalInput = document.getElementById("goal").value;
    
    if (goalInput !== "") {
        goal = parseFloat(goalInput);
        document.getElementById("goalResult").innerText = "Your savings goal is $" + goal.toFixed(2);
        document.getElementById("goalResult").style.display = "block";
        updateReport();
    } else {
        document.getElementById("goalResult").innerText = "Please enter a valid goal amount.";
        document.getElementById("goalResult").style.display = "block";
    }
}

// Function to show budgeting method info
function showMethod() {
    let method = document.getElementById("method").value;
    let info = "";

    if (method === "50/30/20") {
        info = "The 50/30/20 Rule:\n50% for Needs (rent, utilities, groceries)\n30% for Wants (entertainment, dining out)\n20% for Savings and debt repayment";
        methodChosen = "50/30/20 Rule";
    } else if (method === "Envelope") {
        info = "Envelope Method:\nAssign cash to specific categories (groceries, gas, etc.). Once the envelope is empty, stop spending in that category.";
        methodChosen = "Envelope Method";
    } else if (method === "Zero-Based") {
        info = "Zero-Based Budget:\nEvery dollar has a purpose. Income minus expenses equals zero. All money is assigned before the month begins.";
        methodChosen = "Zero-Based Budget";
    } else {
        info = "Please choose a budgeting method.";
        methodChosen = "Not chosen yet";
    }

    document.getElementById("methodInfo").innerText = info;
    document.getElementById("methodInfo").style.display = "block";
    updateReport();
}

// Function to reset everything
function resetBudget() {
    let confirmReset = confirm("Are you sure you want to reset all data?");
    
    if (confirmReset) {
        // Clear all variables
        totalIncomePlanned = 0;
        totalIncomeActual = 0;
        totalExpensePlanned = 0;
        totalExpenseActual = 0;
        netIncomePlanned = 0;
        netIncomeActual = 0;
        goal = 0;
        methodChosen = "";
        
        // Clear all inputs
        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
        
        // Clear dropdown
        document.getElementById("method").value = "";
        
        // Hide result boxes
        document.getElementById("incomeResult").style.display = "none";
        document.getElementById("expenseResult").style.display = "none";
        document.getElementById("goalResult").style.display = "none";
        document.getElementById("methodInfo").style.display = "none";
        
        // Reset report
        document.getElementById("report").innerText = "No data yet. Start by entering your income and expenses!";
        
        // Clear chart
        let canvas = document.getElementById("chartCanvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Function to draw the chart
function generateChart() {
    let canvas = document.getElementById("chartCanvas");
    let ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collect all data for chart
    let labels = [];
    let plannedValues = [];
    let actualValues = [];

    // Get income data
    for (let i = 0; i < 4; i++) {
        let name = document.getElementById("incomeName" + i).value;
        let planned = document.getElementById("incomePlanned" + i).value;
        let actual = document.getElementById("incomeActual" + i).value;

        if (name !== "" || planned !== "" || actual !== "") {
            if (name === "") {
                name = "Income " + (i + 1);
            }
            labels.push(name);
            plannedValues.push(planned === "" ? 0 : parseFloat(planned));
            actualValues.push(actual === "" ? 0 : parseFloat(actual));
        }
    }

    // Get expense data
    for (let i = 0; i < 10; i++) {
        let name = document.getElementById("expenseName" + i).value;
        let planned = document.getElementById("expensePlanned" + i).value;
        let actual = document.getElementById("expenseActual" + i).value;

        if (name !== "" || planned !== "" || actual !== "") {
            if (name === "") {
                name = "Expense " + (i + 1);
            }
            labels.push(name);
            plannedValues.push(planned === "" ? 0 : parseFloat(planned));
            actualValues.push(actual === "" ? 0 : parseFloat(actual));
        }
    }

    // If no data, show message
    if (labels.length === 0) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "#999";
        ctx.textAlign = "center";
        ctx.fillText("No data to display. Enter income and expenses above.", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Find max value for scaling
    let maxValue = 0;
    for (let i = 0; i < plannedValues.length; i++) {
        if (plannedValues[i] > maxValue) {
            maxValue = plannedValues[i];
        }
        if (actualValues[i] > maxValue) {
            maxValue = actualValues[i];
        }
    }

    // Chart dimensions
    let padding = 50;
    let chartWidth = canvas.width - padding * 2;
    let chartHeight = canvas.height - 140;
    let barWidth = chartWidth / labels.length / 3;

    // Draw bars
    for (let i = 0; i < labels.length; i++) {
        let x = padding + (i * chartWidth / labels.length);
        
        // Planned bar (blue)
        let plannedHeight = (plannedValues[i] / maxValue) * chartHeight;
        ctx.fillStyle = "#2f5cb5";
        ctx.fillRect(x, 40 + chartHeight - plannedHeight, barWidth, plannedHeight);
        
        // Actual bar (green)
        let actualHeight = (actualValues[i] / maxValue) * chartHeight;
        ctx.fillStyle = "#2aa84f";
        ctx.fillRect(x + barWidth + 5, 40 + chartHeight - actualHeight, barWidth, actualHeight);
        
        // Draw label
        ctx.save();
        ctx.translate(x + barWidth, 40 + chartHeight + 10);
        ctx.rotate(-0.5);
        ctx.fillStyle = "#333";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
    }

    // Draw title
    ctx.fillStyle = "#222";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Income & Expenses: Planned vs Actual", canvas.width / 2, 20);
}