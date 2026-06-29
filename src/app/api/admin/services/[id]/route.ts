import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseServiceUpdatePayload, updateService } from "@/lib/services";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const payload = await request.json();
    const parsed = parseServiceUpdatePayload(payload);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const service = await updateService(id, parsed.data);

    revalidatePath("/");
    revalidatePath("/activities");

    return NextResponse.json({ service });
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";

    if (code === "P2025") {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    console.error("Admin service update error:", error);
    return NextResponse.json(
      { error: "Could not save service." },
      { status: 500 }
    );
  }
}
