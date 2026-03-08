async function predictYield() {

    const btn = document.getElementById("predictBtn");
    const loader = document.getElementById("loader");
    const btnText = document.querySelector(".btn-text");
    const resultDiv = document.getElementById("result");

    const data = {
        N: Number(document.getElementById("nitrogen").value),
        P: Number(document.getElementById("phosphorus").value),
        K: Number(document.getElementById("potassium").value),
        ph: Number(document.getElementById("ph").value),
        rainfall: Number(document.getElementById("rainfall").value)
    };

    // Validation
    if (Object.values(data).some(v => isNaN(v))) {
        alert("Please fill all fields with valid numbers!");
        return;
    }

    // Loading UI
    btn.disabled = true;
    loader.style.display = "block";
    btnText.style.opacity = "0.5";
    resultDiv.style.display = "none";

    try {

        const response = await fetch("https://ai-smart-crop-predictor-2.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // sometimes backend json illa text varum
        const text = await response.text();
        const result = JSON.parse(text);

        if (response.ok) {

            resultDiv.className = "success-bg";
            resultDiv.innerHTML =
                `<i class="fas fa-seedling"></i> Recommended Crop: <b>${result.prediction}</b>`;

            resultDiv.style.display = "block";

        } else {
            throw new Error(result.error || "Prediction failed");
        }

    } catch (error) {

        console.error("Error:", error);

        resultDiv.style.display = "block";
        resultDiv.style.background = "#fef2f2";
        resultDiv.style.color = "#991b1b";

        resultDiv.innerHTML =
            "❌ Server sleeping or connection error. Please try again.";

    } finally {

        btn.disabled = false;
        loader.style.display = "none";
        btnText.style.opacity = "1";

    }
}