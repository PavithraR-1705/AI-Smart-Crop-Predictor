async function predictYield() {
    const btn = document.getElementById('predictBtn');
    const loader = document.getElementById('loader');
    const btnText = document.querySelector('.btn-text');
    const resultDiv = document.getElementById('result');

    // Dashboard inputs
    const data = {
        N: parseFloat(document.getElementById('nitrogen').value),
        P: parseFloat(document.getElementById('phosphorus').value),
        K: parseFloat(document.getElementById('potassium').value),
        ph: parseFloat(document.getElementById('ph').value),
        rainfall: parseFloat(document.getElementById('rainfall').value)
    };

    // Validation
    if (Object.values(data).some(val => isNaN(val))) {
        alert("Please fill all fields with valid numbers!");
        return;
    }

    // UI Loading state
    btn.disabled = true;
    loader.style.display = 'block';
    btnText.style.opacity = '0.5';
    resultDiv.style.display = 'none';

    try {
        // Syntax error-ah fix panni correct URL kuduthurukaen
        const response = await fetch('https://ai-smart-crop-predictor-2.onrender.com/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Success logic
            resultDiv.className = 'success-bg';
            resultDiv.innerHTML = `<i class="fas fa-chart-line"></i> Recommended Crop: ${result.prediction}`;
            resultDiv.style.display = 'block';
        } else {
            throw new Error(result.error || "Prediction failed");
        }

    } catch (error) {
        console.error("Error:", error);
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fef2f2';
        resultDiv.style.color = '#991b1b';
        // Free tier waking up message
        resultDiv.innerHTML = "❌ Connection Error";
    } finally {
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.style.opacity = '1';
    }
}