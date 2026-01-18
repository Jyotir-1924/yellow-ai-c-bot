import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectFiles, projects } from "@/lib/db/schema";
import { openai } from "@/lib/openai";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await db.query.projectFiles.findMany({
    where: eq(projectFiles.projectId, id),
  });

  return NextResponse.json(files);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, id),
      eq(projects.userId, session.user.id)
    ),
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const uploaded = await openai.files.create({
    file,
    purpose: "assistants",
  });

  await db.insert(projectFiles).values({
    projectId: id,
    openaiFileId: uploaded.id,
    filename: file.name,
    purpose: uploaded.purpose,
  });

  return NextResponse.json({
    id: uploaded.id,
    filename: file.name,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileId } = await req.json();

  if (!fileId) {
    return NextResponse.json(
      { error: "fileId is required" },
      { status: 400 }
    );
  }
  const file = await db.query.projectFiles.findFirst({
    where: and(
      eq(projectFiles.id, fileId),
      eq(projectFiles.projectId, projectId)
    ),
  });

  if (!file) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
  await openai.files.delete(file.openaiFileId);
  await db
    .delete(projectFiles)
    .where(eq(projectFiles.id, fileId));

  return NextResponse.json({ success: true });
}

