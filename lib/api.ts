import axios from 'axios';
import { Note, NoteTag } from '@/types/note';


const BASE_URL =  'https://notehub-public.goit.study/api/notes';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  search: string,
  page = 1,
  perPage = 12
): Promise<NotesResponse> => {
  try{
    const response = await axios.get<NotesResponse>(BASE_URL, {
      params: {
        ...(search? {search} : {}),
        page,
        perPage,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error){
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes');
  }
};

export const createNote = async (note: NewNote): Promise<Note> => {
  try{
    const response = await axios.post<Note>(BASE_URL, note, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error){
    console.error('Error creating notes:', error);
    throw new Error('Failed to create notes');
  }
};

export const deleteNote = async (id: number): Promise<Note> => {
  try{
    const response  = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      }
    });
    return response.data;
  } catch (error){
    console.error('Error deleting note with id ${id}:', error);
    throw new Error('Failed to delete note');
  }
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  try{
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes with id ${id}:', error);
    throw new Error('Failed to fetch note details');
  } 
};
