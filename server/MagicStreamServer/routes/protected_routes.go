package routes

import (
	controller "github.com/Tarun222999/MagicMovieStream/Server/MagicStreamServer/controllers"
	"github.com/Tarun222999/MagicMovieStream/Server/MagicStreamServer/middleware"
	"github.com/gin-gonic/gin"
)

func SetUpProtectedRoutes(router *gin.Engine) {
	router.Use(middleware.AuthMiddleWare())

	router.GET("/movie/:imdb_id", controller.GetMovie())
	router.POST("/addmovie", controller.AddMovie())
}
