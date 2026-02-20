// Dynamically imported strictly inside the function to avoid WebGL native build errors in Next.js

// Define the shape of our training data
interface SalesData {
    productId: string;
    name: string;
    history: number[]; // Array of daily sales quantities
}

export interface RestockRecommendation {
    productId: string;
    name: string;
    predictedNextWeekSales: number;
    confidence: number;
    message: string;
}

/**
 * Trains a simple LSTM Neural Network using brain.js on the fly
 * to predict the next 7 days of sales based on a 30-day history window.
 */
export async function generateRestockRecommendations(salesHistories: SalesData[]): Promise<RestockRecommendation[]> {
    const recommendations: RestockRecommendation[] = [];

    for (const product of salesHistories) {
        // We need at least some data to make a reasonable prediction
        if (!product.history || product.history.length < 14) continue;

        // Normalize data (brain.js works best with values between 0 and 1)
        const maxSales = Math.max(...product.history, 1);
        const normalizedHistory = product.history.map(qty => qty / maxSales);

        // Prepare training set for a recurrent neural network (LSTM)
        // We'll train it to predict the next day based on the previous 5 days
        const trainingData = [];
        const windowSize = 5;

        for (let i = 0; i < normalizedHistory.length - windowSize; i++) {
            trainingData.push({
                input: normalizedHistory.slice(i, i + windowSize),
                output: [normalizedHistory[i + windowSize]]
            });
        }

        // Lazy load brain.js to bypass static compilation issues with webgl.node
        const brain = await import('brain.js');

        // Initialize RNN with smaller hidden layers for speed (since this runs per request or cron)
        const net = new brain.recurrent.LSTMTimeStep({
            hiddenLayers: [10, 10]
        });

        // Train the network
        net.train(trainingData, {
            iterations: 100, // Keep low for real-time demo. In prod: higher or pre-trained.
            errorThresh: 0.05,
            log: false
        });

        // Predict the next 7 days
        let currentInput = normalizedHistory.slice(-windowSize);
        let predictedTotalNextWeekRaw = 0;

        for (let day = 0; day < 7; day++) {
            // Run prediction
            const rawPrediction = net.run(currentInput) as number;
            // Ensure non-negative
            const predQty = Math.max(0, rawPrediction);
            predictedTotalNextWeekRaw += predQty;

            // Slide window forward
            currentInput.shift();
            currentInput.push(predQty);
        }

        // Denormalize
        const predictedNextWeekSales = Math.round(predictedTotalNextWeekRaw * maxSales);

        // Simple confidence metric (inversely proportional to standard error approximation, simplified)
        const recentAvg = product.history.slice(-7).reduce((a, b) => a + b, 0) / 7;
        const historicAvg = product.history.reduce((a, b) => a + b, 0) / product.history.length;
        // 0 to 1 confidence based on how erratic the data is
        const stability = Math.min(1, Math.max(0, 1 - Math.abs(recentAvg - historicAvg) / (historicAvg || 1)));
        const confidence = Math.round(stability * 100);

        // Only recommend if there's significant projected sales
        if (predictedNextWeekSales > 0) {
            recommendations.push({
                productId: product.productId,
                name: product.name,
                predictedNextWeekSales,
                confidence,
                message: `Sistem AI kami memprediksi ${product.name} akan terjual ~${predictedNextWeekSales} pcs dalam 7 hari ke depan. Disarankan untuk memastikan stok aman.`
            });
        }
    }

    // Sort by highest priority / predicted volume
    return recommendations.sort((a, b) => b.predictedNextWeekSales - a.predictedNextWeekSales);
}
