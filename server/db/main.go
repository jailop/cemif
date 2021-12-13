package db

import (
    "log"
    "fmt"
    "os"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func Open() (*sql.DB, error) {
    user := os.Getenv("DB_USER")
    pass := os.Getenv("DB_PASS")
    dbname := os.Getenv("DB_NAME")
    url := fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s", user, pass, dbname)
    db, err := sql.Open("mysql", url)
    if err != nil {
        log.Fatal(err)
    }
    return db, err;
}
