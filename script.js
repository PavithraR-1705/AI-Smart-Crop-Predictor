async function predictYield() {
    const btn = document.getElementById('predictBtn');
    const loader = document.getElementById('loader');
    const btnText = document.querySelector('.btn-text');
    const resultDiv = document.getElementById('result');

    // Dashboard-la irunthu inputs-ah edukkurom
    const data = {
        N: parseFloat(document.getElementById('nitrogen').value),
        P: parseFloat(document.getElementById('phosphorus').value),
        K: parseFloat(document.getElementById('potassium').value),
        ph: parseFloat(document.getElementById('ph').value),
        rainfall: parseFloat(document.getElementById('rainfall').value)
    };

    // Input values check pandrom
    if (Object.values(data).some(val => isNaN(val))) {
        alert("Please fill all fields with valid numbers!");
        return;
    }

    // UI Loading start
    btn.disabled = true;
    loader.style.display = 'block';
    btnText.style.opacity = '0.5';
    resultDiv.style.display = 'none';

    try {
        // Localhost path-ah mathi unga Render live link-ah kuduthurukaen
		// script.js la fetch line-ah ippadi maathunga
		const response = await fetch('https://ai-smart-crop-predictor-2.onrender.com/predict', {
		    method: 'POST',
		    headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(data)
		});

        const result = await response.json();

        if (response.ok) {
            // Result-ah dashboard style-la kaatrom
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
        // Free tier server sleep aagi iruntha indha message varum
        resultDiv.innerHTML = "❌ Connection Error. Wait 30s for server to wake up and try again!";
    } finally {
        // Loading-ah stop pandrom
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.style.opacity = '1';
    }
}