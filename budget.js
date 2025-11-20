function showMethod() {
    var method = document.getElementById("method").value;
    var info = "";

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
    var confirmReset = confirm("Are you sure you want to reset all data?");
    
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
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
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
        var canvas = document.getElementById("chartCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Function to draw the chart
function generateChart() {
    var canvas = document.getElementById("chartCanvas");
    var ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Collect all data for chart
    var labels = [];
    var plannedValues = [];
    var actualValues = [];

    // Get income data
    for (var i = 0; i < 4; i++) {
        var name = document.getElementById("incomeName" + i).value;
        var planned = document.getElementById("incomePlanned" + i).value;
        var actual = document.getElementById("incomeActual" + i).value;

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
    for (var i = 0; i < 10; i++) {
        var name = document.getElementById("expenseName" + i).value;
        var planned = document.getElementById("expensePlanned" + i).value;
        var actual = document.getElementById("expenseActual" + i).value;

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
    var maxValue = 0;
    for (var i = 0; i < plannedValues.length; i++) {
        if (plannedValues[i] > maxValue) {
            maxValue = plannedValues[i];
        }
        if (actualValues[i] > maxValue) {
            maxValue = actualValues[i];
        }
    }

    // Chart dimensions
    var padding = 50;
    var chartWidth = canvas.width - padding * 2;
    var chartHeight = canvas.height - 140;
    var barWidth = chartWidth / labels.length / 3;

    // Draw bars
    for (var i = 0; i < labels.length; i++) {
        var x = padding + (i * chartWidth / labels.length);
        
        // Planned bar (blue)
        var plannedHeight = (plannedValues[i] / maxValue) * chartHeight;
        ctx.fillStyle = "#2f5cb5";
        ctx.fillRect(x, 40 + chartHeight - plannedHeight, barWidth, plannedHeight);
        
        // Actual bar (green)
        var actualHeight = (actualValues[i] / maxValue) * chartHeight;
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