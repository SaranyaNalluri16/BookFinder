import { useState } from "react";
import BookCard from "./components/BookCard";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!title && !author && !year) return;

    setLoading(true);
    setError("");
    setBooks([]);

    let query = "";
    if (title) query += `title=${encodeURIComponent(title)}&`;
    if (author) query += `author=${encodeURIComponent(author)}&`;
    if (year) query += `publish_year=${encodeURIComponent(year)}&`;

    try {
      const res = await fetch(`https://openlibrary.org/search.json?${query}`);
      const data = await res.json();
      if (data.docs.length === 0) setError("No books found.");
      setBooks(data.docs.slice(0, 20));
    } catch (err) {
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchBooks();
  };

  return (
    <div className="min-h-screen bg-blue-50 p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Book Finder</h1>

      {/* Search fields */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="p-2 border rounded-md w-72 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Search by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onKeyPress={handleKeyPress}
          className="p-2 border rounded-md w-72 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Published year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          onKeyPress={handleKeyPress}
          className="p-2 border rounded-md w-40 focus:outline-none"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Book results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </div>
  );
}

export default App;
