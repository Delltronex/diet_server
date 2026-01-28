import dotenv from "dotenv";
dotenv.config(); // 👈 MUST be here

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // ✅ now available
});

router.post("/diet-plan", async (req, res) => {
  try {
    const { formData, results } = req.body;

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
2. Do NOT use **, *, bullets with symbols, or headings with formatting.
3. Use simple, clear English.
4. No medical diagnosis or medical claims.
5. Prefer Indian-friendly foods when possible.
6. Keep quantities realistic and easy to understand.
7. Output must follow the EXACT format below.
8. Do NOT add extra sections or explanations outside the format.

FORMAT (FOLLOW EXACTLY):

DIET_PLAN:
Breakfast:
Lunch:
Dinner:
Snack:

INSIGHTS:
- Point 1
- Point 2
- Point 3

CONTENT GUIDELINES:
- Diet plan should match the calorie and macro targets approximately.
- Use foods commonly available in India (rice, roti, dal, vegetables, fruits, nuts, curd, paneer, eggs if allowed).
- Insights should be practical lifestyle tips (hydration, consistency, balance).
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    res.json({
      text: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Groq AI failed" });
  }
});

export default router;
