package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("postgres", "host=db user=postgres password=password dbname=runningchallengedb sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := gin.Default()

	r.Use(corsMiddleware())

	r.GET("/items", getItems)
	r.POST("/items", addItem)

	r.Run(":8080")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func getItems(c *gin.Context) {
	rows, err := db.Query("SELECT id, challenge_name, challenge_attribute, challenge_attribute_value FROM challenge_attributes ORDER BY id")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var items []struct {
		ID                      int    `json:"id"`
		ChallengeName           string `json:"challenge_name"`
		ChallengeAttribute      string `json:"challenge_attribute"`
		ChallengeAttributeValue string `json:"challenge_attribute_value"`
	}
	for rows.Next() {
		var item struct {
			ID                      int    `json:"id"`
			ChallengeName           string `json:"challenge_name"`
			ChallengeAttribute      string `json:"challenge_attribute"`
			ChallengeAttributeValue string `json:"challenge_attribute_value"`
		}
		if err := rows.Scan(&item.ID, &item.ChallengeName, &item.ChallengeAttribute, &item.ChallengeAttributeValue); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}

func addItem(c *gin.Context) {
	var item struct {
		ChallengeName           string `json:"challenge_name"`
		ChallengeAttribute      string `json:"challenge_attribute"`
		ChallengeAttributeValue string `json:"challenge_attribute_value"`
	}
	if err := c.BindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec(
		"INSERT INTO challenge_attributes (challenge_name, challenge_attribute, challenge_attribute_value) VALUES ($1, $2, $3)",
		item.ChallengeName, item.ChallengeAttribute, item.ChallengeAttributeValue,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}
