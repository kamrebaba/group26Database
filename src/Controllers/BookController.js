const bookModel= require("../Models/BooksModel")
const UserModel = require("../Models/UserModel")
const moment = require('moment')
const {body,isValidObjectId,isValidISBN, validation, validDate} = require("../middleware/validation");
const BooksModel = require("../Models/BooksModel");
const { findByIdAndUpdate } = require("../Models/BooksModel");



let createBook= async function(req,res){
    
    try{
        let data= req.body
        if(!body(data)) return res.status(400).send({status:false,msg:"Input is Missing "})
        
        if(!validation(data.userId))return res.status(400).send({status:false,msg:"userId is mandatory "})
        const validUser= await UserModel.findById(data.userId)
        if(!validUser) return res.status(400).send({status:false,msg:"user not found"})
        const validBook= await bookModel.find({title:data.title,ISBN:data.ISBN})
        if(!validBook) return res.status(400).send({status:false,msg:"title and ISBN must be Unique"})
        if(!validation(data.title)) return res.status(400).send({status:false,msg:"title is mandatory"})
        if(!(data.releasedAt))  return res.status(400).send({status:false,msg:"ReleaseDate is mandatory"})
         if(!validDate(data.releasedAt))  return res.status(400).send({status:false,msg:"ReleaseDAte is not valid"})
        if(!validation(data.ISBN)) return res.status(400).send({status:false,msg:"ISBN is mandatory"})
       if(!isValidISBN(data.ISBN)) return res.status(400).send({status:false,msg:"ISBN should be of 13 digits"})
        if(!validation(data.excerpt))  return res.status(400).send({status:false,msg:"excerpt is required"})
        if(!validation(data.category))  return res.status(400).send({status:false,msg:"category is required"})
        if(!validation(data.subcategory))  return res.status(400).send({status:false,msg:"subcategory is required"})

        let savedUser= await bookModel.create(data)

        return res.status(201).send({status:true,msg:"book created successfully",data:savedUser})

    }catch(error){
        return res.status(500).send(error.message)
    }
}



const getBookById= async function(req, res){
    try{
         let bookId=req.params.bookId
 if(!bookId) return res.status(400).send({status:false, msg: "BookId is required"})
 if(!isValidObjectId(bookId))
 return res.status(400).send({status:false, msg: "BookId is notValid"})
let getData = await bookModel.findById({_id:bookId, isDeleted:false})
if (!getData) return res.status(404).send({status:false, msg: "Data not found"})

 return res.status(200).send({status:true, msg:"Data found", data:getData})

    }catch(error){
        return res.status(500).send(error.message)
    }
}

const getBooks=async (req,res)=>{
try {
    let data=req.query
    if (body(data)) {
        let getBooks = await BooksModel.find({ isDeleted: false }).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });
  
        if (getBooks.length == 0) return res.status(404).send({ status: false, message: "No books found" });
        return res.status(200).send({ status: true, count: getBooks.length, message: "Books list", data: getBooks });
      }

        if (!isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: "Enter a valid user id" });
        let { ...tempData } = data;
        delete (tempData.userId);
       
        data.isDeleted = false;

    let getFilterBooks = await BooksModel.find(data).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });

    if (getFilterBooks.length == 0) return res.status(404).send({ status: false, message: "No books found" });
    res.status(200).send({ status: true, count: getFilterBooks.length, message: "Books list", data: getFilterBooks });
  

} catch (error) {
    return res.status(500).send(error.message)
    
}

}

const UpdateBooks=async (req,res)=>{
try {
let Book=req.params.bookId

let Update=await BooksModel.findById(Book)
if(Update.isDeleted==true) return res.status(400).send({status:false,msg:"data not found"})
    
let data=req.body
if(!body(data)) return res.status(400).send({status:false,msg:"Input is Missing"})

let UniqueTitle =await BooksModel.findOne({title:data.title})
if(UniqueTitle) return res.status(400).send({status:false,msg:"title  Must me Unique"})

if(!(data.releasedAt))  return res.status(400).send({status:false,msg:"ReleaseDate is mandatory"})


if(!isValidISBN(data.ISBN)) return res.status(400).send({status:false,msg:"ISBN should be of 13 digits"})
let UniqueISBN =await BooksModel.findOne({ISBN:data.ISBN})

if(UniqueISBN) return res.status(400).send({status:false,msg:" ISBN Must me Unique"})

let Updatebook=await BooksModel.findByIdAndUpdate({_id:Book},data,{new:true})
return res.status(200).send({status:true,msg:"Updated Successfully",data:Updatebook})

} catch (error) {
    return res.status(500).send({msg:error.message})
    
}


}



const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "BookId is required" })

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, msg: "BookId is not Valid" })

        const findbook = await BooksModel.findById(bookId)

        if (findbook.isDeleted == true) return res.status(404).send({ status: false, msg: "data is already deleted" })

        let DeletedBook = await BooksModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })

        return res.status(200).send({ status: true, data: " Book Deleted successfully " })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }


};
module.exports = { createBook, getBookById, getBooks, deleteBooks,UpdateBooks }

