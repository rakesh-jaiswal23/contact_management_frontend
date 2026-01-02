import { createContact, getContacts, validateContact } from "@/lib/models/Contact"

export async function POST(request) {
  try {
    const body = await request.json()

    const errors = await validateContact(body)
    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          success: false,
          errors,
          message: "Validation failed",
        },
        { status: 400 },
      )
    }

    const contact = await createContact({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      message: body.message?.trim() || "",
    })

    return Response.json(
      {
        success: true,
        contact,
        message: "Contact created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating contact:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "newest"

    const contacts = await getContacts(sortBy)

    return Response.json({
      success: true,
      contacts,
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
