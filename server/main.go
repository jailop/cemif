package main

import (
    // "fmt"
    // `"log"
    "mime"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/gzip"
    "github.com/gin-contrib/static"
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
        v2.GET("/municipalities/:id/objects", ListObjects)
        v2.GET("/municipalities/:id/accounts", ListAccounts)
    }
    router.Use(static.Serve("/", static.LocalFile("../client", false)))
    router.Use(static.Serve("/res", static.LocalFile("../res", false)))
    router.Use(static.Serve("/notebooks", 
        static.LocalFile("../notebooks", false)))
    router.StaticFile("/favicon.ico", "../res/favicon.ico")
    router.Run()
}

func main() {
    run()
}
