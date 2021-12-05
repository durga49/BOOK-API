const books = [
    {
    ISBN: "12345Book",
    title: "Getting started with MERN",
    pubDate: "2021-11-25",
    language: "en",
    numPage: 250,
    author: [1,2],
    publications: [1],
    category: ["tech", "programming", "education"]
    }
];
    
const authors = [
    {
    id: 1,
    name: "Priyanka",
    books: ["12345Book","MyBook"]
    },
    {
    id: 2,
    name: "Daniel",
    books: ["12345Book"]
    }
];
    
const publication = [
    {
    id: 1,
    name: "Writex",
    books: ["12345Book"]
    },
    {
    id: 2,
    name: "Writex",
    books: ["MyBook"]
    }
];
module.exports = {books,authors,publication};