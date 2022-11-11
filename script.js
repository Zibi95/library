"use strict";

// const cors = require("cors");

// elements
const html = document.querySelector("html");
const cardList = document.querySelector(".card-list");
const addBook = document.querySelector(".add-book");
const modalAddBook = document.querySelector(".add-book--modal");

// form
const inputTitle = document.querySelector("#title");
const inputAuthor = document.querySelector("#author");
const inputPages = document.querySelector("#pages");
const inputStatus = document.querySelector("#read-status");
const submitButton = document.querySelector(".button");
let library;

init();
// Event listeners

// DELETING AND EDITING BUTTON LISTENER
cardList.addEventListener("click", function (e) {
  const index = e.target.closest(".card")?.dataset.id;
  if (e.target.closest(".remove")) {
    e.target.closest(".card").remove();

    library.splice(index, 1);
    saveLocalStorage();
  }

  if (modalAddBook.classList.value.includes("active")) {
    closeModal();
  }
  if (e.target.closest(".edit")) {
    // setting a values that are alredy in library
    inputTitle.value = library[index].title;
    inputAuthor.value = library[index].author;
    inputPages.value = library[index].pages;
    inputStatus.value = library[index].status;

    inputTitle.focus();
    openModal();
    submitButton.dataset.id = `${index}`;
    submitButton.classList.add("edit");
    submitButton.classList.remove("submit");
    submitButton.textContent = "EDIT";
  }
});

//ADD BOOK BUTTON EVENT LISTENER
addBook.addEventListener("click", function (e) {
  submitButton.classList.remove("edit");
  submitButton.classList.add("submit");
  submitButton.textContent = "ADD";
  openModal();
  inputTitle.focus();
  clearInputs();
});

html.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
    clearInputs();
  }
});

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (submitButton.classList.value === "button submit") {
    addBookToLibrary(
      inputTitle.value,
      inputAuthor.value,
      inputPages.value,
      inputStatus.value
    );
    closeModal();
    clearInputs();
  }
  if (submitButton.classList.value === "button edit") {
    const index = e.target.dataset.id;

    library.splice(index, 1);
    library.splice(
      index,
      0,
      new Book(
        inputTitle.value,
        inputAuthor.value,
        inputPages.value,
        inputStatus.value
      )
    );
    displayCards();
    saveLocalStorage();
    closeModal();
  }
});

// CONSTRUCTOR
function Book(title, author, pages, status) {
  {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.date = `${new Date().getDate()}.${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}`;
  }
}
// FUNCTIONS

// PUSH NEW BOOK TO LIBRARY ARRAY
function addBookToLibrary(title, author, pages, status) {
  if (title === "" || author === "" || pages === "") return;

  library.push(new Book(title, author, pages, status));
  saveLocalStorage();
  displayCards();
}

// REMOVING ALL THE CARDS, AND ADDING THEM AGAIN
function displayCards() {
  cardList.innerHTML = "";
  library.forEach((book, i) => {
    const card = `<div class="card ${book.status}" data-id="${i}">
      <h2 class="title">${book.title}</h2>
      <hr>
      <p class="author">Author: ${book.author}</p>
      <p class="pages">Pages: ${book.pages}</p>
  
      
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="book-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
  
      <div class="bottom-card">
        <div class="buttons">
          <button class="edit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button class="remove">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
        </div>
        <p class="date">${book.date}</p>
      </div>
    </div>`;

    cardList.insertAdjacentHTML("beforeend", card);
  });
}

// SAVE TO LOCAL STORAGE
function saveLocalStorage() {
  localStorage.setItem("library", JSON.stringify(library));
}

function clearInputs() {
  inputTitle.value = "";
  inputAuthor.value = "";
  inputPages.value = "";
}

function closeModal() {
  modalAddBook.classList.remove("active");
  cardList.style.filter = "";
}

function openModal() {
  modalAddBook.classList.add("active");
  cardList.style.filter = "blur(3px)";
}

// Getting book from local storage if its not empty
function init() {
  if (localStorage.getItem("library") === null) {
    library = new Array();
  } else {
    library = JSON.parse(localStorage.getItem("library"));
    displayCards();
  }
}
