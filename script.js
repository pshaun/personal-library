const addBookBtn = document.querySelector('.addBookBtn');
const confirmBookBtn = document.querySelector('#confirmBookBtn');
const createBookForm = document.querySelector('.createBookForm');
const span = document.getElementsByClassName("close")[0];

let myLibrary = [];

// Used for debugging purposes
// localStorage.clear(); 

//Load library if local storage is not empty, otherwise initialize it with a few example books
if(!localStorage.length){
    const book1 = {
        title: 'To Kill A Mockingbird',
        author: 'Harper Lee',
        pages: '324',
        hasRead: true
    }
    const book2 = {
        title: 'Animal Farm',
        author: 'George Orwell',
        pages: '141',
        hasRead: true
    }
    const book3 = {
        title: 'Of Mice and Men',
        author: 'John Steinbeck',
        pages: '103',
        hasRead: true
    }
    addBookToLibrary(book1);
    addBookToLibrary(book2);
    addBookToLibrary(book3);
} else {
    loadLibrary();
}

function Book({title, author, pages, hasRead}){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
}

//Toggles the value of hasRead boolean
Book.prototype.toggleRead = function(){
    this.hasRead = !this.hasRead;
}

//Add book to library by pushing it into myLibrary array
function addBookToLibrary(book){
    myLibrary.push(book);
    storeLibrary();
}

//Store the current myLibrary array into local storage
function storeLibrary(){
    localStorage.setItem('library', JSON.stringify(myLibrary));
    loadLibrary();
}

//Load the current JSON array from local storage and create new myLibrary array
function loadLibrary(){
    if(!localStorage.length){
        return;
    } else{
        const storedLibrary = JSON.parse(localStorage.getItem('library'));
        myLibrary = storedLibrary.map(book => new Book(book));
        render(myLibrary);
    }
    
}

//Clear all book within bookshelf div by removing child nodes
function clearBookshelf(bookshelf){
    while(bookshelf.hasChildNodes()){
        bookshelf.removeChild(bookshelf.lastChild);
    }
}

//Renders bookshelf by first clearing the shelf and then generating a new book card for each book in myLibrary array
function render(library){
    const bookshelf = document.querySelector('.bookshelf');
    clearBookshelf(bookshelf);

    library.forEach(function(book,index){
        const bookCard = createBookCard(book, index);
        bookshelf.append(bookCard);
    });
}

//Generate book card with title, author, pages, and button elements
function createBookCard(book, index){
    const bookCard = document.createElement('div');
    const removeBookBtn = document.createElement('button');
    const title = document.createElement('div');
    const author = document.createElement('div');
    const pages = document.createElement('div');
    const readBtn = document.createElement('button');

    removeBookBtn.setAttribute('type','button');
    removeBookBtn.classList.add('removeBookBtn');
    removeBookBtn.addEventListener('click', removeBookButton);

    readBtn.setAttribute('type', 'button');
    readBtn.addEventListener('click', toggleReadBtn);
    readBtn.classList.add('readBtn');
    if(book.hasRead){
        readBtn.classList.add('readBtn');
        readBtn.textContent = "Completed";
    } else{
        readBtn.classList.add('notReadBtn');
        readBtn.textContent ="Not Read";
    }
    
    title.textContent = book.title;
    title.classList.add('title');

    author.textContent = book.author;
    author.classList.add('author');

    pages.textContent = book.pages + " Pages";
    pages.classList.add('pages');
    

    bookCard.setAttribute('data-index', index);
    bookCard.append(removeBookBtn,title,author,pages,readBtn);
    bookCard.classList.add('book');

    return bookCard;
}

//Removes book from shelf if 'X' button is clicked and stores array into local storage
function removeBookButton(event){
    const index = event.target.parentNode.getAttribute('data-index');
    myLibrary = myLibrary.filter((book, i) => i !== +index);
    storeLibrary();
    
}

//Toggles the "Complete/Not Read" button
function toggleReadBtn(event){
    const index = event.target.parentNode.getAttribute('data-index');
    myLibrary[index].toggleRead();
    console.log("toggleBtn");
    storeLibrary();
}

addBookBtn.addEventListener('click',() =>{
    createBookForm.style.display = "block";

});


span.onclick = function() {
    createBookForm.style.display = "none";

  }

confirmBookBtn.addEventListener('click', () =>{
    createBookForm.style.display = "none";
    const title = document.getElementById("ftitle").value;
    const author = document.getElementById("fauthor").value;
    const pages = document.getElementById("fpages").value;
    const hasRead = false;
    const newBook = new Book({title, author, pages, hasRead});
    addBookToLibrary(newBook);

});