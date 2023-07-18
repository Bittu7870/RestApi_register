import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected successfully');
});

// select query 
connection.query('SELECT * FROM user', (err, result) =>{
    if(err){
        console.log(err) 
    }
    console.log(result)
    
})

// Insert query
function insertUserData(user){
    return new Promise((resolve,reject) =>{
        const sqlQuery = 'INSERT INTO user (name,email,password) VALUE (?,?,?)';
        const { name, email, password } = user;
        connection.query(sqlQuery, [ name, email, password], (err, result)=>{
            if(err){
                reject(err);
                return
            }
            resolve(result)
        })
    })
}

// validation query
function getUserData(email){
    return new Promise((resolve, reject) =>{
        const sqlQuery = 'SELECT * FROM user WHERE email = ?'
        connection.query(sqlQuery, [email], (err, result) =>{
            if(err){
                reject(err)
                return
            }
            console.log(resolve(result))
            resolve(result)
        })
    })
}
export default {connection, getUserData, insertUserData}