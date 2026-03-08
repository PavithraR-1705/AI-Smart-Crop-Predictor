async function predictYield() {
    const btn = document.getElementById("predictBtn");
    const loader = document.getElementById("loader");
    const btnText = document.querySelector(".btn-text");
    const resultDiv = document.getElementById("result");

    // Dashboard-la irundhu values-ah edukkurom
    const data = {
        N: Number(document.getElementById("nitrogen").value),
        P: Number(document.getElementById("phosphorus").value),
        K: Number(document.getElementById("potassium").value),
        ph: Number(document.getElementById("ph").value),
        rainfall: Number(document.getElementById("rainfall").value)
    };

    // Validation check
    if (Object.values(data).some(v => isNaN(v) || v === 0)) {
        alert("Please fill all fields with valid numbers!");
        return;
    }

    // UI Loading state
    btn.disabled = true;
    loader.style.display = "block";
    btnText.style.opacity = "0.5";
    resultDiv.style.display = "none";

    try {
        // Backend live link inga dhaan connect aagudhu
        const response = await fetch("https://ai-smart-crop-predictor-2.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Backend response handle panrom
        const result = await response.json();

        if (response.ok) {
            // Success! Displaying the result
            resultDiv.className = "success-bg";
            resultDiv.style.background = "#dcfce7"; 
            resultDiv.style.color = "#166534";
            resultDiv.style.padding = "15px";
            resultDiv.style.borderRadius = "8px";
            resultDiv.style.marginTop = "20px";
            
            resultDiv.innerHTML = `<i class="fas fa-seedling"></i> Recommended Crop: <b>${result.prediction}</b>`;
            resultDiv.style.display = "block";
        } else {
            throw new Error(result.error || "Prediction failed");
        }

    } catch (error) {
        console.error("Error:", error);
        resultDiv.style.display = "block";
        resultDiv.style.background = "#fef2f2";
        resultDiv.style.color = "#991b1b";
        resultDiv.style.padding = "15px";
        resultDiv.style.borderRadius = "8px";
        
        // Detailed error message
        resultDiv.innerHTML = "❌ Connection error or Server warming up. Please wait 10s and try again!";
    } finally {
        btn.disabled = false;
        loader.style.display = "none";
        btnText.style.opacity = "1";
    }
}