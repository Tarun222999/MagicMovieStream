package main

import (
	"fmt"

	"github.com/Tarun222999/MagicMovieStream/Server/MagicStreamServer/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.GET("/hello", func(c *gin.Context) {
		c.String(200, "Hello, MagicStreamMovies!")
	})

	routes.SetUpProtectedRoutes(router)
	routes.SetupUnProtectedRoutes(router)
	if err := router.Run(":8080"); err != nil {
		fmt.Println("Failed to Start Server", err)
	}

}
