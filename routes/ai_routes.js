import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/diet-plan", async (req, res) => {
  try {
    const { formData, results } = req.body;

    if (!formData || !results) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const prompt = `
You are a professional nutritionist.

Create a DAILY DIET PLAN and INSIGHTS.

User:
Age: ${formData.age}
Gender: ${formData.gender}
Height: ${formData.height} cm
Weight: ${formData.weight} kg
Activity: ${formData.activity}
Goal: ${formData.goal}
Diet Preference: ${formData.diet}

Calories/day: ${results.calories}
Protein: ${results.macros.protein}g
Carbs: ${results.macros.carbs}g
Fats: ${results.macros.fats}g

RULES (VERY IMPORTANT):
1. Do NOT use markdown.
2. Do NOT use symbols like ** or *.
3. Use simple English.
4. No medical diagnosis.
5. Prefer Indian foods.
6. Follow the exact format.

FORMAT:

DIET_PLAN:
Breakfast:
Lunch:
Dinner:
Snack:

INSIGHTS:
- Point 1
- Point 2
- Point 3
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    res.json({
      text: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({ error: "Groq AI failed" });
  }
});

export default router;
