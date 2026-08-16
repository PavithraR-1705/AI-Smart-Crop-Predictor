// Crop requirements dataset based on agricultural research
const cropRequirements = {
    rice: {
        name: "Rice",
        nitrogen: { min: 40, max: 120, optimal: 80 },
        phosphorus: { min: 20, max: 60, optimal: 40 },
        potassium: { min: 20, max: 80, optimal: 40 },
        ph: { min: 5.5, max: 7.0, optimal: 6.5 },
        temperature: { min: 20, max: 35, optimal: 28 },
        humidity: { min: 60, max: 90, optimal: 80 },
        rainfall: { min: 100, max: 300, optimal: 200 },
        soilMoisture: { min: 60, max: 100, optimal: 80 },
        baseYield: 4.5
    },
    wheat: {
        name: "Wheat",
        nitrogen: { min: 30, max: 90, optimal: 60 },
        phosphorus: { min: 15, max: 50, optimal: 30 },
        potassium: { min: 15, max: 60, optimal: 30 },
        ph: { min: 6.0, max: 7.5, optimal: 6.8 },
        temperature: { min: 15, max: 25, optimal: 20 },
        humidity: { min: 40, max: 70, optimal: 55 },
        rainfall: { min: 40, max: 100, optimal: 60 },
        soilMoisture: { min: 40, max: 70, optimal: 55 },
        baseYield: 3.2
    },
    maize: {
        name: "Maize (Corn)",
        nitrogen: { min: 50, max: 150, optimal: 100 },
        phosphorus: { min: 20, max: 70, optimal: 45 },
        potassium: { min: 30, max: 90, optimal: 60 },
        ph: { min: 5.8, max: 7.2, optimal: 6.5 },
        temperature: { min: 18, max: 32, optimal: 25 },
        humidity: { min: 50, max: 80, optimal: 65 },
        rainfall: { min: 50, max: 150, optimal: 100 },
        soilMoisture: { min: 50, max: 80, optimal: 65 },
        baseYield: 5.5
    },
    cotton: {
        name: "Cotton",
        nitrogen: { min: 40, max: 100, optimal: 70 },
        phosphorus: { min: 15, max: 50, optimal: 30 },
        potassium: { min: 30, max: 80, optimal: 50 },
        ph: { min: 5.8, max: 8.0, optimal: 7.0 },
        temperature: { min: 21, max: 32, optimal: 27 },
        humidity: { min: 40, max: 70, optimal: 55 },
        rainfall: { min: 50, max: 120, optimal: 80 },
        soilMoisture: { min: 40, max: 70, optimal: 55 },
        baseYield: 2.0
    },
    sugarcane: {
        name: "Sugarcane",
        nitrogen: { min: 60, max: 180, optimal: 120 },
        phosphorus: { min: 25, max: 80, optimal: 50 },
        potassium: { min: 40, max: 120, optimal: 80 },
        ph: { min: 6.0, max: 8.0, optimal: 7.0 },
        temperature: { min: 20, max: 35, optimal: 28 },
        humidity: { min: 60, max: 90, optimal: 75 },
        rainfall: { min: 100, max: 250, optimal: 175 },
        soilMoisture: { min: 60, max: 90, optimal: 75 },
        baseYield: 70.0
    },
    soybean: {
        name: "Soybean",
        nitrogen: { min: 20, max: 60, optimal: 40 },
        phosphorus: { min: 15, max: 50, optimal: 30 },
        potassium: { min: 20, max: 60, optimal: 40 },
        ph: { min: 6.0, max: 7.5, optimal: 6.8 },
        temperature: { min: 20, max: 30, optimal: 25 },
        humidity: { min: 50, max: 80, optimal: 65 },
        rainfall: { min: 45, max: 120, optimal: 80 },
        soilMoisture: { min: 45, max: 75, optimal: 60 },
        baseYield: 2.8
    },
    potato: {
        name: "Potato",
        nitrogen: { min: 80, max: 200, optimal: 140 },
        phosphorus: { min: 30, max: 90, optimal: 60 },
        potassium: { min: 50, max: 150, optimal: 100 },
        ph: { min: 5.0, max: 6.5, optimal: 5.8 },
        temperature: { min: 15, max: 25, optimal: 20 },
        humidity: { min: 60, max: 85, optimal: 75 },
        rainfall: { min: 50, max: 150, optimal: 100 },
        soilMoisture: { min: 60, max: 85, optimal: 75 },
        baseYield: 20.0
    },
    tomato: {
        name: "Tomato",
        nitrogen: { min: 60, max: 150, optimal: 100 },
        phosphorus: { min: 30, max: 80, optimal: 50 },
        potassium: { min: 40, max: 120, optimal: 80 },
        ph: { min: 6.0, max: 7.0, optimal: 6.5 },
        temperature: { min: 18, max: 30, optimal: 24 },
        humidity: { min: 50, max: 80, optimal: 65 },
        rainfall: { min: 40, max: 100, optimal: 70 },
        soilMoisture: { min: 50, max: 80, optimal: 65 },
        baseYield: 50.0
    }
};

