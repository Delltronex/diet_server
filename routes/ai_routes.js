import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/diet-plan", async (req, res) => {
  try {
    const { formData, results } = req.body;

    if (!formData || !results) {
      return res.status(400).json({ error: "Missing input data" });
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

RULES:
No markdown.
No medical claims.
Use Indian foods.
Follow format exactly.

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
    console.error("Groq Error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
