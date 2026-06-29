import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminServices } from "@/lib/services";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const services = await getAdminServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin services fetch error:", error);
    return NextResponse.json(
      { error: "Could not load services." },
      { status: 500 }
    );
  }
}
