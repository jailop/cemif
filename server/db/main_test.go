package db

import (
  "testing"
  // "fiscal.funde.org/cemif/db"
)

func testOpen(t *testing.T) {
  conn, _ := Open()
  conn.Close()
}
