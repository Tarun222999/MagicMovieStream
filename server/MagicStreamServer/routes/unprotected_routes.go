package routes

import (
	controller "github.com/Tarun222999/MagicMovieStream/Server/MagicStreamServer/controllers"
	"github.com/gin-gonic/gin"
)

func SetupUnProtectedRoutes(router *gin.Engine) {
	router.GET("/movies", controller.GetMovies())
	router.POST("/register", controller.RegisterUser())
	router.POST("/login", controller.LoginUser())

}
