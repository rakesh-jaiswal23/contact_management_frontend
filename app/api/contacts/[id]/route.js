import { deleteContact } from "@/lib/models/Contact"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const success = await deleteContact(id)

    if (!success) {
      return Response.json({ success: false, message: "Contact not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: "Contact deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
