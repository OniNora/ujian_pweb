import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/ujian_pweb/crud-api/crud.php';

function BookRentalSystem() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    nama_peminjam: '',
    judul_buku: '',
    tanggal_meminjam: '',
    tanggal_dikembalikan: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(API_URL, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nama_peminjam: '',
      judul_buku: '',
      tanggal_meminjam: '',
      tanggal_dikembalikan: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4 px-6 pb-6 bg-black rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Peminjaman Buku</h1>
      
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="text"
          name="nama_peminjam"
          value={formData.nama_peminjam}
          onChange={handleInputChange}
          placeholder="Nama Peminjam"
          className="border p-2 mr-2 mb-2"
          required
        />
        <input
          type="text"
          name="judul_buku"
          value={formData.judul_buku}
          onChange={handleInputChange}
          placeholder="Judul Buku"
          className="border p-2 mr-2 mb-2"
          required
        />
        <input
          type="date"
          name="tanggal_meminjam"
          value={formData.tanggal_meminjam}
          onChange={handleInputChange}
          className="border p-2 mr-2 mb-2"
          required
        />
        <input
          type="date"
          name="tanggal_dikembalikan"
          value={formData.tanggal_dikembalikan}
          onChange={handleInputChange}
          className="border p-2 mr-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isEditing ? 'Update' : 'Tambah'}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded ml-2">
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            {/* <th className="border p-2">ID</th> */}
            <th className="border p-2">Nama Peminjam</th>
            <th className="border p-2">Judul Buku</th>
            <th className="border p-2">Tanggal Meminjam</th>
            <th className="border p-2">Tanggal Dikembalikan</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              {/* <td className="border p-2">{book.id}</td> */}
              <td className="border p-2">{book.nama_peminjam}</td>
              <td className="border p-2">{book.judul_buku}</td>
              <td className="border p-2">{book.tanggal_meminjam}</td>
              <td className="border p-2">{book.tanggal_dikembalikan}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(book)} className="bg-yellow-500 text-white p-1 rounded mr-2">
                  Ubah
                </button>
                <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white p-1 rounded">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookRentalSystem;