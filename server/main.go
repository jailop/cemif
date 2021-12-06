package main

import (
    // "fmt"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/gzip"
    "github.com/gin-contrib/static"
    "mime"
)

func run() {
    mime.AddExtensionType(".js", "text/javascript")
    // gin.SetMode("debug")
    router := gin.Default()
    router.SetTrustedProxies([]string{"127.0.0.1", "192.168.1.106"})
    router.Use(gzip.Gzip(gzip.DefaultCompression))
    v2 := router.Group("/api/v2")
    {
        v2.GET("/departments", ListDepartments)
        v2.GET("/municipalities", ListMunicipalities)
        v2.GET("/municipalities/:id", GetMunicipality)
        v2.GET("/municipalities/:id/objects", ListObjects)
        v2.GET("/municipalities/:id/accounts", ListAccounts)
    }
    router.Use(static.Serve("/", static.LocalFile("../client", false)))
    router.StaticFile("/favicon.ico", "../client/favicon.ico")
    router.Run()
}

func main() {
    run()
}