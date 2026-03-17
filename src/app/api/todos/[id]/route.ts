import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "../../../../lib/database";
import { Todo } from "../../../../entities/Todo";

type RouteParams = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);
    const todo = await repo.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);
    const todo = await repo.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, completed } = body;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description ? description.trim() : null;
    }

    if (completed !== undefined) {
      todo.completed = Boolean(completed);
    }

    const updated = await repo.save(todo);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);
    const todo = await repo.findOneBy({ id });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await repo.remove(todo);
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
