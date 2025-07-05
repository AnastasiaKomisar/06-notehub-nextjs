import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage() {
  const initialData = await fetchNotes('', 1, 12);
  return <NotesClient initialData={initialData} />;
}
