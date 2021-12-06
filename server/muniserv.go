package main

import (
    // "fmt"
    "strconv"
    "net/http"
    "github.com/gin-gonic/gin"
    "fiscal.funde.org/cemif/muni"
)

func ListDepartments(c *gin.Context) {
    deps := make(muni.Departments, 14)
    deps.List()
    c.IndentedJSON(http.StatusOK, deps)
}

func ListMunicipalities(c *gin.Context) {
    dept := c.DefaultQuery("department", "")
    muns := make(muni.Municipalities, 300)
    n := muns.List(dept, 0)
    c.IndentedJSON(http.StatusOK, muns[:n])
}

func GetMunicipality(c *gin.Context) {
    id := c.Param("id")
    muni := muni.Municipality{}
    muni.Get(id)
    c.IndentedJSON(http.StatusOK, muni)
}

func ListObjects(c *gin.Context) {
    id := c.Param("id")
    // In the future, replace by DefaultQuery
    // and use the current year
    year, _ := strconv.Atoi(c.Query("year"))
    objs := make(muni.MuniObjects, 500)
    n := objs.List(id, year)
    c.IndentedJSON(http.StatusOK, objs[:n])
}

func ListAccounts(c *gin.Context) {
    id := c.Param("id")
    // In the future, replace by DefaultQuery
    // and use the current year
    year, _ := strconv.Atoi(c.Query("year"))
    accs := make(muni.MuniAccounts, 500)
    n := accs.List(id, year)
    c.IndentedJSON(http.StatusOK, accs[:n])
}
