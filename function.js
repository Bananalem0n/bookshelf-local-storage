function submitForm() {
  // Get form values
  const title = document.getElementById("titleInput").value;
  const author = document.getElementById("authorInput").value;
  const year = parseInt(document.getElementById("yearInput").value);
  const isComplete = document.getElementById("isCompleteCheckbox").checked;

  // Create a new book object
  const id = new Date().getTime();
  const book = { id, title, author, year, isComplete };

  // Save to local storage
  saveToLocalStorage(book);

  // Reset the form
  document.getElementById("bookForm").reset();
  // Refresh the display
  displayBooks();
}

function saveToLocalStorage(book) {
  // Check if local storage is supported
  if (typeof Storage !== "undefined") {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  } else {
    alert("Local storage is not supported in this browser");
  }
}

function displayBooks() {
  // Check if local storage is supported
  if (typeof Storage !== "undefined") {
    // Get books from local storage
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // Separate books into not completed and completed
    const notCompletedBooks = books.filter((book) => !book.isComplete);
    const completedBooks = books.filter((book) => book.isComplete);

    // Display not completed books
    displayBookSection(
      notCompletedBooks,
      "notCompletedSection",
      "Not Completed"
    );

    // Display completed books
    displayBookSection(completedBooks, "completedSection", "Completed");
  } else {
    alert("Local storage is not supported in this browser");
  }
}

function displayBookSection(books, sectionId, sectionTitle) {
  const sectionContainer = document.getElementById(sectionId);
  sectionContainer.innerHTML = ""; // Clear existing content

  // Display books in the specified section
  books.forEach((book) => {
    const bookHtml = `
      <div class="box">
        <article>
          <div class="media-content">
            <div class="content">
              <p>
                <small class="book-id">${book.id}</small>
                <br>
                <strong class="book-title">${book.title}</strong>
                <br />
                <small class="book-meta">
                  <span>${book.author} - ${book.year}</span>
                  <span class="is-pulled-right">
                    <button class="button is-primary is-small" onclick="toggleCompleteStatus(${
                      book.id
                    })">
                      ${
                        book.isComplete
                          ? "Mark as Incomplete"
                          : "Mark as Complete"
                      }
                    </button>
                    <button class="button is-danger is-small" onclick="deleteBook(${
                      book.id
                    })">Delete</button>
                  </span>
                </small>
                <br />
              </p>
            </div>
          </div>
        </article>
      </div>
    `;
    sectionContainer.innerHTML += bookHtml;
  });
}

function deleteBook(bookId) {
  // Show a confirmation dialog
  const isConfirmed = confirm("Are you sure you want to delete this book?");

  if (isConfirmed) {
    // Get books from local storage
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Filter out the book to be deleted
    books = books.filter((book) => book.id !== bookId);

    // Save updated books to local storage
    localStorage.setItem("books", JSON.stringify(books));

    // Refresh the display
    displayBooks();
  }
}

function toggleCompleteStatus(bookId) {
  // Get books from local storage
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Find the index of the book to toggle status
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    // Toggle the completion status
    books[bookIndex].isComplete = !books[bookIndex].isComplete;

    // Save updated books to local storage
    localStorage.setItem("books", JSON.stringify(books));

    // Refresh the display
    displayBooks();
  } else {
    alert("Book not found for toggling completion status.");
  }
}

function searchBooks() {
  // Get search term from the input field
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  // Check if local storage is supported
  if (typeof Storage !== "undefined") {
    // Get books from local storage
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // Filter books based on the search term
    const filteredBooks = books.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(searchTerm);
      const authorMatch = book.author.toLowerCase().includes(searchTerm);
      return titleMatch || authorMatch;
    });

    // Separate filtered books into completed and not completed
    const completedBooks = filteredBooks.filter((book) => book.isComplete);
    const notCompletedBooks = filteredBooks.filter((book) => !book.isComplete);

    // Display the filtered books in their respective sections
    displayBookSection(
      notCompletedBooks,
      "notCompletedSection",
      "Not Completed"
    );
    displayBookSection(completedBooks, "completedSection", "Completed");
  } else {
    alert("Local storage is not supported in this browser");
  }
}

// Initial display when the page loads
displayBooks();
