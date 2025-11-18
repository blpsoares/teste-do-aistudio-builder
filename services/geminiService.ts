
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const breakDownTask = async (taskDescription: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY for Gemini is not configured.");
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Quebre a seguinte tarefa em uma lista de subtarefas pequenas e acionáveis. Responda APENAS com o JSON. Tarefa: "${taskDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: 'Uma única subtarefa acionável.',
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const subTasks = JSON.parse(jsonString);
    
    if (Array.isArray(subTasks) && subTasks.every(item => typeof item === 'string')) {
        return subTasks;
    } else {
        throw new Error("A resposta da IA não está no formato de array de strings esperado.");
    }
  } catch (error) {
    console.error("Error breaking down task with Gemini:", error);
    throw new Error("Não foi possível quebrar a tarefa. Tente novamente.");
  }
};
