import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, count, difficulty } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert quiz creator. Generate exactly ${count} multiple choice questions about "${topic}" at ${difficulty} difficulty level.

For ${difficulty} difficulty:
- Easy: Basic concepts, straightforward questions, commonly known facts
- Medium: Requires understanding of concepts, some analysis needed
- Hard: Complex scenarios, requires deep knowledge, tricky distractors

Each question must have exactly 4 options with only one correct answer.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${count} MCQs about ${topic}.` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_mcqs",
              description: "Create multiple choice questions",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string", description: "The question text" },
                        options: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Exactly 4 answer options"
                        },
                        correctAnswer: { 
                          type: "number", 
                          description: "Index of correct answer (0-3)" 
                        },
                        explanation: { 
                          type: "string", 
                          description: "Brief explanation of why the answer is correct" 
                        }
                      },
                      required: ["question", "options", "correctAnswer", "explanation"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["questions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_mcqs" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate questions");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function.name !== "create_mcqs") {
      throw new Error("Invalid response from AI");
    }

    const mcqs: { questions: MCQ[] } = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(mcqs), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating MCQs:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