// Calculate score for a single parameter
function calculateRangeScore(value, requirement) {
    if (value === null || value === undefined || isNaN(value)) return 0;
    
    const { min, max, optimal } = requirement;
    
    // If value is outside acceptable range, score is 0
    if (value < min || value > max) return 0;
    
    // Calculate how close to optimal (linear interpolation)
    const distanceFromOptimal = Math.abs(value - optimal);
    const maxDistance = Math.max(optimal - min, max - optimal);
    
    // Score decreases as distance from optimal increases
    const score = Math.max(0, 100 - (distanceFromOptimal / maxDistance) * 100);
    return score;
}

// Calculate overall crop suitability score
function calculateCropSuitability(inputs, cropKey) {
    const crop = cropRequirements[cropKey];
    if (!crop) return 0;
    
    // Weights for different parameters (sum = 100)
    const weights = {
        nitrogen: 15,
        phosphorus: 12,
        potassium: 12,
        ph: 18,
        temperature: 15,
        humidity: 12,
        rainfall: 10,
        soilMoisture: 6
    };
    
    const scores = {
        nitrogen: calculateRangeScore(inputs.nitrogen, crop.nitrogen),
        phosphorus: calculateRangeScore(inputs.phosphorus, crop.phosphorus),
        potassium: calculateRangeScore(inputs.potassium, crop.potassium),
        ph: calculateRangeScore(inputs.ph, crop.ph),
        temperature: calculateRangeScore(inputs.temperature, crop.temperature),
        humidity: calculateRangeScore(inputs.humidity, crop.humidity),
        rainfall: calculateRangeScore(inputs.rainfall, crop.rainfall),
        soilMoisture: calculateRangeScore(inputs.soilMoisture, crop.soilMoisture)
    };
    
    // Calculate weighted average
    let totalScore = 0;
    for (const param in scores) {
        totalScore += scores[param] * (weights[param] / 100);
    }
    
    return {
        overallScore: Math.round(totalScore),
        individualScores: scores
    };
}

// Recommend best crop based on suitability
function recommendBestCrop(inputs) {
    let bestCrop = null;
    let bestScore = -1;
    let bestScores = null;
    
    for (const cropKey in cropRequirements) {
        const suitability = calculateCropSuitability(inputs, cropKey);
        
        if (suitability.overallScore > bestScore) {
            bestScore = suitability.overallScore;
            bestCrop = cropKey;
            bestScores = suitability.individualScores;
        }
    }
    
    return {
        cropKey: bestCrop,
        cropName: cropRequirements[bestCrop].name,
        score: bestScore,
        individualScores: bestScores
    };
}

// Predict yield based on crop suitability and inputs
function calculateYield(inputs, recommendation) {
    const crop = cropRequirements[recommendation.cropKey];
    const baseYield = crop.baseYield;
    
    // Calculate suitability factors (0 to 1)
    const suitabilityFactor = recommendation.score / 100;
    
    // Additional environmental factors
    const optimalTempFactor = 1 - Math.abs(inputs.temperature - crop.temperature.optimal) / 20;
    const optimalRainFactor = 1 - Math.abs(inputs.rainfall - crop.rainfall.optimal) / 150;
    const nutrientFactor = (
        calculateRangeScore(inputs.nitrogen, crop.nitrogen) +
        calculateRangeScore(inputs.phosphorus, crop.phosphorus) +
        calculateRangeScore(inputs.potassium, crop.potassium)
    ) / 300;
    
    // Combined yield factor
    const yieldFactor = (suitabilityFactor * 0.4) + (optimalTempFactor * 0.2) + 
                       (optimalRainFactor * 0.2) + (nutrientFactor * 0.2);
    
    // Calculate final yield
    const predictedYield = baseYield * yieldFactor;
    
    // Ensure yield is positive and reasonable
    const finalYield = Math.max(0.1, predictedYield);
    
    return {
        yield: finalYield.toFixed(2),
        unit: crop.name === "Sugarcane" ? "tons/hectare" : 
               crop.name === "Potato" ? "tons/hectare" : 
               crop.name === "Tomato" ? "tons/hectare" : "tons/hectare"
    };
}

