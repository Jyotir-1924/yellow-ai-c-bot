import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { prompts, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function buildSystemPrompt(role: string) {
  return `
You are an AI agent strictly assigned to the following role:

ROLE:
${role}

MANDATORY RULES:
- You must answer ONLY questions directly related to this role.
- If a question is unrelated, respond with:
"I can only answer questions related to my assigned role."
- Plain text only.
- No headings.
- No bullet points unless explicitly asked.
- No examples unless explicitly asked.
- No internal implementation details.
- Be precise, concise, and direct.
- Answer and stop.
`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /* -------- Params -------- */
    const { id } = await params;

    /* -------- Auth -------- */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* -------- Fetch project + role -------- */
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, id),
        eq(projects.userId, session.user.id)
      ),
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    /* -------- Request body -------- */
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    /* -------- Save user message -------- */
    await db.insert(prompts).values({
      projectId: id,
      role: "user",
      content: message,
    });

    /* -------- Fetch chat history -------- */
    const history = await db.query.prompts.findMany({
      where: eq(prompts.projectId, id),
      orderBy: (prompts, { asc }) => [asc(prompts.createdAt)],
    });

    /* -------- Build role-locked system prompt -------- */
    const systemPrompt = buildSystemPrompt(project.role);

    /* -------- Prepare Gemini contents -------- */
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...history.map((p) => ({
        role: p.role === "user" ? "user" : "model",
        parts: [{ text: p.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    /* -------- Call Gemini -------- */
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    const assistantMessage = response.text;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    /* -------- Save assistant response -------- */
    await db.insert(prompts).values({
      projectId: id,
      role: "assistant",
      content: assistantMessage,
    });

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
