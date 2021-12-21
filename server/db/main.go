package db

import (
    "log"
    "fmt"
    "os"
    "database/sql"
    "github.com/joho/godotenv"
    _ "github.com/go-sql-driver/mysql"
)

func Open() (*sql.DB, error) {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
    user := os.Getenv("DBUSER")
    pass := os.Getenv("DBPASS")
    dbname := os.Getenv("DBNAME")
    server := os.Getenv("DBSERV")
    port := os.Getenv("DBPORT")
    url := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", user, pass, server, port, dbname)
    db, err := sql.Open("mysql", url)
    if err != nil {
        log.Fatal(err)
    }
    return db, err;
}
