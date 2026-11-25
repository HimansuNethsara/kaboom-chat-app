-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.33 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.4.0.6659
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for kaboom
CREATE DATABASE IF NOT EXISTS `kaboom` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `kaboom`;

-- Dumping structure for table kaboom.chat
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `files` longtext NOT NULL,
  `message` longtext NOT NULL,
  `status` varchar(30) DEFAULT NULL,
  `from_user` int DEFAULT NULL,
  `to_user` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_qydhn8kg94hqya41okkq4h5ng` (`from_user`),
  KEY `FK_e6od82vcl84c3j9hawauu8xwn` (`to_user`),
  CONSTRAINT `FK_e6od82vcl84c3j9hawauu8xwn` FOREIGN KEY (`to_user`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_qydhn8kg94hqya41okkq4h5ng` FOREIGN KEY (`from_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kaboom.chat: ~17 rows (approximately)
INSERT INTO `chat` (`id`, `created_at`, `updated_at`, `files`, `message`, `status`, `from_user`, `to_user`) VALUES
	(1, '2025-10-10 16:46:47', '2025-10-11 07:00:17', 'FILE:', 'Hii', 'DELIVERED', 2, 1),
	(2, '2025-10-10 20:22:43', '2025-10-11 07:00:17', 'FILE:', 'How are you doing', 'DELIVERED', 2, 1),
	(3, '2025-10-11 07:58:54', '2025-10-11 08:04:52', 'FILE:', 'Hi Donald', 'DELIVERED', 3, 1),
	(4, '2025-10-11 11:46:26', '2025-10-11 11:49:03', 'FILE:', 'Testing', 'DELIVERED', 2, 1),
	(5, '2025-10-11 15:08:46', '2025-10-11 15:08:46', 'FILE:', 'Hi sir', 'SENT', 5, 2),
	(6, '2025-10-11 15:09:00', '2025-10-11 15:09:00', 'FILE:', 'Pleased to meet you', 'SENT', 5, 2),
	(7, '2025-10-11 15:09:11', '2025-10-11 15:09:11', 'FILE:', 'I am coming', 'SENT', 5, 2),
	(8, '2025-10-11 15:09:26', '2025-10-11 15:09:26', 'FILE:', 'Nice to meet you', 'SENT', 5, 1),
	(9, '2025-10-11 15:09:41', '2025-10-11 15:09:41', 'FILE:', 'Hello Bean', 'SENT', 5, 3),
	(10, '2025-10-11 15:10:09', '2025-10-11 15:13:43', 'FILE:', 'Vengeance shall be mine', 'DELIVERED', 5, 8),
	(11, '2025-10-11 15:10:33', '2025-10-11 15:14:20', 'FILE:', 'Huge Fan', 'READ', 5, 4),
	(12, '2025-10-11 15:10:55', '2025-10-11 15:13:05', 'FILE:', 'AI revolution has begun', 'DELIVERED', 5, 7),
	(13, '2025-10-11 15:11:34', '2025-10-11 15:11:51', 'FILE:', 'Sing me a song', 'READ', 5, 6),
	(14, '2025-10-11 15:12:51', '2025-10-11 15:15:12', 'FILE:', 'Twinkle Twinkle Little Star', 'DELIVERED', 6, 5),
	(15, '2025-10-11 15:14:35', '2025-10-11 15:15:12', 'FILE:', 'Wanna meet up', 'READ', 4, 5),
	(16, '2025-10-11 15:22:36', '2025-10-11 15:26:50', 'FILE:', 'Hey there', 'READ', 9, 5),
	(17, '2025-10-11 15:22:49', '2025-10-11 15:26:50', 'FILE:', 'Nice to meet you. A huge fan', 'READ', 9, 5),
	(18, '2025-10-11 15:23:53', '2025-10-11 15:23:53', 'FILE:', 'This message is been recorded', 'SENT', 9, 2);

-- Dumping structure for table kaboom.friend_list
CREATE TABLE IF NOT EXISTS `friend_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `display_name` varchar(100) DEFAULT NULL,
  `user_status` varchar(30) DEFAULT NULL,
  `friend_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_t35f03kjx6389385fthfry288` (`friend_id`),
  KEY `FK_rmlr6b76l6606kgyo9uim7maf` (`user_id`),
  CONSTRAINT `FK_rmlr6b76l6606kgyo9uim7maf` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_t35f03kjx6389385fthfry288` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kaboom.friend_list: ~21 rows (approximately)
INSERT INTO `friend_list` (`id`, `display_name`, `user_status`, `friend_id`, `user_id`) VALUES
	(1, 'Donald Trump', 'ACTIVE', 1, 2),
	(2, NULL, 'ACTIVE', 2, 1),
	(3, 'Donald Trump', 'ACTIVE', 1, 3),
	(4, NULL, 'ACTIVE', 3, 1),
	(5, 'Donald Trump', 'ACTIVE', 1, 5),
	(6, 'Vladmir Putin', 'ACTIVE', 2, 5),
	(7, 'Rowan Atkinson', 'ACTIVE', 3, 5),
	(8, 'ShahRukh Khan', 'ACTIVE', 4, 5),
	(9, 'Taylor Swift', 'ACTIVE', 6, 5),
	(10, 'Elon Musk', 'ACTIVE', 7, 5),
	(11, 'Brock Lesnar', 'ACTIVE', 8, 5),
	(12, NULL, 'ACTIVE', 5, 2),
	(13, NULL, 'ACTIVE', 5, 1),
	(14, NULL, 'ACTIVE', 5, 3),
	(15, NULL, 'ACTIVE', 5, 8),
	(16, NULL, 'ACTIVE', 5, 4),
	(17, NULL, 'ACTIVE', 5, 7),
	(18, NULL, 'ACTIVE', 5, 6),
	(19, 'John Wick', 'ACTIVE', 5, 9),
	(20, NULL, 'ACTIVE', 9, 5),
	(21, 'Vladmir Putin', 'ACTIVE', 2, 9),
	(22, NULL, 'ACTIVE', 9, 2);

-- Dumping structure for table kaboom.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `contact_no` varchar(45) NOT NULL,
  `country_code` varchar(5) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_lo565olv8by15v9qgmqq8ajh8` (`contact_no`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kaboom.user: ~8 rows (approximately)
INSERT INTO `user` (`id`, `created_at`, `updated_at`, `bio`, `contact_no`, `country_code`, `first_name`, `last_name`, `status`) VALUES
	(1, '2025-10-10 16:44:34', '2025-10-11 11:49:17', 'Hey there! I\'m using Kaboom', '2125551234', '+1', 'Donald', 'Trump', 'OFFLINE'),
	(2, '2025-10-10 16:45:35', '2025-10-11 14:56:00', 'Hey there! I\'m using Kaboom', '9852387548', '+7', 'Vladmir', 'Putin', 'OFFLINE'),
	(3, '2025-10-11 07:02:20', '2025-10-11 11:49:34', 'Hey there! I\'m using Kaboom', '2071234785', '+44', 'Rowan', 'Atkinson', 'OFFLINE'),
	(4, '2025-10-11 14:58:02', '2025-10-11 15:15:04', 'Hey there! I\'m using Kaboom', '912245563', '+91', 'ShahRukh', 'Khan', 'OFFLINE'),
	(5, '2025-10-11 14:59:04', '2025-10-11 19:15:23', 'Hey there! I\'m using Kaboom', '2125447845', '+1', 'John', 'Wick', 'OFFLINE'),
	(6, '2025-10-11 15:00:13', '2025-10-11 15:12:56', 'Hey there! I\'m using Kaboom', '2125458542', '+1', 'Taylor', 'Swift', 'OFFLINE'),
	(7, '2025-10-11 15:01:19', '2025-10-11 15:13:35', 'Hey there! I\'m using Kaboom', '2125584121', '+1', 'Elon', 'Musk', 'OFFLINE'),
	(8, '2025-10-11 15:02:11', '2025-10-11 15:14:06', 'Hey there! I\'m using Kaboom', '784512021', '+94', 'Brock ', 'Lesnar', 'OFFLINE'),
	(9, '2025-10-11 15:21:36', '2025-10-11 15:26:37', 'Hey there! I\'m using Kaboom', '766748088', '+94', 'Himansu', 'Ranasinghe ', 'OFFLINE'),
	(10, '2025-10-11 19:07:19', '2025-10-11 19:07:23', 'Hey there! I\'m using Kaboom', '771104647', '+94', 'Nishith', 'Ranasinghe ', 'OFFLINE');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
