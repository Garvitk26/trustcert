import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Institution from "@/lib/models/Institution";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, orgName } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (role === "institution" && !orgName) {
      return NextResponse.json({ error: "Institution name is required." }, { status: 400 });
    }

    await dbConnect();

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    let institution = null;
    if (role === "institution") {
      const suffix = Math.random().toString(36).substring(2, 6);
      const slug = orgName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + suffix;
      institution = await Institution.create({
        name: orgName,
        slug,
        ownerId: newUser._id.toString(),
        members: [{
          userId: newUser._id.toString(),
          role: "owner",
          addedAt: new Date(),
        }],
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}
