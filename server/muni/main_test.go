package muni

import (
  "testing"
  "reflect"
  "fmt"
)

func TestListDeps(t *testing.T) {
  deps := Departments{}
  deps.List()
  if deps[0].Department != "Ahuachapán" {
    t.Error("Bad department")
  }
  if len(deps) == 0 {
      t.Error("department list is empty")
  }
}

func TestListMuns(t *testing.T) {
    muns:= Municipalities{}
    fmt.Println(reflect.TypeOf(muns))
    muns.List("")
    if len(muns) == 0 {
        t.Error("Municipalities List was not updated, zero legnth")
    }
}

func TestListObjs(t *testing.T) {
    objs := MuniObjects{}
    objs.List("8101", 2016)
    if len(objs) == 0 {
        t.Error("Objects list is empty")
    }
}

func TestListAccounts(t *testing.T) {
    accs := MuniAccounts{}
    accs.List("8101", 2016)
    if len(accs) == 0 {
        t.Error("Account list is empty")
    }
}
