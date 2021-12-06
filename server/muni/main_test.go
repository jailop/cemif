package muni

import (
  "testing"
  "fmt"
)

func testListDeps(t *testing.T) {
  deps := make(Departments, 14)
  deps.List()
  fmt.Println(deps)
  if deps[0].Department != "Ahuachapán" {
    t.Error("Bad department")
  }
}

func testListMuns(t *testing.T) {
    muns:= make(Municipalities, 300)
    muns.List("", 0)
    fmt.Println(muns)
}

func testGetMuni(t *testing.T) {
    muni := Municipality{}
    muni.Get("0101")
    if muni.Municipality != "San Salvador" {
        t.Error("Get municipality: error")
    }
}
