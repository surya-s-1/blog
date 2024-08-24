CREATE DATABASE blog;

USE blog;

CREATE TABLE `users` (
  `username` varchar(15) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) DEFAULT NULL,
  `content` text,
  `username` varchar(15) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `posts_ibfk_1` (`username`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
);

CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `username` varchar(15) NOT NULL,
  `comment` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `comments_ibfk_1` (`post_id`),
  KEY `comments_ibfk_2` (`username`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
);
