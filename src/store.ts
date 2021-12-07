import { writable } from 'svelte/store';
import { createRxDatabase, addPouchPlugin, getRxStoragePouch } from 'rxdb';
import * as idb from 'pouchdb-adapter-idb';

import noteSchema from './schema';

/**
 * State that persists to localStorage =========================================
 */

const storedNoteListHeight = localStorage.getItem('noteListHeight') || 100;

/**
 * RxDB ========================================================================
 */

addPouchPlugin(idb);

let dbPromise;

const _create = async () => {
  const lDB = await createRxDatabase({ name: 'nvaux', storage: getRxStoragePouch('idb'), ignoreDuplicate: true });
  await lDB.addCollections({ notes: { schema: noteSchema } });
  dbPromise = lDB;
  return lDB;
};

export const db = () => (dbPromise ? dbPromise : _create());

/**
 * Svelte Writables ============================================================
 */

export const omniMode = writable('search');
export const omniText = writable('');
export const noteList = writable([]);
export const noteListHeight = writable(storedNoteListHeight);
export const selectedNote = writable({});
export const bodyText = writable('');

omniText.subscribe((v) => {
  if (v === '') {
    omniMode.set('search');
    selectedNote.set('');
    // TODO: scroll to top of NoteList
  }
});

noteListHeight.subscribe((v) => localStorage.setItem('noteListHeight', v.toString()));
