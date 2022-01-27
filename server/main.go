package main

import (
    "fmt"
    "os"
    "log"
    "time"
    "mime"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/gzip"
    "github.com/gin-contrib/static"
    "github.com/joho/godotenv"
    "github.com/gin-gonic/autotls"
    "github.com/gin-contrib/sessions"
    "github.com/gin-contrib/sessions/cookie"
)

func Logger() gin.HandlerFunc {
    return func(c *gin.Context) {
        t := time.Now()
        c.Next()
        path := os.Getenv("LOGPATH")
        logfile := fmt.Sprintf("%s%04d%02d.log", path, t.Year(), t.Month())
        f, _ := os.OpenFile(logfile,
            os.O_APPEND | os.O_WRONLY | os.O_CREATE, 0600)
        defer f.Close()
        fmt.Fprintf(f, "%s|%s|%s|%s|%d\n", time.Now().String(),
            time.Since(t).String(), c.Request.Method,
            c.Request.URL.Path, c.Writer.Status())
    }
}

func Run() {
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
    router := gin.New()
    store := cookie.NewStore([]byte("secret"))
    router.Use(sessions.Sessions("cemifsession", store))
    router.Use(Logger())
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
    if runmode == "release" {
    	log.Fatal(autotls.Run(router, hostname))
    } else {
        router.Run()
    }
}

func main() {
    Run()
}