// Generate analysis text
function generateAnalysis(inputs, recommendation, yieldPrediction) {
    const crop = cropRequirements[recommendation.cropKey];
    const scores = recommendation.individualScores;
    
    let analysis = `<strong>Why ${crop.name}?</strong><br>`;
    
    // Find top factors
    const factors = [
        { name: "Nitrogen", score: scores.nitrogen, value: inputs.nitrogen, optimal: crop.nitrogen.optimal },
        { name: "Phosphorus", score: scores.phosphorus, value: inputs.phosphorus, optimal: crop.phosphorus.optimal },
        { name: "Potassium", score: scores.potassium, value: inputs.potassium, optimal: crop.potassium.optimal },
        { name: "pH", score: scores.ph, value: inputs.ph, optimal: crop.ph.optimal },
        { name: "Temperature", score: scores.temperature, value: inputs.temperature, optimal: crop.temperature.optimal },
        { name: "Humidity", score: scores.humidity, value: inputs.humidity, optimal: crop.humidity.optimal },
        { name: "Rainfall", score: scores.rainfall, value: inputs.rainfall, optimal: crop.rainfall.optimal }
    ];
    
    // Sort by score (descending)
    factors.sort((a, b) => b.score - a.score);
    
    // Get top 3-4 positive factors
    const topFactors = factors.filter(f => f.score > 60).slice(0, 3);
    
    if (topFactors.length > 0) {
        analysis += `Your soil and environmental conditions show good alignment with ${crop.name} requirements, particularly in `;
        analysis += topFactors.map((f, i) => {
            if (i === 0) return f.name.toLowerCase();
            if (i === topFactors.length - 1) return ` and ${f.name.toLowerCase()}`;
            return `, ${f.name.toLowerCase()}`;
        }).join('');
        analysis += `.<br><br>`;
    } else {
        analysis += `While conditions may not be ideal, ${crop.name} is the most suitable option among available crops based on your current soil and environmental parameters.<br><br>`;
    }
    
    // Suggestions for improvement
    analysis += `<strong>Soil Condition Summary:</strong><br>`;
    analysis += `• Nitrogen: ${inputs.nitrogen} mg/kg (optimal: ${crop.nitrogen.optimal})<br>`;
    analysis += `• Phosphorus: ${inputs.phosphorus} mg/kg (optimal: ${crop.phosphorus.optimal})<br>`;
    analysis += `• Potassium: ${inputs.potassium} mg/kg (optimal: ${crop.potassium.optimal})<br>`;
    analysis += `• pH: ${inputs.ph} (optimal: ${crop.ph.optimal})<br><br>`;
    
    analysis += `<strong>Environmental Summary:</strong><br>`;
    analysis += `• Temperature: ${inputs.temperature}°C (optimal: ${crop.temperature.optimal}°C)<br>`;
    analysis += `• Humidity: ${inputs.humidity}% (optimal: ${crop.humidity.optimal}%)<br>`;
    analysis += `• Rainfall: ${inputs.rainfall}mm (optimal: ${crop.rainfall.optimal}mm)<br>`;
    analysis += `• Soil Moisture: ${inputs.soilMoisture}% (optimal: ${crop.soilMoisture.optimal}%)<br><br>`;
    
    // Improvement suggestions
    const lowFactors = factors.filter(f => f.score < 50);
    if (lowFactors.length > 0) {
        analysis += `<strong>Suggestions for Improvement:</strong><br>`;
        lowFactors.forEach(f => {
            const diff = f.value - f.optimal;
            let suggestion = "";
            if (diff > 0) {
                suggestion = `Consider reducing ${f.name.toLowerCase()} by approximately ${Math.abs(diff).toFixed(1)}`;
            } else {
                suggestion = `Consider increasing ${f.name.toLowerCase()} by approximately ${Math.abs(diff).toFixed(1)}`;
            }
            analysis += `• ${suggestion}<br>`;
        });
    }
    
    return analysis;
}

