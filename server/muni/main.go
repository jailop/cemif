package muni

import (
  "fmt"
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

func (muni *Municipality) Get(id string) {
    conn, _ := db.Open();
    defer conn.Close();
    sql := fmt.Sprintf("SELECT id, shp, contab, department, municipality, address, phone, email, url, km2 FROM municipalities WHERE id='%s'", id);
    res, err := conn.Query(sql)
    if err != nil {
        fmt.Println(err)
        return;
    }
    defer res.Close()
    if res.Next() {
        err := res.Scan(&muni.Id, &muni.Shp, &muni.Contab, &muni.Department, &muni.Municipality, &muni.Address, &muni.Phone, &muni.Email, &muni.Url, &muni.Km2)
        if err != nil {
            fmt.Println(err)
        }
    }
}

func (muns Municipalities) List(department string, offset int) int {
    limit := len(muns)
    conn, _ := db.Open();
    defer conn.Close()
    var depStmt string;
    if department != "" {
        depStmt = fmt.Sprintf(" WHERE department='%s' ", department)
    } else {
        depStmt = ""
    }
    sql := fmt.Sprintf("SELECT id, shp, contab, department, municipality, address, phone, email, url, km2 FROM municipalities %s ORDER BY municipality LIMIT %d OFFSET %d", depStmt, limit, offset)
    res, err := conn.Query(sql)
    if err != nil {
        fmt.Println(err)
        return 0
    }
    defer res.Close()
    var i int
    for i = 0; res.Next(); i++ {
        err := res.Scan(&muns[i].Id, &muns[i].Shp, &muns[i].Contab, &muns[i].Department, &muns[i].Municipality, &muns[i].Address, &muns[i].Phone, &muns[i].Email, &muns[i].Url, &muns[i].Km2)
        if err != nil {
            fmt.Println(err)
        }
    }
    return i
}

func (deps Departments) List() int {
    conn, _ := db.Open();
    defer conn.Close()
    stmt := `SELECT department, COUNT(municipality)
        FROM municipalities
        GROUP BY department
        ORDER BY department`
    res, err := conn.Query(stmt)
    if err != nil {
        fmt.Println(err)
    }
    defer res.Close()
    i := 0
    for ; res.Next(); i++ {
        err := res.Scan(&deps[i].Department, &deps[i].MuniNum)
        if err != nil {
            fmt.Println(err)
        }
    }
    return i
}

func (objs MuniObjects) List(municipality string, year int) int {
    conn, _ := db.Open()
    defer conn.Close()
    stmtBase := `SELECT object, name
        FROM muniobjects
        WHERE year=%d AND municipality=%s`
    stmt := fmt.Sprintf(stmtBase, year, municipality)
    res, err := conn.Query(stmt)
    if err != nil {
        fmt.Println(err)
    }
    defer res.Close()
    i := 0
    for ; res.Next(); i++ {
        if i == len(objs) {
            break
        }
        err := res.Scan(&objs[i].Object, &objs[i].Name)
        if err != nil {
            fmt.Println(err)
        }
    }
    return i
}

func (accs MuniAccounts) List(municipality string, year int) int {
    conn, _ := db.Open()
    defer conn.Close()
    stmtBase := `SELECT account, name
        FROM muniaccounts
        WHERE year=%d AND municipality=%s`
    stmt := fmt.Sprintf(stmtBase, year, municipality)
    res, err := conn.Query(stmt)
    if err != nil {
        fmt.Println(err)
    }
    defer res.Close()
    i := 0
    for ; res.Next(); i++ {
        if i == len(accs) {
            break
        }
        err := res.Scan(&accs[i].Account, &accs[i].Name)
        if err != nil {
            fmt.Println(err)
        }
    }
    return i
}
