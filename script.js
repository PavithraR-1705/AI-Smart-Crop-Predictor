async function predictYield() {
    const btn = document.getElementById('predictBtn');
    const loader = document.getElementById('loader');
    const btnText = document.querySelector('.btn-text');
    const resultDiv = document.getElementById('result');

    // Get input values
    const data = {
        nitrogen: parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium: parseFloat(document.getElementById('potassium').value),
        ph: parseFloat(document.getElementById('ph').value),
        rainfall: parseFloat(document.getElementById('rainfall').value)
    };

    // Simple Validation
    if (Object.values(data).some(val => isNaN(val))) {
        alert("Please fill all fields with valid numbers!");
        return;
    }

    // UI Feedback: Start Loading
    btn.disabled = true;
    loader.style.display = 'block';
    btnText.style.opacity = '0.5';
    resultDiv.style.display = 'none';

    try {
        const response = await fetch('http://localhost:8080/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resultText = await response.text();

        // UI Feedback: Show Result
        resultDiv.className = 'success-bg';
        resultDiv.innerHTML = `<i class="fas fa-chart-line"></i> ${resultText}`;
        resultDiv.style.display = 'block';

    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fef2f2';
        resultDiv.style.color = '#991b1b';
        resultDiv.innerHTML = "❌ Error connecting to server. Please try again.";
    } finally {
        // UI Feedback: Stop Loading
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.style.opacity = '1';
    }
}