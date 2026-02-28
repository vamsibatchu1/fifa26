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

        let visualPrompt = '';

        if (prompt_data.itemType === 'stamp') {
            const countryStr = prompt_data.country || 'Canada';
            const numberStr = prompt_data.jerseyNumber || '15';

            const lines = [];
            if (prompt_data.name) lines.push(prompt_data.name);
            if (prompt_data.favoritePlayer) lines.push(prompt_data.favoritePlayer);
            if (prompt_data.quotes) lines.push(prompt_data.quotes);

            let textDesc = '"Geography" on the first line and "Géographie" on the second line, both';
            if (lines.length === 1) {
                textDesc = `"${lines[0]}"`;
            } else if (lines.length === 2) {
                textDesc = `"${lines[0]}" on the first line and "${lines[1]}" on the second line`;
            } else if (lines.length === 3) {
                textDesc = `"${lines[0]}" on the first line, "${lines[1]}" on the second line, and "${lines[2]}" on the third line`;
            }

            visualPrompt = `A close-up photograph of a vintage, perforated-edge ${countryStr} postage stamp from 1974, set against a plain black background with no texture. The stamp features a textured, light green paper background printed with a subtle, fine-line square grid pattern. The central image is a graphic, geometric, abstract design rendered with pixelated white blocks and a solid vertical red bar, representing computer-generated data analysis.

In the upper-left corner, the word "${countryStr}" is printed in a clean, sans-serif black font. In the upper-right corner, the denomination "${numberStr}" is printed in the same black font. A bold, horizontal red line bisects the green grid area, starting from the left edge. A prominent vertical red bar is positioned on the right-hand side of the grid, perfectly intersecting the horizontal red line to form a coordinate-like axis.

To the right of the vertical red bar, there is a cluster of white, pixel-like rectangular data points, irregularly scattered but vertically oriented, resembling a computer graph or a punch card data representation. These points are concentrated near the vertical red line. In the lower-right corner, the stamp includes the text: ${textDesc}, in a clean, black sans-serif font. The stamp's edges are rough and perforated, showing fibers and the fibrous quality of the paper. The stamp has a matte finish.`;
        } else {
            visualPrompt = `A visually stunning FIFA World Cup ${prompt_data.itemType}. `;

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
            } else if (prompt_data.itemType === 'player_card') {
                visualPrompt += `The style is a premium holographic trading card, with stats framing, foil reflections, dramatic action poses, and dynamic borders. Collector's edition style.`;
            } else {
                visualPrompt += `The style is high-end athletic apparel or premium sporting goods memorabilia, photorealistic, dramatic studio lighting.`;
            }
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
