import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client with the provided key
const ai = new GoogleGenAI({ apiKey: 'AIzaSyD2I68Aw0ZOIMiqY7EtxGHmXKD0_4HPUFc' });

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt_data } = req.body;

        // Construct the prompt describing the visual based on user input
        let visualPrompt = `A visually stunning FIFA World Cup ${prompt_data.itemType}. `;

        if (prompt_data.country) {
            visualPrompt += `The design perfectly incorporates the national colors, flag aesthetics, and cultural motifs of ${prompt_data.country}. `;
        }

        if (prompt_data.jerseyNumber) {
            visualPrompt += `The number ${prompt_data.jerseyNumber} is prominently and stylistically featured in the composition. `;
        }

        if (prompt_data.favoritePlayer || prompt_data.name) {
            const names = [];
            if (prompt_data.favoritePlayer) names.push(prompt_data.favoritePlayer);
            if (prompt_data.name) names.push(prompt_data.name);
            visualPrompt += `The typography elegantly displays the text: "${names.join(', ')}". `;
        }

        if (prompt_data.quotes) {
            visualPrompt += `Includes the inspirational quote: "${prompt_data.quotes}". `;
        }

        // Add aesthetic modifiers based on item type
        if (prompt_data.itemType === 'badge') {
            visualPrompt += `The style is a metallic, highly-detailed crest, shiny enamel pin or embroidered patch. High quality, volumetric lighting, isolated on a clean background.`;
        } else if (prompt_data.itemType === 'stamp') {
            visualPrompt += `The style is a vintage or modern postage stamp, with perforated edges, exact pricing marks, ink cancelations, and beautiful miniature illustration. High resolution, macro photography feel.`;
        } else if (prompt_data.itemType === 'player_card') {
            visualPrompt += `The style is a premium holographic trading card, with stats framing, foil reflections, dramatic action poses, and dynamic borders. Collector's edition style.`;
        } else {
            visualPrompt += `The style is high-end athletic apparel or premium sporting goods memorabilia, photorealistic, dramatic studio lighting.`;
        }

        console.log("Sending prompt to Imagen 4:", visualPrompt);

        // Call the Imagen model via standard generateImages call
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: visualPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });

        const base64Image = response.generatedImages[0].image.imageBytes;

        res.json({
            status: 'success',
            image: `data:image/jpeg;base64,${base64Image}`,
            message: 'Memorabilia successfully forged.'
        });

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to generate memorabilia'
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
