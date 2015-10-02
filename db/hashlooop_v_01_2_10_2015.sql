-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 02, 2015 at 05:35 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hashlooop`
--
CREATE DATABASE IF NOT EXISTS `hashlooop` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `hashlooop`;

-- --------------------------------------------------------

--
-- Table structure for table `following_mapping`
--

CREATE TABLE IF NOT EXISTS `following_mapping` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `following_id` bigint(11) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `following_id` (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `hash_tags`
--

CREATE TABLE IF NOT EXISTS `hash_tags` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `hobbies`
--

CREATE TABLE IF NOT EXISTS `hobbies` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `hobbies_name` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `status_id` bigint(11) NOT NULL,
  `like_type` bigint(11) NOT NULL,
  `like_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status_id` (`status_id`),
  KEY `like_type` (`like_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `likes_types`
--

CREATE TABLE IF NOT EXISTS `likes_types` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `moode_name` varchar(50) NOT NULL,
  `moode_code` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `status_type` bigint(11) NOT NULL,
  `status_mood` bigint(11) NOT NULL,
  `status` varchar(244) DEFAULT NULL,
  `hashtag` bigint(11) NOT NULL,
  `location_of_status` varchar(128) NOT NULL,
  `status_location_latitude` float(10,6) DEFAULT NULL,
  `status_location_longitude` float(10,6) DEFAULT NULL,
  `image_url` varchar(244) DEFAULT NULL,
  `profile_pic_url` varchar(244) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status_type` (`status_type`),
  KEY `status_mood` (`status_mood`),
  KEY `hashtag` (`hashtag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `status_moods`
--

CREATE TABLE IF NOT EXISTS `status_moods` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `mood_name` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `status_types`
--

CREATE TABLE IF NOT EXISTS `status_types` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `status_type` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `mobile_number` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(128) NOT NULL,
  `current_location_latitude` float(10,6) DEFAULT NULL,
  `current_location_longitude` float(10,6) DEFAULT NULL,
  `socket_session_id` varchar(50) DEFAULT NULL,
  `following_count` varchar(50) DEFAULT NULL,
  `follower_count` varchar(50) DEFAULT NULL,
  `cover_pic_url` varchar(244) DEFAULT NULL,
  `profile_pic_url` varchar(244) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` DATETIME NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `mobile_number`, `name`, `email`, `password`, `current_location_latitude`, `current_location_longitude`, `socket_session_id`, `following_count`, `follower_count`, `cover_pic_url`, `profile_pic_url`, `created_at`, `modified_at`) VALUES
(1, '9940700655', 'Allen', 'raju.allen1888@gmail.com', 'a34c3d45b6018d3fd5560b103c2a00e2', 0.000000, 0.000000, 'rNAGUj5sqxPVmkySAAAA', NULL, NULL, NULL, NULL, '2015-09-24 19:56:43', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_hobbies`
--

CREATE TABLE IF NOT EXISTS `user_hobbies` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `hobbies` bigint(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `hobbies` (`hobbies`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `following_mapping`
--
ALTER TABLE `following_mapping`
  ADD CONSTRAINT `following_mapping_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `following_mapping_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`like_type`) REFERENCES `likes_types` (`id`);

--
-- Constraints for table `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `status_ibfk_2` FOREIGN KEY (`status_type`) REFERENCES `status_types` (`id`),
  ADD CONSTRAINT `status_ibfk_3` FOREIGN KEY (`status_mood`) REFERENCES `status_moods` (`id`),
  ADD CONSTRAINT `status_ibfk_4` FOREIGN KEY (`hashtag`) REFERENCES `hash_tags` (`id`);

--
-- Constraints for table `user_hobbies`
--
ALTER TABLE `user_hobbies`
  ADD CONSTRAINT `user_hobbies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_hobbies_ibfk_2` FOREIGN KEY (`hobbies`) REFERENCES `hobbies` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
