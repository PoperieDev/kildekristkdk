"use client";

import { useState } from "react";

export default function SearchForm({ url, setUrl, onSearch }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div>
      <p className="mb-2">Indtast kilde</p>
      <form
        onSubmit={handleFormSubmit}
        className="input w-full pr-0 z-10 shadow-xl"
      >
        <span className="label">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="https://"
        />
        <button type="submit" className="btn btn-neutral">
          Undersøg
        </button>
      </form>
    </div>
  );
}
