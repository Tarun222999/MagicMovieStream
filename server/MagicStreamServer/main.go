package main

import (
	"fmt"

	controller "github.com/Tarun222999/MagicMovieStream/Server/MagicStreamServer/controllers"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.GET("/hello", func(c *gin.Context) {
		c.String(200, "Hello, MagicStreamMovies!")
	})

	router.GET("/movies", controller.GetMovies())
	router.GET("/movie/:imdb_id", controller.GetMovie())
	router.POST("/addmovie", controller.AddMovie())
	router.POST("/register", controller.RegisterUser())
	if err := router.Run(":8080"); err != nil {
		fmt.Println("Failed to Start Server", err)
	}

}
