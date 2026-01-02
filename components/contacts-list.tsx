"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function ContactsList({ refreshTrigger }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/contacts?sortBy=${sortBy}`);
      const data = await response.json();

      if (data?.success && Array.isArray(data?.data)) {
        setContacts(data?.data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [sortBy, refreshTrigger]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== id));
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Submitted Contacts
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-foreground">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && contacts.length === 0 && (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No contacts yet. Submit the form to add one.
          </p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-input">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-input">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-input">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-foreground break-all">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {contact.message || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(contact._id)}
                        disabled={deletingId === contact._id}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Delete contact"
                      >
                        {deletingId === contact._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="border border-input rounded-lg p-4 bg-card"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">
                        {contact.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      className="ml-2 p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete contact"
                    >
                      {deletingId === contact._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Phone: {contact.phone}
                  </p>
                  {contact.message && (
                    <p className="text-sm text-foreground bg-muted p-2 rounded">
                      {contact.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
