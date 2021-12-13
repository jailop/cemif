package muni

import (
  "fmt"
  "log"
  "fiscal.funde.org/cemif/db"
)

type Department struct {
    Department string `json:"department"`
    MuniNum int       `json:"muni_num"`
}

type Departments []Department

type Municipality struct {
    Id string           `json:"id"`
    Shp int             `json:"shp"`
    Contab int          `json:"contab"`
    Department string   `json:"department"`
    Municipality string `json:"municipality"`
    Address string      `json:"address"`
    Phone string        `json:"phone"`
    Email string        `json:"email"`
    Url string          `json:"url"`
    Km2 float32         `json:"km2"`
}

type Municipalities []Municipality

type MuniObject struct {
    Object string       `json:"object"`
    Name string         `json:"name"`
}

type MuniAccount struct {
    Account string       `json:"account"`
    Name string         `json:"name"`
}

type MuniObjects []MuniObject
type MuniAccounts []MuniAccount

func (muns *Municipalities) List(department string) {
    conn, err := db.Open()
    if err != nil {
        log.Println("Error openning the database")
        return
    }
    defer conn.Close()
    // Preparing SQL statement
    var depStmt string;
    if department != "" {
        depStmt = fmt.Sprintf(" WHERE department='%s' ", department)
    } else {
        depStmt = ""
    }
    sql := fmt.Sprintf(`
        SELECT id, shp, contab, department, municipality,
               address, phone, email, url, km2
        FROM municipalities %s
        ORDER BY municipality`, depStmt)
    // Querying the DB
    res, err := conn.Query(sql)
    if err != nil {
        log.Println(err)
        return
    }
    defer res.Close()
    for ; res.Next(); {
        aux := Municipality{}
        err := res.Scan(&aux.Id, &aux.Shp, &aux.Contab, &aux.Department,
            &aux.Municipality, &aux.Address, &aux.Phone, &aux.Email,
            &aux.Url, &aux.Km2)
        if err != nil {
            log.Println(err)
            continue
        }
        *muns = append(*muns, aux)
    }
}

func (deps *Departments) List() {
    conn, err := db.Open();
    if err != nil {
        log.Println("Error openning the database")
        return
    }
    defer conn.Close()
    stmt := `SELECT department, COUNT(municipality)
        FROM municipalities
        GROUP BY department
        ORDER BY department`
    res, err := conn.Query(stmt)
    if err != nil {
        log.Println(err)
        return
    }
    defer res.Close()
    for ; res.Next(); {
        aux := Department{}
        err := res.Scan(&aux.Department, &aux.MuniNum)
        if err != nil {
            log.Println(err)
            continue
        }
        *deps = append(*deps, aux)
    }
}

func (objs *MuniObjects) List(municipality string, year int) {
    conn, err := db.Open()
    if err != nil {
        log.Println("Error openning the database")
        return
    }
    defer conn.Close()
    stmtBase := `SELECT object, name
        FROM muniobjects
        WHERE year=%d AND municipality=%s`
    // fmt.Println(stmt)
    stmt := fmt.Sprintf(stmtBase, year, municipality)
    res, err := conn.Query(stmt)
    if err != nil {
        log.Println(err)
        return
    }
    defer res.Close()
    for ; res.Next(); {
        aux := MuniObject{}
        err := res.Scan(&aux.Object, &aux.Name)
        if err != nil {
            log.Println(err)
            continue
        }
        *objs = append(*objs, aux)
    }
}

func (accs *MuniAccounts) List(municipality string, year int) {
    conn, err := db.Open()
    if err != nil {
        log.Println("Error openning the database")
        return
    }
    defer conn.Close()
    stmtBase := `SELECT account, name
        FROM muniaccounts
        WHERE year=%d AND municipality=%s`
    stmt := fmt.Sprintf(stmtBase, year, municipality)
    res, err := conn.Query(stmt)
    if err != nil {
        log.Println(err)
        return
    }
    defer res.Close()
    for ; res.Next(); {
        aux := MuniAccount{}
        err := res.Scan(&aux.Account, &aux.Name)
        if err != nil {
            log.Println(err)
            continue
        }
        *accs = append(*accs, aux)
    }
}
