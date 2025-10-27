const http = require("http")
const fs = require("fs")
const express = require('express')
const Requests = require('./requests')
const library = new Requests('database')
const file_path = 'database';
const requests = new Requests(file_path);


const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', async (req, res) => {
    const books = await library.get_books()
    const processedBooks = books === undefined ? null : books
    
    console.log(processedBooks)
    
    res.render('main_page', { books: processedBooks})
})

app.get('/add_book', (req,res) => {
    res.render('add_book')
})

app.post('/add_book', (req,res) => {
    const book = req.body
    console.log(book)
    library.add_book(title=book['title'], author=book['author'], year=book['year'])
    res.redirect('/')
})

app.get('/user/:username/:id', (req, res) => {
    res.render('user')
})

app.listen(3000, () => {console.log('Server running')})



function add_book(){

}





function start_chercker(){
    (async () => {
        try {

            if (await requests.is_table_exists()){throw new Error("Already have table");}
            await requests.create_table();

            await requests.add_user('John Doe', 'john.doe@example.com', 'password123');

            const users = await requests.get_users();
            console.log(users);
        } catch (e) {
            console.error(e);
        }
    })();
}

function openAddBook(){

}





