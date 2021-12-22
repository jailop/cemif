package main

import (
    // "fmt"
    "os"
    "log"
    "mime"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/gzip"
    "github.com/gin-contrib/static"
    "github.com/joho/godotenv"
    "github.com/gin-gonic/autotls"
)

func run() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
    hostname := os.Getenv("HOSTNAME")
    runmode := os.Getenv("RUNMODE")
    mime.AddExtensionType(".js", "text/javascript")
    if runmode == "release" {
        gin.SetMode(gin.ReleaseMode)
    }
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
    log.Fatal(autotls.Run(router, hostname))
}

func main() {
    run()
}
