const { nanoid } = require('nanoid');

const books = require('./books');

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

 if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
    
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    
    const newBooks = {
      id,
      name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
  
    books.push(newBooks);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    // Bila buku berhasil dimasukkan
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

    // Server gagal memasukkan buku
    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      })
      .code(500);
    return response;
};


const getAllBooksHandler = () => {
    // Mengambil semua buku yang ada
    const response = {
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
    return response;
};


const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const book = books.find((b) => b.id === bookId);
  
    if (!book) {
      // Jika buku dengan ID yang dilampirkan tidak ditemukan
      const response = h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
    return response;
    }
  
    // Jika buku dengan ID yang dilampirkan ditemukan
    const response = h
      .response({
        status: 'success',
        data: {
        book,
        },
      })
      .code(200);
    return response;
};


const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    if (!name) {
      // Client tidak melampirkan properti name pada request body
      const response = h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
    return response;
    }
  
    if (readPage > pageCount) {
      // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
      const response = h
        .response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
      return response;
    }
  
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
  
    const index = books.findIndex((note) => note.id === bookId); // find book by id
  
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
  
      // Bila buku berhasil diperbarui
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
      return response;
    }
  
    // id yang dilampirkan oleh client tidak ditemukkan oleh server
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
    return response;
};
  

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const index = books.findIndex((note) => note.id === bookId); // find book by id
  
    if (index !== -1) {
      books.splice(index, 1);
  
      // Bila id dimiliki oleh salah satu buku
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
      return response;
    }
  
    // Bila id yang dilampirkan tidak dimiliki oleh buku manapun
    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
    return response;
};


module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
  