'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import NoteModal from '@/components/NoteModal/NoteModal';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const trimmedSearch = debouncedSearch.trim();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', page, trimmedSearch],
    queryFn: () => fetchNotes(trimmedSearch, page),
    placeholderData: keepPreviousData,
    enabled: true,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox 
          value = {search} 
          onChange={(value: string) => {
            setSearch(value); 
            setPage(1);
            }} 
        />

        {!!data?.totalPages && data.totalPages > 1 && (
          <Pagination
            page={page}
            pageCount={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes.</p>}
      
      {Array.isArray(data?.notes) && data.notes.length > 0 && (
        <NoteList notes={data.notes} />)
      }

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
