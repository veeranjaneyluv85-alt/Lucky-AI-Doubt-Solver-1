
import { GoogleGenAI, Type } from "@google/genai";
import { ClassLevel, Difficulty, QuizQuestion, GroundingChunk } from "../types";

export interface AskLuckyResponse {
  text: string;
  grounding?: GroundingChunk[];
}

export const askLucky = async (query: string, classLevel: ClassLevel, imageBase64?: string): Promise<AskLuckyResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: query }];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are Lucky, a friendly, encouraging robot educational assistant. 
        You help students in ${classLevel}. 
        
        Syllabus Guidelines:
        - For B.Tech ECE, strictly focus on: EG (Engineering Graphics), MATHEMATICS, PHYSICS, CHEMISTRY, and GRAPHICS alongside core electronics.
        
        RESPONSE STRUCTURE:
        1. FIRST, provide a clear, step-by-step text explanation answering the student's doubt. If an image is provided, analyze it thoroughly to solve the problem shown.
        2. SECOND, use your search tool to find a relevant YouTube tutorial for this topic.
        
        RULES:
        - Use formatting (bullet points, bold text) for readability.
        - Be encouraging but academically precise.
        - If the question is non-educational, gently guide them back to their studies.
        - You MUST use the googleSearch tool to find educational resources.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "Lucky is momentarily confused. Could you rephrase your question?",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Unable to reach Lucky's brain. Check your connection!");
  }
};

export const generateQuiz = async (classLevel: ClassLevel, difficulty: Difficulty, subject: string): Promise<QuizQuestion[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate exactly 5 multiple-choice questions for a student in ${classLevel} with a ${difficulty} difficulty level for the subject: ${subject}.
    Include accurate options, one correct index, and a helpful explanation.
    Ensure questions are highly relevant to common syllabi for this grade.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
                minItems: 4,
                maxItems: 4
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid response format");
    return parsed;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw error;
  }
};
