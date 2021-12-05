require("dotenv").config();
const express = require("express");
const database = require("./database");
const booky = express();
var bodyParser = require("body-parser");

const BookModel = require("./database/book.js")
const AuthorModel = require("./database/author.js")
const PublicationModel = require("./database/publication.js")
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());
booky.use(express.json());
const mongoose = require("mongoose");
mongoose.connect(
    process.env.MONGO_URL
).then(()=>console.log("connection is established"));
 /*
    Route - /
    Description - GET ALL BOOKS
    Access - public
    Parameter - NONE
    Methods - get
 */

booky.get("/",async (req,res) =>{
    const getAllBooks = await BookModel.find();
    res.json(getAllBooks);
});

 /*
    Route - /
    Description - GET SPECIFIC BOOK BASED ON ISBN
    Access - public
    Parameter - ISBN
    Methods - get
 */

booky.get("/id/:isbn",async (req,res)=>{
    const getSpecificBook = await BookModel.find({ISBN:req.params.isbn});

    if(getSpecificBook.length === 0){
        return res.json({
            error : `No book with isbn of ${req.params.isbn}`
        })
    }
    return res.json({book : getSpecificBook});
});

/*
    Route - /c
    Description - GET SPECIFIC BOOK BASED ON CATEGORY
    Access - public
    Parameter - category
    Methods - get
 */

booky.get("/c/:category",async (req,res) =>{
    const getSpecificBook = await BookModel.find({category:req.params.category})
    
    if(getSpecificBook.length === 0){
        return res.json({
            error : `No book found for category for  ${req.params.category}`
        })
    }
    return res.json({book : getSpecificBook});
})

/*
    Route - /l
    Description - GET SPECIFIC BOOK BASED ON LANGUAGE
    Access - public
    Parameter - language
    Methods - get
 */
booky.get("/l/:lang",async (req,res)=>{
    const getSpecificBook = await BookModel.find({language:req.params.lang})

    if(getSpecificBook.length === 0){
        return res.json({
            error : `No book with language ${req.params.lang}`
        })
    }
    return res.json({book : getSpecificBook});
});
 /*
    Route - /author
    Description - GET ALL AUTHORS
    Access - public
    Parameter - NONE
    Methods - get
 */

booky.get("/author",async (req,res) =>{
    const getAllAuthors = await AuthorModel.find();
    res.json(getAllAuthors);
});

/*
    Route - /author
    Description - TO GET SPECIFIC AUTHOR
    Access - public
    Parameter - id
    Methods - get
 */

booky.get("/author/:authid",async (req,res) => {
    const getSpecificAuthor = await  AuthorModel.find({id:req.params.authid});
    if(getSpecificAuthor.length === 0){
        return res.json({
            error : `No author with id ${req.params.authid}`
        })
    }
    return res.json({authors : getSpecificAuthor});
    
});

/*
    Route - /author/book/
    Description - to get a list of authors based on books
    Access - public
    Parameter - ISBN
    Methods - get
 */

booky.get("/author/book/:ISBN",async (req,res) =>{
    const getSpecificAuthor = await AuthorModel.find({books:req.params.ISBN})
    if(getSpecificAuthor.length===0){
        return res.json({
            error : `No author has written book with  id ${req.params.ISBN}`
        });
    }
    return res.json({authors : getSpecificAuthor});
});

/*
    Route - /publication
    Description - to get all the publication
    Access - public
    Parameter - ISBN
    Methods - get
 */
booky.get("/publications", async (req,res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
});

/*
    Route - /publication
    Description - to get specific publication
    Access - public
    Parameter - id
    Methods - get
 */
booky.get("/publications/:id",async (req,res) => {
    const getSpecificPublication = await PublicationModel.find({id:req.params.id})
    
    if(getSpecificPublication.length === 0){
        return res.json({
            error : `No publication with id ${req.params.id}`
        })
    }
    return res.json({publications : getSpecificPublication});
    
});

/*
    Route - /publication/book
    Description - to get specific publication based on book
    Access - public
    Parameter - ISBN
    Methods - get
 */
booky.get("/publications/book/:ISBN",async (req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({books:req.params.ISBN})

    if(getSpecificPublication.length===0){
        return res.json({
            error : `No publication with  id ${req.params.ISBN}`
        });
    }
    return res.json({publications : getSpecificPublication});
});

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new",async (req,res)=>{
    const newBook = req.body;
    const AddNewBook = BookModel.create(newBook);
    return res.json({books:AddNewBook,"message":"Added new book"});
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req,res)=> {
    const newAuthor = req.body;
    const AddNewAuthor = AuthorModel.create(newAuthor);
    return res.json({updatedAuthors: AddNewAuthor,"message":"new author added!"});
});

/*
Route           /publication/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publications/new", (req,res)=> {
  const newPublication = req.body;
  const AddNewPublication = PublicationModel.create(newPublication);
  return res.json({updatedPublications: AddNewPublication,"message":"new publication added"});
});

/*
Route           /book/update/:isbn
Description     update title of the book
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/book/update/:ISBN",async (req,res) =>{
    const UpdatedBook = await BookModel.findOneAndUpdate(
        {ISBN:req.params.ISBN},
        {title:req.body.bookTitle},
        {new:true}
    );
    return res.json({books: database.books});
})

/*
Route           /publication/update/book
Description     update the publication and the book 
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publications/book/update/:ISBN",async(req,res)=>{
    //update book db
    const UpdateBook = await BookModel.findOneAndUpdate(
        {ISBN:req.params.ISBN},
        {publications:req.body.pubId},
        {new:true}
    );

    //update publications db
    const UpdatePublication =await PublicationModel.findOneAndUpdate(
        {id:req.body.pubId},
        {
            $push : {
                books:req.params.ISBN
            }
        },
        {new:true}
    );


    res.json({
        books: UpdateBook,
        publications: UpdatePublication,
        message: "Successfully updated!"
    })
});

/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn",async(req,res)=>{
    const updatedBookList = await BookModel.findOneAndDelete ({ISBN:req.params.isbn})
    return res.json({books:updatedBookList});
});
    
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/:isbn/:authorId",async(req,res) =>{
    //UPDATE BOOK DB
    const updatedBookList = await BookModel.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {
            $pull:{
                author:parseInt(req.params.authorId)
            }
        },
        {new:true}
    );

    //UPDATE AUTHOR DB
    const updatedAuthorsList = await AuthorModel.findOneAndUpdate(
        {id:req.params.authorId},
        {
            $pull:{
                books:req.params.isbn
            }
        },
        {new:true}
    );
    res.json({
        books:updatedBookList,
        author:updatedAuthorsList,
        message : "deleted successfully"
    })
})
booky.listen(3000,() => console.log("Server is up and running"));