// Validate inputs
function validateInputs(inputs) {
    const errors = [];
    
    if (isNaN(inputs.nitrogen) || inputs.nitrogen < 0) {
        errors.push("Nitrogen must be a non-negative number");
    }
    if (isNaN(inputs.phosphorus) || inputs.phosphorus < 0) {
        errors.push("Phosphorus must be a non-negative number");
    }
    if (isNaN(inputs.potassium) || inputs.potassium < 0) {
        errors.push("Potassium must be a non-negative number");
    }
    if (isNaN(inputs.ph) || inputs.ph < 0 || inputs.ph > 14) {
        errors.push("pH must be between 0 and 14");
    }
    if (isNaN(inputs.temperature) || inputs.temperature < -20 || inputs.temperature > 50) {
        errors.push("Temperature must be between -20°C and 50°C");
    }
    if (isNaN(inputs.humidity) || inputs.humidity < 0 || inputs.humidity > 100) {
        errors.push("Humidity must be between 0% and 100%");
    }
    if (isNaN(inputs.rainfall) || inputs.rainfall < 0) {
        errors.push("Rainfall must be a non-negative number");
    }
    if (isNaN(inputs.soilMoisture) || inputs.soilMoisture < 0 || inputs.soilMoisture > 100) {
        errors.push("Soil moisture must be between 0% and 100%");
    }
    if (inputs.landArea !== "" && (isNaN(inputs.landArea) || inputs.landArea <= 0)) {
        errors.push("Land area must be a positive number");
    }
    
    return errors;
}

// Main prediction function
function performPrediction() {
    const btn = document.getElementById("predictBtn");
    const loader = document.getElementById("loader");
    const btnText = document.querySelector(".btn-text");
    const resultDiv = document.getElementById("result");

    // Get input values
    const inputs = {
        nitrogen: Number(document.getElementById("nitrogen").value),
        phosphorus: Number(document.getElementById("phosphorus").value),
        potassium: Number(document.getElementById("potassium").value),
        ph: Number(document.getElementById("ph").value),
        rainfall: Number(document.getElementById("rainfall").value),
        temperature: Number(document.getElementById("temperature").value),
        humidity: Number(document.getElementById("humidity").value),
        soilMoisture: Number(document.getElementById("soilMoisture").value),
        landArea: document.getElementById("landArea").value
    };

    // Validation
    const errors = validateInputs(inputs);
    if (errors.length > 0) {
        alert("Please fix the following errors:\n" + errors.join("\n"));
        return;
    }

    // UI Loading state
    btn.disabled = true;
    loader.style.display = "block";
    btnText.style.opacity = "0.5";
    resultDiv.style.display = "none";

    // Simulate processing time for better UX
    setTimeout(() => {
        try {
            // Get crop recommendation
            const recommendation = recommendBestCrop(inputs);
            
            // Predict yield
            const yieldPrediction = calculateYield(inputs, recommendation);
            
            // Generate analysis
            const analysis = generateAnalysis(inputs, recommendation, yieldPrediction);
            
            // Calculate total yield if land area is provided
            let totalYieldText = "";
            if (inputs.landArea && inputs.landArea > 0) {
                const totalYield = (parseFloat(yieldPrediction.yield) * parseFloat(inputs.landArea)).toFixed(2);
                totalYieldText = `<br><strong>Total Expected Yield:</strong> ${totalYield} tons`;
            }
            
            // Display comprehensive results
            resultDiv.className = "success-bg";
            resultDiv.style.background = "#dcfce7"; 
            resultDiv.style.color = "#166534";
            resultDiv.style.padding = "20px";
            resultDiv.style.borderRadius = "12px";
            resultDiv.style.marginTop = "20px";
            resultDiv.style.textAlign = "left";
            
            resultDiv.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <i class="fas fa-seedling" style="font-size: 2rem; color: #10b981;"></i>
                    <h2 style="margin: 10px 0; color: #0f172a;">${recommendation.cropName}</h2>
                    <div style="font-size: 1.2rem; margin: 10px 0;">
                        <strong>Suitability Score:</strong> ${recommendation.score}%
                    </div>
                    <div style="font-size: 1.5rem; margin: 15px 0; color: #10b981;">
                        <strong>Estimated Yield:</strong> ${yieldPrediction.yield} ${yieldPrediction.unit}
                        ${totalYieldText}
                    </div>
                </div>
                <div style="border-top: 1px solid #a7f3d0; padding-top: 15px; margin-top: 15px;">
                    ${analysis}
                </div>
            `;
            
            resultDiv.style.display = "block";

        } catch (error) {
            console.error("Error:", error);
            resultDiv.style.display = "block";
            resultDiv.style.background = "#fef2f2";
            resultDiv.style.color = "#991b1b";
            resultDiv.style.padding = "15px";
            resultDiv.style.borderRadius = "8px";
            resultDiv.innerHTML = "❌ Prediction failed. Please check your inputs and try again.";
        } finally {
            btn.disabled = false;
            loader.style.display = "none";
            btnText.style.opacity = "1";
        }
    }, 800); // 800ms delay for better UX
}