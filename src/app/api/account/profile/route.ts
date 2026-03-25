import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { userName?: string };
  const userName = body.userName?.trim();

  if (!userName || userName.length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (userName.length > 40) {
    return NextResponse.json({ error: "Name must be 40 characters or fewer" }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update({ user_name: userName })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
