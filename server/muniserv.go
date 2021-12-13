package main

import (
    // "fmt"
    "strconv"
    "net/http"
    "github.com/gin-gonic/gin"
    "fiscal.funde.org/cemif/muni"
)

func ListDepartments(c *gin.Context) {
    deps := muni.Departments{}
    deps.List()
    c.IndentedJSON(http.StatusOK, deps)
}

func ListMunicipalities(c *gin.Context) {
    dept := c.DefaultQuery("department", "")
    muns := muni.Municipalities{}
    muns.List(dept)
    c.IndentedJSON(http.StatusOK, muns)
}

func ListObjects(c *gin.Context) {
    id := c.Param("id")
    // In the future, replace by DefaultQuery
    // and use the current year
    year, _ := strconv.Atoi(c.Query("year"))
    objs := muni.MuniObjects{}
    objs.List(id, year)
    c.IndentedJSON(http.StatusOK, objs)
}

func ListAccounts(c *gin.Context) {
    id := c.Param("id")
    // In the future, replace by DefaultQuery
    // and use the current year
    year, _ := strconv.Atoi(c.Query("year"))
    accs := muni.MuniAccounts{}
    accs.List(id, year)
    c.IndentedJSON(http.StatusOK, accs)
}
