const fs = require('fs');
const sql = require('sqlite3').verbose();




class Requests{

	constructor(table_path){
		this.table_path = table_path;
		this.db = new sql.Database(`./${this.table_path}.db`);

		// this.is_table_exists(table_path);
	}

	is_table_exists() {
		fs.access(`./${table_path}.db`, fs.constants.F_OK, (err) => {
			create_table(table_path);});}


	create_table() {
		const schema = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS books (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			year INTEGER,
			text TEXT,
			average_rating REAL DEFAULT 0.0,
			uploader_id INTEGER,
			upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (uploader_id) REFERENCES users (id)
		);

		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			book_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			comment_text TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS ratings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			book_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			rating INTEGER CHECK(rating >= 1 AND rating <= 5),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
			UNIQUE(book_id, user_id)
		);
		`;
		return new Promise((resolve, reject) => {
			this.db.exec(schema, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}


	add_user(username, email, password_hash){
		
		return new Promise((resolve, reject) => {
			this.db.run('INSERT OR IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?);', [username, email, password_hash], (err) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				resolve();
			})
		})
	}

	add_book(title, author, year, text, uploader_id){
		this.db.run('INSERT INTO books (title, author, year, text, uploader_id) VALUES (?, ?, ?, ?, ?);', [title, author, year, text, uploader_id], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}

	add_comment(book_id, user_id, comment_text){
		this.db.run('INSERT INTO comments (book_id, user_id, comment_text) VALUES (?, ?, ?);', [book_id, user_id, comment_text], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}

	add_raiting(book_id, user_id, raiting){
		this.db.run('INSERT INTO ratings (book_id, user_id, rating) VALUES (?, ?, ?);', [book_id, user_id, raiting], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}

	delete_user(id){
		this.db.run('DELETE FROM users WHERE id = ?;', [id], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}

	delete_book(id){
		this.db.run('DELETE FROM books WHERE id = ?;', [id], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}
	delete_comment(id){
		this.db.run('DELETE FROM comments WHERE id = ?;', [id], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}
	delete_raiting(id){
		this.db.run('DELETE FROM ratings WHERE id = ?;', [id], (err) => {
			if (err) {
				console.error(err);
			}
		})
	}
	get_books(){
		this.db.all('SELECT * FROM books;', (err, rows) => {
			if (err) {
				console.error(err);
			}
			return rows;
		})
	}
	get_book_by_id(id){
		this.db.get('SELECT * FROM books WHERE id = ?;', [id], (err, row) => {
			if (err) {
				console.error(err);
			}
			return row;
		})
	}
	get_users(){
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM users;', (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			})
		});
	}
	get_comments_by_book_id(book_id){
		this.db.all(`SELECT c.*, u.username FROM comments c
					JOIN users u ON c.user_id = u.id
					WHERE c.book_id = ?;`, [book_id], (err, rows) => {
			if (err) {
				console.error(err);
			}
			return rows;
		})
	}
	get_raiting_by_book_id(book_id){
		this.db.all(`SELECT b.*, AVG(r.rating) as calculated_avg_rating
						FROM books b
						LEFT JOIN ratings r ON b.id = r.book_id
						WHERE b.id = ?
						GROUP BY b.id;`, [book_id], (err, rows) => {
			if (err) {
				console.error(err);
			}
			return rows;
		})

                    
	}
    
}

module.exports = Requests;