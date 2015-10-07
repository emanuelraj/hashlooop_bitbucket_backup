-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2015 at 06:02 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hashlooop`
--

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE IF NOT EXISTS `badges` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `badge_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `badges`
--

INSERT INTO `badges` (`id`, `badge_name`, `created_at`, `modified_at`) VALUES
(1, 'Discoverer', '2015-10-07 15:33:24', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `badges_mapping`
--

CREATE TABLE IF NOT EXISTS `badges_mapping` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `badge_id` bigint(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `badge_id` (`badge_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `badges_mapping`
--

INSERT INTO `badges_mapping` (`id`, `user_id`, `badge_id`, `created_at`, `modified_at`) VALUES
(1, 1, 1, '2015-10-07 15:59:08', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `following_mapping`
--

CREATE TABLE IF NOT EXISTS `following_mapping` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `following_id` bigint(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `following_id` (`following_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `following_mapping`
--

INSERT INTO `following_mapping` (`id`, `user_id`, `following_id`, `created_at`, `modified_at`) VALUES
(1, 2, 1, '2015-10-07 14:18:49', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `hash_tags`
--

CREATE TABLE IF NOT EXISTS `hash_tags` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `hobbies`
--

CREATE TABLE IF NOT EXISTS `hobbies` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `hobbies_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `status_id` bigint(11) NOT NULL,
  `user_id` bigint(11) DEFAULT NULL,
  `like_type` bigint(11) NOT NULL,
  `like_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `status_id` (`status_id`),
  KEY `like_type` (`like_type`),
  KEY `fk_likes_user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `status_id`, `user_id`, `like_type`, `like_date`, `created_at`, `modified_at`) VALUES
(1, 2, 1, 1, '2015-10-04 18:55:56', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 2, 2, 1, '2015-10-04 18:55:56', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 3, 1, 1, '2015-10-04 18:56:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 3, 2, 1, '2015-10-04 18:56:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 4, 1, 1, '2015-10-04 18:56:47', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 4, 2, 1, '2015-10-04 18:56:47', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 10, 1, 1, '2015-10-06 20:28:47', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 8, 1, 1, '2015-10-06 20:29:55', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 11, 1, 1, '2015-10-06 20:29:58', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `likes_types`
--

CREATE TABLE IF NOT EXISTS `likes_types` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `moode_name` varchar(50) NOT NULL,
  `moode_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `likes_types`
--

INSERT INTO `likes_types` (`id`, `moode_name`, `moode_code`, `created_at`, `modified_at`) VALUES
(1, 'Normal', '', '2015-10-04 18:52:25', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `status_type` bigint(11) NOT NULL,
  `status_mood` bigint(11) DEFAULT NULL,
  `status` varchar(244) DEFAULT NULL,
  `hashtag` bigint(11) DEFAULT NULL,
  `status_location_latitude` float(10,6) DEFAULT NULL,
  `status_location_longitude` float(10,6) DEFAULT NULL,
  `image_url` varchar(244) DEFAULT NULL,
  `profile_pic_url` varchar(244) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status_type` (`status_type`),
  KEY `status_mood` (`status_mood`),
  KEY `hashtag` (`hashtag`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `user_id`, `status_type`, `status_mood`, `status`, `hashtag`, `status_location_latitude`, `status_location_longitude`, `image_url`, `profile_pic_url`, `created_at`, `modified_at`) VALUES
(1, 1, 1, NULL, 'Testing First Looop', NULL, 10.991079, 76.963959, NULL, NULL, '2015-10-07 15:59:07', '0000-00-00 00:00:00'),
(2, 2, 1, NULL, 'Testing 2 looop', NULL, 10.991079, 76.963959, NULL, NULL, '2015-10-07 15:59:25', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `status_moods`
--

CREATE TABLE IF NOT EXISTS `status_moods` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `mood_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `status_types`
--

CREATE TABLE IF NOT EXISTS `status_types` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `status_type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `status_types`
--

INSERT INTO `status_types` (`id`, `status_type`, `created_at`, `modified_at`) VALUES
(1, 'Text', '2015-10-04 13:27:49', '0000-00-00 00:00:00'),
(2, 'Picture', '2015-10-04 13:27:49', '0000-00-00 00:00:00');

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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `mobile_number`, `name`, `email`, `password`, `current_location_latitude`, `current_location_longitude`, `socket_session_id`, `following_count`, `follower_count`, `cover_pic_url`, `profile_pic_url`, `created_at`, `modified_at`) VALUES
(1, '9940700655', 'Allen', 'raju.allen1888@gmail.com', '432a44ddc0aa72ed8c200f53b6268af4', 10.991079, 76.963959, '1a4zMG8pyk2M6P7_AAAE', NULL, NULL, NULL, NULL, '2015-10-07 15:58:50', '0000-00-00 00:00:00'),
(2, '8867037946', 'Iyrin', 'iyrinjamima810@gmail.com', '7dbc656b53be33f8b884b59a4eadad59', 10.991079, 76.963959, 'ssdjj-m_Fz3Q1aKQAAAF', NULL, NULL, NULL, NULL, '2015-10-07 15:58:59', '0000-00-00 00:00:00');

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
-- Constraints for table `badges_mapping`
--
ALTER TABLE `badges_mapping`
  ADD CONSTRAINT `badges_mapping_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `badges_mapping_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`);

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
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`like_type`) REFERENCES `likes_types` (`id`),
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
