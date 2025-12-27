
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, QuizQuestion } from "./types";

// Fixed: Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveDoubt = async (
  query: string,
  imageBase64: string | null,
  profile: UserProfile
) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are "Lucky", a friendly and brilliant AI Doubt Solver for students. 
  The student is in Class ${profile.classLevel}, studying under the ${profile.board} board. 
  Always explain concepts in ${profile.language}. 
  If the student asks about a problem, provide a clear, step-by-step solution. 
  Use formatting (like bolding and bullet points) to make the answer highly readable.`;

  const parts: any[] = [{ text: query }];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64.split(',')[1],
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction,
    }
  });

  return response.text || "Sorry, I couldn't process that query.";
};

export const generateQuiz = async (
  subject: string,
  difficulty: string,
  profile: UserProfile
): Promise<QuizQuestion[]> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Generate a 5-question multiple choice quiz for a Class ${profile.classLevel} student (${profile.board} board) in ${subject}. 
  The difficulty level is ${difficulty}. 
  Each question must have exactly 4 options.
  The output must be a valid JSON array of objects.
  Return the quiz in ${profile.language}.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 4 options"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "Index of correct option (0-3)"
            },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};
