-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2025 at 06:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `syllaverse_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role` varchar(64) NOT NULL,
  `scope_type` varchar(64) NOT NULL,
  `scope_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('active','ended') NOT NULL DEFAULT 'active',
  `start_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_at` timestamp NULL DEFAULT NULL,
  `assigned_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `role`, `scope_type`, `scope_id`, `status`, `start_at`, `end_at`, `assigned_by`, `created_at`, `updated_at`) VALUES
(891, 229, 'FACULTY', 'Department', 80, 'ended', '2025-12-06 21:58:13', '2025-12-07 13:47:58', NULL, '2025-12-06 21:58:13', '2025-12-07 13:47:58'),
(895, 226, 'FACULTY', 'Department', 80, 'ended', '2025-12-07 03:54:22', '2025-12-07 03:54:31', NULL, '2025-12-07 03:54:22', '2025-12-07 03:54:31'),
(903, 224, 'FACULTY', 'Department', 85, 'active', '2025-12-07 07:47:45', NULL, NULL, '2025-12-07 07:47:45', '2025-12-07 07:47:45'),
(908, 230, 'CHAIR', 'Department', 85, 'active', '2025-12-08 05:25:34', NULL, NULL, '2025-12-08 05:25:34', '2025-12-08 05:25:34'),
(911, 226, 'FACULTY', 'Department', 98, 'active', '2025-12-08 05:26:42', NULL, NULL, '2025-12-08 05:26:42', '2025-12-08 05:26:42'),
(921, 221, 'FACULTY', 'Department', 80, 'active', '2025-12-08 09:09:00', NULL, NULL, '2025-12-08 09:09:00', '2025-12-08 09:09:00'),
(924, 234, 'CHAIR', 'Department', 80, 'ended', '2025-12-08 09:42:26', '2025-12-11 01:52:59', NULL, '2025-12-08 09:42:26', '2025-12-11 01:52:59'),
(926, 227, 'FACULTY', 'Department', 80, 'active', '2025-12-08 09:42:59', NULL, NULL, '2025-12-08 09:42:59', '2025-12-08 09:42:59'),
(930, 235, 'FACULTY', 'Department', 80, 'active', '2025-12-08 13:34:47', NULL, NULL, '2025-12-08 13:34:47', '2025-12-08 13:34:47'),
(933, 236, 'FACULTY', 'Department', 80, 'active', '2025-12-10 07:27:43', NULL, NULL, '2025-12-10 07:27:43', '2025-12-10 07:27:43'),
(935, 240, 'DEPT_HEAD', 'Department', 99, 'active', '2025-12-11 03:24:44', NULL, NULL, '2025-12-11 03:24:44', '2025-12-11 03:24:44'),
(939, 239, 'FACULTY', 'Department', 85, 'active', '2025-12-11 05:07:52', NULL, NULL, '2025-12-11 05:07:52', '2025-12-11 05:07:52'),
(941, 231, 'FACULTY', 'Department', 80, 'active', '2025-12-14 19:26:49', NULL, NULL, '2025-12-14 19:26:49', '2025-12-14 19:26:49'),
(942, 234, 'CHAIR', 'Department', 80, 'active', '2025-12-14 19:35:16', NULL, NULL, '2025-12-14 19:35:16', '2025-12-14 19:35:16'),
(943, 229, 'FACULTY', 'Department', 80, 'active', '2025-12-26 18:55:09', NULL, NULL, '2025-12-26 18:55:09', '2025-12-26 18:55:09');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('syllaverse_cache_superadmin_dashboard_accounts_by_dept', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:4:{i:0;a:2:{s:10:\"department\";s:4:\"CICS\";s:5:\"total\";i:6;}i:1;a:2:{s:10:\"department\";s:3:\"CTE\";s:5:\"total\";i:4;}i:2;a:2:{s:10:\"department\";s:7:\"CABEIHM\";s:5:\"total\";i:1;}i:3;a:2:{s:10:\"department\";s:3:\"CAS\";s:5:\"total\";i:1;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1766804129),
('syllaverse_cache_superadmin_dashboard_leadership', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:4:{i:0;a:4:{s:4:\"name\";s:13:\"Alvin Andulan\";s:4:\"role\";s:4:\"Dean\";s:10:\"department\";s:7:\"CABEIHM\";s:13:\"department_id\";i:99;}i:1;a:4:{s:4:\"name\";s:13:\"CERTEZA CINDY\";s:4:\"role\";s:13:\"Program Chair\";s:10:\"department\";s:4:\"CICS\";s:13:\"department_id\";i:80;}i:2;a:4:{s:4:\"name\";s:24:\"Adriane Allen P. Pablico\";s:4:\"role\";s:10:\"Assoc Dean\";s:10:\"department\";s:3:\"CTE\";s:13:\"department_id\";i:85;}i:3;a:4:{s:4:\"name\";s:16:\"PEREZ JOANNA MAE\";s:4:\"role\";s:16:\"Department Chair\";s:10:\"department\";s:3:\"CTE\";s:13:\"department_id\";i:85;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1766804129),
('syllaverse_cache_superadmin_dashboard_stats', 'a:5:{s:11:\"departments\";i:6;s:8:\"programs\";i:11;s:7:\"courses\";i:7;s:7:\"faculty\";i:16;s:16:\"pending_accounts\";i:0;}', 1766804129),
('syllaverse_cache_superadmin_dashboard_syllabus_status_by_dept_v4', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:2:{i:0;a:9:{s:10:\"department\";s:7:\"CABEIHM\";s:5:\"draft\";i:1;s:7:\"pending\";i:0;s:8:\"reviewed\";i:0;s:14:\"final_approved\";i:0;s:5:\"total\";i:1;s:12:\"reviewed_pct\";i:0;s:6:\"status\";i:0;s:12:\"status_label\";s:6:\"Behind\";}i:1;a:9:{s:10:\"department\";s:4:\"CICS\";s:5:\"draft\";i:7;s:7:\"pending\";i:2;s:8:\"reviewed\";i:3;s:14:\"final_approved\";i:0;s:5:\"total\";i:12;s:12:\"reviewed_pct\";i:25;s:6:\"status\";i:0;s:12:\"status_label\";s:6:\"Behind\";}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1766804129);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cdios`
--

CREATE TABLE `cdios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cdios`
--

INSERT INTO `cdios` (`id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(10, 'Disciplinary Knowledge & Reasonin', 'Knowledge of underlying mathematics and sciences, core engineering fundamental knowledge, advanced engineering fundamental knowledge, methods, and tools.', '2025-12-07 04:23:38', '2025-12-07 04:23:38'),
(13, 'Personal and Professional Skills & Attributes', 'Analytical reasoning and problem solving; experimentation, investigation, and knowledge discovery; system thinking; attitudes, thoughts, and learning; ethics, equity, and other responsibilities.', '2025-12-07 04:23:56', '2025-12-07 04:23:56'),
(15, 'Interpersonal Skills: Teamwork & Communication', 'Teamwork, communications, communication in a foreign language.', '2025-12-07 04:24:17', '2025-12-07 04:24:17');

-- --------------------------------------------------------

--
-- Table structure for table `chair_requests`
--

CREATE TABLE `chair_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `requested_role` varchar(64) NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `program_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `decided_by` bigint(20) UNSIGNED DEFAULT NULL,
  `decided_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chair_requests`
--

INSERT INTO `chair_requests` (`id`, `user_id`, `requested_role`, `department_id`, `program_id`, `status`, `decided_by`, `decided_at`, `notes`, `created_at`, `updated_at`) VALUES
(237, 230, 'DEPT_HEAD', 80, NULL, 'approved', NULL, '2025-12-07 03:54:02', NULL, '2025-12-06 10:10:26', '2025-12-07 03:54:02'),
(238, 231, 'CHAIR', 80, NULL, 'approved', NULL, '2025-12-06 10:24:56', NULL, '2025-12-06 10:22:57', '2025-12-06 10:24:56'),
(240, 229, 'DEPT_HEAD', 80, NULL, 'approved', NULL, '2025-12-07 13:47:58', NULL, '2025-12-07 05:54:49', '2025-12-07 13:47:58'),
(241, 234, 'CHAIR', 80, NULL, 'approved', NULL, '2025-12-08 09:41:30', NULL, '2025-12-08 09:41:13', '2025-12-08 09:41:30'),
(242, 235, 'FACULTY', 80, NULL, 'approved', NULL, '2025-12-08 13:34:47', NULL, '2025-12-08 13:33:19', '2025-12-08 13:34:47'),
(243, 236, 'CHAIR', 80, NULL, 'approved', NULL, '2025-12-10 05:41:22', NULL, '2025-12-10 05:40:50', '2025-12-10 05:41:22'),
(244, 240, 'DEPT_HEAD', 99, NULL, 'approved', NULL, '2025-12-11 03:24:44', NULL, '2025-12-11 03:23:20', '2025-12-11 03:24:44');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `course_category` varchar(255) DEFAULT NULL,
  `has_iga` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `contact_hours_lec` int(11) DEFAULT NULL,
  `contact_hours_lab` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `department_id`, `code`, `title`, `course_category`, `has_iga`, `status`, `contact_hours_lec`, `contact_hours_lab`, `description`, `created_at`, `updated_at`) VALUES
(86, 80, 'BAT 401', 'Fundamentals of Business Analytics', 'Professional Elective: Business Analytics Track', 0, 'active', 3, 2, NULL, '2025-11-03 10:31:53', '2025-11-03 10:31:53'),
(88, 80, 'IT 111', 'Introduction to Computing', 'Core, Elective, Professional', 0, 'active', 3, 0, NULL, '2025-11-30 23:06:51', '2025-11-30 23:06:51'),
(90, 80, 'CS 111', 'Computer Programming', 'Core Elective', 0, 'active', 3, 2, NULL, '2025-12-03 08:22:12', '2025-12-03 08:22:12'),
(91, 80, 'IT 212', 'Computer Networking 1', 'Core Elective', 0, 'active', 3, 2, NULL, '2025-12-03 08:23:47', '2025-12-03 08:23:47'),
(92, 80, 'IT 221', 'Information Management', 'Core Elective', 0, 'active', 3, 2, NULL, '2025-12-03 08:36:24', '2025-12-03 08:36:24'),
(94, 80, 'IT 121', 'Advanced Computer Programming', 'Core Elective', 0, 'active', 3, 2, NULL, '2025-12-07 05:53:34', '2025-12-07 05:53:59'),
(95, 99, 'ACC 101', 'Financial Accounting and Reporting 1', 'Core Accounting Education', 0, 'active', 6, 0, 'This course will help the students understand the fundamental accounting concepts and principles. They will also be introduced to the double entry system of recording transactions, the accounting cycle under a service type of business. This also includes an introduction to the accounting for merchandising and manufacturing types of business. It also emphasizes the construction of financial statements which includes the statement of financial position, statement of comprehensive income, statement of changes in equity and statement of cash flows. Students will also be oriented about special and combination journals as well as the voucher system.', '2025-12-11 03:27:09', '2025-12-11 03:27:09');

-- --------------------------------------------------------

--
-- Table structure for table `course_prerequisite`
--

CREATE TABLE `course_prerequisite` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `prerequisite_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_prerequisite`
--

INSERT INTO `course_prerequisite` (`id`, `course_id`, `prerequisite_id`, `created_at`, `updated_at`) VALUES
(98, 94, 90, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `created_at`, `updated_at`) VALUES
(80, 'College of Informatics and Computing Sciences', 'CICS', '2025-10-03 22:56:33', '2025-12-02 21:42:34'),
(85, 'College of Teacher Education', 'CTE', '2025-10-05 01:51:06', '2025-10-15 20:55:12'),
(98, 'College of Arts and Sciences', 'CAS', '2025-12-07 03:55:14', '2025-12-07 03:55:23'),
(99, 'College of Accountancy, Business, Economics and International Hospitality Management', 'CABEIHM', '2025-12-11 03:18:02', '2025-12-11 04:56:45'),
(100, 'College Health Sciences', 'CHS', '2025-12-11 04:09:55', '2025-12-11 04:09:55'),
(101, 'College of Criminal Justice Education', 'CCJE', '2025-12-11 05:03:52', '2025-12-11 05:03:52');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_syllabus`
--

CREATE TABLE `faculty_syllabus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `faculty_id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('owner','collaborator','viewer') NOT NULL DEFAULT 'collaborator',
  `can_edit` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faculty_syllabus`
--

INSERT INTO `faculty_syllabus` (`id`, `faculty_id`, `syllabus_id`, `role`, `can_edit`, `created_at`, `updated_at`) VALUES
(124, 221, 266, 'owner', 1, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(126, 229, 268, 'owner', 1, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(127, 231, 269, 'owner', 1, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(129, 227, 271, 'owner', 1, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(130, 235, 272, 'owner', 1, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(132, 229, 274, 'owner', 1, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(133, 231, 275, 'owner', 1, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(135, 236, 277, 'owner', 1, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(136, 231, 278, 'owner', 1, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(137, 234, 279, 'owner', 1, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(138, 234, 280, 'owner', 1, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(139, 240, 281, 'owner', 1, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(141, 231, 283, 'owner', 1, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(142, 229, 284, 'owner', 1, '2025-12-27 09:50:32', '2025-12-27 09:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `general_information`
--

CREATE TABLE `general_information` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `section` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `general_information`
--

INSERT INTO `general_information` (`id`, `department_id`, `section`, `content`, `created_at`, `updated_at`) VALUES
(1, NULL, 'mission', 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', '2025-07-20 14:10:56', '2025-08-14 08:57:56'),
(2, NULL, 'vision', 'A premier national university that develops leaders in the global knowledge economy', '2025-07-20 14:11:31', '2025-07-20 14:11:31'),
(3, 80, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', '2025-07-20 14:11:50', '2025-07-20 14:11:50'),
(4, 80, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', '2025-07-20 14:12:07', '2025-07-20 14:12:07'),
(5, 80, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', '2025-07-20 14:12:18', '2025-07-20 14:12:18'),
(6, 80, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', '2025-07-20 14:12:30', '2025-07-20 14:12:30'),
(10, 80, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', '2025-09-07 15:36:26', '2025-09-07 15:36:26');

-- --------------------------------------------------------

--
-- Table structure for table `igas`
--

CREATE TABLE `igas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `igas`
--

INSERT INTO `igas` (`id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(38, 'Knowledge Competence', 'Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.', '2025-12-07 04:21:01', '2025-12-07 04:21:01'),
(39, 'Creativity and Innovation', 'Experiment with new approaches, challenge existing knowledge boundaries, and design novel solutions to solve problems.', '2025-12-07 04:21:30', '2025-12-07 04:21:30'),
(40, 'Critical and Systems Thinking', 'Identify, define, and deal with complex problems pertinent to future professional practice or daily life through logical, analytical, and critical thinking.', '2025-12-07 04:21:45', '2025-12-07 04:21:45'),
(41, 'Communication', 'Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Filipino.', '2025-12-07 04:21:59', '2025-12-07 04:21:59'),
(42, 'Lifelong Learning', 'Identify own learning needs for professional or personal development; demonstrate eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.', '2025-12-07 04:22:14', '2025-12-07 04:22:14'),
(43, 'Leadership, Teamwork, and Interpersonal Skills', 'Function effectively both as a leader and as a member of a team; motivate and lead a team to work toward goals; work collaboratively with other team members; and connect and interact socially and effectively with diverse culture.', '2025-12-07 04:22:28', '2025-12-07 04:22:28'),
(44, 'Global Outlook', 'Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively, and show sensitivity to cultural diversity.', '2025-12-07 04:22:39', '2025-12-07 04:22:39'),
(45, 'Social and National Responsibility', 'Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of society; and behave ethically and responsibly in social, professional, and work environments.', '2025-12-07 04:23:03', '2025-12-07 04:23:03');

-- --------------------------------------------------------

--
-- Table structure for table `intended_learning_outcomes`
--

CREATE TABLE `intended_learning_outcomes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `position` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `intended_learning_outcomes`
--

INSERT INTO `intended_learning_outcomes` (`id`, `code`, `description`, `position`, `created_at`, `updated_at`, `course_id`) VALUES
(109, 'ILO1', 'aa', 1, '2025-12-27 08:53:10', '2025-12-27 08:53:10', 86);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(34, '2025_07_14_091747_create_courses_table', 1),
(35, '2025_07_14_091954_create_programs_table', 1),
(36, '2025_07_14_092050_create_program_courses_table', 1),
(37, '2025_07_22_165446_add_contact_hours_to_courses_table', 2),
(38, '2025_07_22_165818_create_course_prerequisite_table', 3),
(39, '2025_07_22_173011_add_course_id_to_intended_learning_outcomes_table', 4),
(40, '2025_07_22_224114_create_syllabi_table', 5),
(41, '2025_07_22_225305_add_year_level_to_syllabi_table', 6),
(42, '2025_07_26_151152_add_textbook_file_path_to_syllabi_table', 7),
(44, '2025_07_26_191116_create_syllabus_textbooks_table', 9),
(45, 'xxxx_xx_xx_xxxxxx_create_syllabus_textbooks_table', 10),
(46, '2025_07_27_000001_update_ilo_so_columns_in_syllabus_tlas_table', 11),
(48, '2025_07_28_000002_add_position_to_intended_learning_outcomes_table', 13),
(49, '2025_07_26_152842_create_tla_table', 14),
(50, '2025_07_28_000000_create_syllabus_ilos_table', 15),
(51, '2025_07_28_000001_create_syllabus_sos_table', 16),
(57, 'xxxx_xx_xx_create_syllabus_sdg_table', 17),
(62, '2025_07_29_000001_add_position_to_student_outcomes_table', 18),
(63, '2025_07_28_205432_add_code_and_position_to_syllabus_ilos_table', 19),
(64, '2025_07_29_000001_add_code_and_position_to_syllabus_sos_table', 20),
(65, '2025_07_28_223651_create_tla_ilo_table', 21),
(66, '2025_07_28_223651_create_tla_so_table', 21),
(67, '2025_08_08_000000_add_hr_fields_to_users_table', 22),
(68, '2025_08_08_000001_create_chair_requests_table', 23),
(69, '2025_08_08_000002_create_appointments_table', 23),
(70, '2025_08_12_000001_add_code_and_sort_order_to_master_data', 24),
(71, '2025_08_15_185055_update_role_and_scope_in_appointments_table', 25),
(72, '2025_08_16_144042_remove_units_from_courses_table', 26),
(73, 'create_assessment_task_groups_table', 27),
(74, 'create_assessment_tasks_table', 28),
(75, '2025_08_30_000001_update_ilo_unique_index', 29),
(76, '2025_09_01_000000_create_syllabus_course_infos_table', 29),
(77, '2025_09_01_000001_add_course_category_to_courses_table', 30),
(78, '2025_09_01_010000_create_syllabus_mission_visions_table', 31),
(79, '2025_09_01_020000_backfill_syllabus_mission_visions', 32),
(80, '2025_09_01_030000_add_contact_hours_text_to_syllabus_course_infos', 32),
(81, '2025_09_01_040000_add_contact_hours_lec_lab_to_syllabus_course_infos', 32),
(82, '2025_09_01_120000_change_contact_hours_lec_lab_to_text', 33),
(83, '2025_09_01_200000_create_syllabus_criteria_table', 34),
(84, '2025_09_01_210000_add_tla_strategies_to_syllabus_course_infos', 35),
(85, '2025_09_02_000000_add_section_to_syllabus_criteria_table', 36),
(86, '2025_09_02_010000_create_syllabus_criterion_items_table', 37),
(87, '2025_09_01_120000_drop_syllabus_criteria_tables', 38),
(88, '2025_09_01_100000_create_syllabus_sections_table', 39),
(89, '2025_09_01_100100_create_syllabus_section_items_table', 39),
(90, '2025_09_01_190138_create_syllabus_criteria_table_new', 40),
(91, '2025_09_02_000000_add_criteria_fields_to_syllabus_course_infos', 41),
(92, '2025_09_03_000000_migrate_criteria_to_normalized_table_and_drop_columns', 42),
(93, '2025_09_03_000001_add_assessment_tasks_data_to_syllabi_table', 43),
(94, '2025_09_03_000002_create_syllabus_assessment_tasks_table', 43),
(95, '2025_09_03_000001_change_cpa_columns_to_text', 44),
(96, '2025_09_03_000004_create_syllabus_igas_table', 45),
(97, '2025_09_03_000005_create_student_outcomes_table', 46),
(98, '2025_09_03_000006_create_syllabus_cdios_table', 46),
(99, '2025_09_05_000001_add_position_and_code_to_syllabus_sdg_table', 47),
(100, '2025_09_05_010000_create_syllabus_sdgs_table', 48),
(101, '2025_09_05_020000_replace_syllabus_sdg_with_cdios_structure', 49),
(102, '2025_09_06_000000_create_syllabus_course_policies_table', 50),
(103, '2025_09_06_120000_create_syllabus_course_policies_table', 51),
(104, '2025_09_07_120000_merge_disability_advising_into_other_policies', 52),
(105, '2025_09_07_000000_drop_tla_tables', 53),
(106, '2025_09_07_235900_create_tla_table', 54),
(107, '2025_09_08_000000_add_position_to_tla_table', 54),
(108, '2025_09_08_000000_create_missing_tla_pivots', 55),
(109, '2025_09_09_000001_create_syllabus_assessment_mappings_table', 56),
(110, '2025_09_09_120000_create_syllabus_assessment_mappings_table', 57),
(111, '2025_09_13_000000_expand_roles', 57),
(112, '2025_09_13_000100_nullable_department_in_chair_requests', 58),
(113, '2025_09_13_120000_make_programs_created_by_nullable_and_null_on_delete', 59),
(114, '2025_09_14_000000_add_ilo_so_cpa_data_to_syllabi_table', 60),
(115, '2025_09_14_010000_create_syllabus_ilo_so_cpa_table', 61),
(116, '2025_09_14_020000_create_syllabus_ilo_iga_table', 62),
(117, '2025_09_15_120000_create_syllabus_ilo_cdio_sdg_table', 63),
(118, '2025_09_18_000000_create_textbook_chunks_table', 64),
(119, '2025_09_18_120000_create_textbook_chunks_table', 65),
(120, '2025_10_02_100441_add_description_to_departments_table', 66),
(121, '2025_10_05_085903_add_status_to_programs_table', 66),
(122, '2025_10_11_045331_add_course_type_and_iga_to_courses_table', 67),
(123, '2025_10_16_011501_drop_course_type_from_courses_table', 68),
(124, '2025_10_16_011505_drop_course_type_from_courses_table', 68),
(125, '2025_10_16_012000_add_status_to_courses_table', 69),
(126, '2025_10_16_012004_add_status_to_courses_table', 69),
(127, '2025_10_18_060615_create_faculty_role_requests_table', 70),
(128, '2025_10_18_174907_create_notifications_table', 71),
(129, '2025_10_23_013044_add_title_to_student_outcomes_table', 72),
(130, '2025_10_23_100000_modify_student_outcomes_structure', 73),
(131, '2025_10_23_add_department_id_to_student_outcomes_table', 73),
(132, '2025_11_06_084829_remove_code_from_sdgs_table', 74),
(133, '2025_11_06_092544_remove_sort_order_from_sdgs_table', 75),
(134, '2025_11_06_093132_remove_code_from_igas_table', 76),
(135, '2025_11_06_093207_remove_sort_order_from_igas_table', 76),
(136, '2025_11_06_093928_add_department_id_to_igas_table', 77),
(137, '2025_11_07_100001_remove_code_from_cdios_table', 78),
(138, '2025_11_07_100045_remove_sort_order_from_cdios_table', 78),
(140, '2025_11_14_000100_add_title_columns_to_syllabus_items', 79),
(141, '2025_11_16_180628_restructure_syllabus_assessment_tasks_table', 80),
(142, '2025_11_16_215803_remove_department_id_from_igas_table', 81),
(143, '2025_11_17_150846_remove_department_id_from_student_outcomes_table', 82),
(144, '2025_11_18_004228_add_department_id_to_student_outcomes_table', 83),
(145, '2025_11_19_000000_add_department_id_to_general_information_table', 84),
(146, '2025_11_20_000000_add_constraint_mission_vision_university_wide', 85),
(147, '2025_11_20_000001_drop_old_section_unique_constraint', 86),
(149, '2025_11_22_084722_drop_extra_ilo_so_cpa_tables', 87),
(150, '2025_11_23_034301_add_so_columns_to_syllabi_table', 88),
(154, '2025_11_24_010733_create_syllabi_ilo_iga_table', 89),
(155, '2025_11_24_110551_add_iga_columns_to_syllabi_table', 89),
(157, '2025_11_26_102630_add_cdio_sdg_labels_to_syllabus_ilo_cdio_sdg_table', 90),
(158, '2025_11_26_103312_drop_cdio_sdg_labels_from_syllabus_ilo_cdio_sdg_table', 91),
(159, '2025_11_26_102130_add_cdio_sdg_columns_to_syllabi_table', 92),
(160, '2025_11_27_003819_add_status_fields_to_syllabi_table', 92),
(161, '2025_11_27_100000_create_faculty_syllabus_table', 93),
(166, '2025_11_27_040322_add_submission_status_to_syllabi_table', 94),
(167, '2025_11_27_040554_create_syllabus_submissions_table', 94),
(168, '2025_11_27_015314_remove_faculty_id_from_syllabi_table', 95),
(170, '2025_11_28_000001_create_syllabus_comments_table', 96),
(171, '2025_11_29_021232_add_faculty_id_to_syllabi_table', 97),
(172, '2025_12_02_120000_extend_submission_status_enum', 98),
(173, '2025_12_02_120100_extend_submission_history_enums', 99),
(174, '2025_12_06_000000_create_superadmins_table', 100),
(175, '2025_12_06_010000_add_email_to_superadmins', 100),
(176, '2025_12_07_000100_add_email_to_super_admins', 100),
(177, '2025_12_10_120000_alter_syllabus_textbooks_nullable_file_path', 100);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('04de64e2-d5bd-4af1-a3cb-d3d3e0024a3d', 'App\\Notifications\\FacultyRoleRequestNotification', 'App\\Models\\User', 108, '{\"chair_request_id\":76,\"requester_name\":\"PABLICO ADRIANE ALLEN\",\"requester_email\":\"22-77551@g.batstate-u.edu.ph\",\"department_name\":\"College of Informatics and Computing Science\",\"requested_role\":\"FACULTY\",\"message\":\"New faculty member request from PABLICO ADRIANE ALLEN for College of Informatics and Computing Science\"}', NULL, '2025-10-18 10:59:13', '2025-10-18 10:59:13'),
('2c8bc1c2-a522-4dcc-a5c9-16f23b18251a', 'App\\Notifications\\FacultyRoleRequestNotification', 'App\\Models\\User', 120, '{\"chair_request_id\":83,\"requester_name\":\"PABLICO ADRIANE ALLEN\",\"requester_email\":\"22-77551@g.batstate-u.edu.ph\",\"department_name\":\"College of Informatics and Computing Science\",\"requested_role\":\"FACULTY\",\"message\":\"New faculty member request from PABLICO ADRIANE ALLEN for College of Informatics and Computing Science\"}', NULL, '2025-10-19 11:42:18', '2025-10-19 11:42:18'),
('2e0d647a-f0a7-4b23-b99a-1a955b6e939d', 'App\\Notifications\\FacultyRoleRequestNotification', 'App\\Models\\User', 120, '{\"chair_request_id\":84,\"requester_name\":\"PABLICO ADRIANE ALLEN\",\"requester_email\":\"22-77551@g.batstate-u.edu.ph\",\"department_name\":\"College of Informatics and Computing Science\",\"requested_role\":\"FACULTY\",\"message\":\"New faculty member request from PABLICO ADRIANE ALLEN for College of Informatics and Computing Science\"}', NULL, '2025-10-23 03:02:50', '2025-10-23 03:02:50'),
('84b5100e-fe4a-4452-afcc-b8cb7c920b72', 'App\\Notifications\\FacultyRoleRequestNotification', 'App\\Models\\User', 108, '{\"chair_request_id\":78,\"requester_name\":\"PABLICO ADRIANE ALLEN\",\"requester_email\":\"22-77551@g.batstate-u.edu.ph\",\"department_name\":\"College of Informatics and Computing Science\",\"requested_role\":\"FACULTY\",\"message\":\"New faculty member request from PABLICO ADRIANE ALLEN for College of Informatics and Computing Science\"}', NULL, '2025-10-18 11:58:59', '2025-10-18 11:58:59'),
('b9e086a9-1d82-43b1-ad26-596a71e1c12c', 'App\\Notifications\\FacultyRoleRequestNotification', 'App\\Models\\User', 108, '{\"chair_request_id\":79,\"requester_name\":\"PABLICO ADRIANE ALLEN\",\"requester_email\":\"22-77551@g.batstate-u.edu.ph\",\"department_name\":\"College of Informatics and Computing Science\",\"requested_role\":\"FACULTY\",\"message\":\"New faculty member request from PABLICO ADRIANE ALLEN for College of Informatics and Computing Science\"}', NULL, '2025-10-18 13:06:32', '2025-10-18 13:06:32');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `department_id`, `created_by`, `name`, `code`, `description`, `status`, `created_at`, `updated_at`) VALUES
(103, 80, NULL, 'Bachelor of Science in Information Technology', 'BSIT', NULL, 'active', '2025-11-03 08:46:34', '2025-12-04 11:10:09'),
(114, 99, 240, 'Bachelor of Science in Accountancy', 'BSA', NULL, 'active', '2025-12-11 03:26:11', '2025-12-11 03:26:11'),
(115, 100, 239, 'Bachelor of Science in Nursing', 'BSN', NULL, 'active', '2025-12-11 05:01:55', '2025-12-11 05:01:55'),
(116, 100, 239, 'Bachelor of Science in Nutrition and Dietetics', 'BSND', NULL, 'active', '2025-12-11 05:02:36', '2025-12-11 05:02:36'),
(117, 101, 239, 'Bachelor of Science in Criminology', 'BSC', NULL, 'active', '2025-12-11 05:04:53', '2025-12-11 05:04:53'),
(118, 98, 239, 'Bachelor of Arts in Communication', 'BAC', NULL, 'active', '2025-12-11 05:05:58', '2025-12-11 05:05:58'),
(119, 98, 239, 'Bachelor of Science in Food Technology', 'BSFT', NULL, 'active', '2025-12-11 05:06:33', '2025-12-11 05:06:33'),
(120, 98, 239, 'Bachelor of Science in Psychology', 'BSP', NULL, 'active', '2025-12-11 05:06:52', '2025-12-11 05:06:52'),
(121, 98, 239, 'Bachelor of Science in Fisheries and Aquatic Sciences', 'BFAS', NULL, 'active', '2025-12-11 05:07:17', '2025-12-11 05:07:17'),
(122, 85, 239, 'Bachelor of Secondary Education major in English', 'BSEd (English)', NULL, 'active', '2025-12-11 05:09:32', '2025-12-11 05:09:32'),
(123, 85, 239, 'Bachelor of Secondary Education major in Mathematics', 'BSEd (Mathematics)', NULL, 'active', '2025-12-11 05:10:03', '2025-12-11 05:10:03');

-- --------------------------------------------------------

--
-- Table structure for table `sdgs`
--

CREATE TABLE `sdgs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sdgs`
--

INSERT INTO `sdgs` (`id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\r\n harnessing their deep aspirations.', '2025-07-22 04:37:43', '2025-11-07 04:19:51'),
(2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\r\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\r\n their world views by having them reflect on unsustainable practices.', '2025-07-22 04:37:59', '2025-11-06 02:20:00'),
(3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \r\ncomplex situations.', '2025-07-22 04:38:50', '2025-08-15 09:50:47'),
(4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\r\n commitment to sustainable action through education and learning.', '2025-07-22 04:39:05', '2025-08-15 09:50:47'),
(5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-07-22 04:39:26', '2025-08-15 09:50:47');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('jqX4vRcVv0JkKynfoBwbpFbqyseEZgOMQbSpZyyt', 229, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoieVY5QmFWU2V6UkhnVktPT0h1WEdwV2RsdWlPTFI0T3htSEVNUUpWaCI7czo1NDoibG9naW5fZmFjdWx0eV81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjIyOTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo2MToiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2ZhY3VsdHkvc3lsbGFiaS8yNzQvYXNzZXNzbWVudC1tYXBwaW5ncyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1766858074);

-- --------------------------------------------------------

--
-- Table structure for table `so`
--

CREATE TABLE `so` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_outcomes`
--

CREATE TABLE `student_outcomes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_outcomes`
--

INSERT INTO `student_outcomes` (`id`, `department_id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(38, 80, NULL, 'Ability to analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions.', '2025-12-02 20:37:37', '2025-12-02 20:37:37'),
(39, 80, NULL, 'Ability to design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program’s discipline.', '2025-12-02 20:37:54', '2025-12-02 20:37:54'),
(40, 80, NULL, 'Ability to communicate effectively in a variety of professional contexts.', '2025-12-02 20:38:13', '2025-12-02 20:38:13'),
(41, 80, NULL, 'Ability to recognize professional responsibilities and make informed judgments in computing practice based on legal and ethical principles.', '2025-12-02 20:38:38', '2025-12-02 20:38:38'),
(43, 80, NULL, 'Ability to function effectively as a member or leader of a team engaged in activities appropriate to the program’s discipline.', '2025-12-02 20:39:43', '2025-12-02 20:39:43'),
(44, 80, NULL, 'Ability to identify and analyze user needs and take them into account in the selection, creation, integration, evaluation, and administration of computing-based systems.', '2025-12-02 20:39:49', '2025-12-02 20:39:49');

-- --------------------------------------------------------

--
-- Table structure for table `superadmins`
--

CREATE TABLE `superadmins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `superadmins`
--

INSERT INTO `superadmins` (`id`, `username`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', NULL, NULL, '$2y$12$DtIYShfYRJ3hf1dZOSzb3.u9Kir7qfjOkoA/peEsFmaZSUO.jH/aO', '2025-12-10 06:36:29', '2025-12-10 06:36:29');

-- --------------------------------------------------------

--
-- Table structure for table `super_admins`
--

CREATE TABLE `super_admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `super_admins`
--

INSERT INTO `super_admins` (`id`, `username`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', '22-70787@g.batstate-u.edu.ph', '2025-12-07 05:26:51', '$2y$12$lEkfcUyTYxpIfTgdwXcASuf5.5YOb4vPORu6qs9ucVHlcF2Lr0qMS', '2025-12-06 03:12:05', '2025-12-07 06:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `syllabi`
--

CREATE TABLE `syllabi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `program_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `academic_year` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `year_level` varchar(255) NOT NULL,
  `submission_status` enum('draft','pending_review','revision','approved','final_approval','final_approved') NOT NULL DEFAULT 'draft',
  `submission_remarks` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `textbook_file_path` varchar(255) DEFAULT NULL,
  `assessment_tasks_data` text DEFAULT NULL,
  `ilo_so_cpa_data` text DEFAULT NULL,
  `so_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`so_columns`)),
  `iga_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`iga_columns`)),
  `cdio_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cdio_columns`)),
  `sdg_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sdg_columns`)),
  `prepared_by_name` varchar(255) DEFAULT NULL,
  `prepared_by_title` varchar(255) DEFAULT NULL,
  `prepared_by_date` date DEFAULT NULL,
  `reviewed_by_name` varchar(255) DEFAULT NULL,
  `reviewed_by_title` varchar(255) DEFAULT NULL,
  `reviewed_by_date` date DEFAULT NULL,
  `approved_by_name` varchar(255) DEFAULT NULL,
  `approved_by_title` varchar(255) DEFAULT NULL,
  `approved_by_date` date DEFAULT NULL,
  `status_remarks` text DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabi`
--

INSERT INTO `syllabi` (`id`, `faculty_id`, `program_id`, `course_id`, `title`, `academic_year`, `semester`, `year_level`, `submission_status`, `submission_remarks`, `submitted_at`, `created_at`, `updated_at`, `textbook_file_path`, `assessment_tasks_data`, `ilo_so_cpa_data`, `so_columns`, `iga_columns`, `cdio_columns`, `sdg_columns`, `prepared_by_name`, `prepared_by_title`, `prepared_by_date`, `reviewed_by_name`, `reviewed_by_title`, `reviewed_by_date`, `approved_by_name`, `approved_by_title`, `approved_by_date`, `status_remarks`, `reviewed_by`, `reviewed_at`) VALUES
(266, 221, 103, 86, 'fsdf', '2025-2026', '1st Semester', '2nd Year', 'draft', NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEREYRA MATTHEW ALEN', 'Professor 1', '2025-12-06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(268, 229, 103, 86, 'CIS for BAT 401', '2025-2026', '1st Semester', '1st Year', 'approved', NULL, '2025-12-07 05:03:34', '2025-12-07 03:59:48', '2025-12-07 05:19:04', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":\"Lecture\",\"main_row\":{\"code\":\"LEC\",\"task\":\"Lecture\",\"percent\":40},\"main_ilo_columns\":[\"\",\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"ME\",\"task\":\"Midterm Exam\",\"ird\":\"I\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[70,null,null]},{\"code\":\"FE\",\"task\":\"Final Exam\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[70,null,null]},{\"code\":\"Q\",\"task\":\"Quizzes\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[100,null,null]},{\"code\":\"AS\",\"task\":\"Assignment\",\"ird\":\"I/R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[200,null,null]},{\"code\":\"PR\",\"task\":\"Project\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[70,30,null]}]},{\"section_num\":2,\"section_label\":\"Laboratory\",\"main_row\":{\"code\":\"LAB\",\"task\":\"Laboratory\",\"percent\":60},\"main_ilo_columns\":[\"\",\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"LE\",\"task\":\"Laboratory Exercises\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[null,1400,null]},{\"code\":\"LEX\",\"task\":\"Laboratory Exams\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\"],\"cpa_columns\":[100,100,null]}]}]}', NULL, '[\"SO1\",\"SO3\"]', NULL, NULL, NULL, 'PABLICO ADRIANE ALLEN', 'Professor 1', '2025-12-07', NULL, NULL, '2025-12-07', NULL, NULL, NULL, NULL, 231, NULL),
(269, 231, 103, 90, 'CIS - CSS 111', '2025-2026', '1st Semester', '1st Year', 'pending_review', NULL, '2025-12-08 06:29:22', '2025-12-07 08:19:23', '2025-12-08 06:29:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'BENITEZ SHANE ANN', 'Assistant Professor', '2025-12-07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 221, NULL),
(271, 227, 103, 90, 'CIS - CS 111', '2025-2026', '2nd Semester', '1st Year', 'final_approval', NULL, '2025-12-08 09:57:13', '2025-12-08 09:44:17', '2025-12-08 10:00:02', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]},{\"section_num\":2,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'MATUNDAN JAYLORD', 'dsfdsfdsf', '2025-12-08', NULL, NULL, '2025-12-08', 'BENITEZ SHANE ANN', NULL, '2025-12-08', NULL, 231, NULL),
(272, 235, 103, 94, 'IT 121 Advanced ComProg Syllabus', '2026-2027', '1st Semester', '1st Year', 'approved', NULL, '2025-12-08 13:38:59', '2025-12-08 13:36:43', '2025-12-14 19:37:28', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]},{\"section_num\":2,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]},{\"section_num\":3,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'Jason Magsino', 'Lecturer I', '2025-12-08', NULL, NULL, '2025-12-14', NULL, NULL, NULL, NULL, 234, NULL),
(274, 229, 113, 86, 'sdfsd', '2025-2026', '1st Semester', '1st Year', 'draft', NULL, NULL, '2025-12-10 05:16:41', '2025-12-27 08:54:01', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":null,\"main_row\":{\"code\":\"\",\"task\":\"\",\"percent\":null},\"main_ilo_columns\":[\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'Adriane Allen P. Pablico', 'Professor 1', '2025-12-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 231, 103, 90, 'CS 111', '2025-2026', '2nd Semester', '1st Year', 'final_approval', NULL, '2025-12-10 06:04:14', '2025-12-10 05:24:38', '2025-12-10 06:08:05', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":\"Lecture\",\"main_row\":{\"code\":\"\",\"task\":\"Lecture\",\"percent\":40},\"main_ilo_columns\":[\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"Major Exams (Midterm and Final)\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"\",\"task\":\"Quizzes / Chapter Tests\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"\",\"task\":\"Attendance / Recitation\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"\",\"task\":\"Projects\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]}]},{\"section_num\":2,\"section_label\":\"Laboratory\",\"main_row\":{\"code\":\"\",\"task\":\"Laboratory\",\"percent\":60},\"main_ilo_columns\":[\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"Laboratory Exercises\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"\",\"task\":\"Laboratory Projects/Exams\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'BENITEZ SHANE ANN', 'Assistant Professor', '2025-12-10', NULL, NULL, '2025-12-10', 'DECILOS GLENMOR', 'Associate Dean', '2025-12-10', NULL, 236, NULL),
(277, 236, 103, 86, 'fb', '2025-2026', '1st Semester', '2nd Year', 'draft', NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 07:58:24', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":\"Lecture\",\"main_row\":{\"code\":\"\",\"task\":\"Lecture\",\"percent\":40},\"main_ilo_columns\":[\"\",\"\",\"\",\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"\",\"task\":\"Major Exams (Midterm and Final) 40%\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"\",\"task\":\"\",\"ird\":\"\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\",\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'DECILOS GLENMOR', 'Assoc. Prof.', '2025-12-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(278, 231, 103, 90, 'CS 111', '2025-2026', '1st Semester', '1st Year', 'draft', NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'BENITEZ SHANE ANN', 'Assistant Professor', '2025-12-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(279, 234, 103, 90, 'CS 111', '2025-2026', '2nd Semester', '1st Year', 'draft', NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CERTEZA CINDY', 'Associate  Professor', '2025-12-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(280, 234, 103, 90, 'CS 111', '2025-2026', '2nd Semester', '1st Year', 'pending_review', NULL, '2025-12-11 03:54:30', '2025-12-11 02:23:14', '2025-12-11 03:54:30', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":\"Lecture\",\"main_row\":{\"code\":\"LEC\",\"task\":\"Lecture\",\"percent\":40},\"main_ilo_columns\":[\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"ME\",\"task\":\"Major Exams (Midterm and Final)\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"35\",\"35\",\"30\"],\"cpa_columns\":[100,null,null]},{\"code\":\"QCT\",\"task\":\"Quizzes / Chapter Tests\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"40\",\"30\",\"30\"],\"cpa_columns\":[100,null,null]},{\"code\":\"AR\",\"task\":\"Attendance / Recitation\",\"ird\":\"I/R\",\"percent\":null,\"ilo_columns\":[\"40\",\"30\",\"30 \"],\"cpa_columns\":[100,null,null]},{\"code\":\"PR\",\"task\":\"Projects\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"100\"],\"cpa_columns\":[null,100,null]}]},{\"section_num\":2,\"section_label\":\"Laboratory\",\"main_row\":{\"code\":\"LAB\",\"task\":\"Laboratory\",\"percent\":60},\"main_ilo_columns\":[\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"LE\",\"task\":\"Laboratory Exercises\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"40\",\"20\",\"40\"],\"cpa_columns\":[null,100,null]},{\"code\":\"LPE\",\"task\":\"Laboratory Projects/Exams\",\"ird\":\"D\",\"percent\":null,\"ilo_columns\":[\"25\",\"25\",\"50\"],\"cpa_columns\":[null,100,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'CERTEZA CINDY', 'Associate  Professor', '2025-12-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 231, NULL),
(281, 240, 114, 95, 'Syllabus in ACC 101', '2025-2026', '1st Semester', '1st Year', 'draft', NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Alvin Andulan', 'BSA and BSMA Department Chair', '2025-12-11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(283, 231, 103, 88, 'CIS CS 111', '2025-2026', '2nd Semester', '1st Year', 'approved', NULL, '2025-12-14 19:37:19', '2025-12-14 19:27:14', '2025-12-14 19:37:40', NULL, '{\"sections\":[{\"section_num\":1,\"section_label\":\"Lecture\",\"main_row\":{\"code\":\"LEC\",\"task\":\"Lecture\",\"percent\":40},\"main_ilo_columns\":[\"\",\"\",\"\"],\"sub_rows\":[{\"code\":\"ME\",\"task\":\"Major Exams (Midterm and Final)\",\"ird\":\"I\",\"percent\":null,\"ilo_columns\":[\"35\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"QCT\",\"task\":\"Quizzes / Chapter Tests\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"AR\",\"task\":\"Attendance / Recitation\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"PR\",\"task\":\"Projects\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]}]},{\"section_num\":2,\"section_label\":\"Laboratory\",\"main_row\":{\"code\":\"LAB\",\"task\":\"Laboratory\",\"percent\":60},\"main_ilo_columns\":[\"da\",\"\",\"\"],\"sub_rows\":[{\"code\":\"LE\",\"task\":\"Laboratory Exercises\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]},{\"code\":\"LPE\",\"task\":\"Laboratory Projects/Exams\",\"ird\":\"R\",\"percent\":null,\"ilo_columns\":[\"\",\"\",\"\"],\"cpa_columns\":[null,null,null]}]}]}', NULL, '[]', NULL, NULL, NULL, 'BENITEZ SHANE ANN', 'Assistant Professor', '2025-12-14', NULL, NULL, '2025-12-14', NULL, NULL, NULL, NULL, 234, NULL),
(284, 229, 114, 88, 'IT 111 – Introduction to Computing (2025-2026, 1st Semester)', '2025-2026', '1st Semester', '1st Year', 'draft', NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Adriane Allen P. Pablico', 'Professor 1', '2025-12-27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_assessment_mappings`
--

CREATE TABLE `syllabus_assessment_mappings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `week_marks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`week_marks`)),
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_assessment_mappings`
--

INSERT INTO `syllabus_assessment_mappings` (`id`, `syllabus_id`, `name`, `week_marks`, `position`, `created_at`, `updated_at`) VALUES
(1988, 268, 'Midterm Exam', '{\"1\":null}', 0, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1989, 268, 'Final Exam', '{\"1\":null}', 1, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1990, 268, 'Quizzes', '{\"1\":\"x\"}', 2, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1991, 268, 'Assignment', '{\"1\":\"x\"}', 3, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1992, 268, 'Project', '{\"1\":null}', 4, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1993, 268, 'Laboratory Exercises', '{\"1\":null}', 5, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(1994, 268, 'Laboratory Exams', '{\"1\":null}', 6, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2073, 275, 'Major Exams (Midterm and Final)', '[]', 0, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2074, 275, 'Quizzes / Chapter Tests', '[]', 1, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2075, 275, 'Attendance / Recitation', '[]', 2, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2076, 275, 'Projects', '[]', 3, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2077, 275, 'Laboratory Exercises', '[]', 4, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2078, 275, 'Laboratory Projects/Exams', '[]', 5, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2079, 277, 'Major Exams (Midterm and Final) 40%', '[]', 0, '2025-12-10 07:58:23', '2025-12-10 07:58:23'),
(2112, 280, 'Major Exams (Midterm and Final)', '{\"1\":null}', 0, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2113, 280, 'Quizzes / Chapter Tests', '{\"1\":null}', 1, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2114, 280, 'Attendance / Recitation', '{\"1\":\"x\"}', 2, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2115, 280, 'Projects', '{\"1\":null}', 3, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2116, 280, 'Laboratory Exercises', '{\"1\":null}', 4, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2117, 280, 'Laboratory Projects/Exams', '{\"1\":null}', 5, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2148, 283, 'Major Exams (Midterm and Final)', '[]', 0, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2149, 283, 'Quizzes / Chapter Tests', '[]', 1, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2150, 283, 'Attendance / Recitation', '[]', 2, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2151, 283, 'Projects', '[]', 3, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2152, 283, 'Laboratory Exercises', '[]', 4, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2153, 283, 'Laboratory Projects/Exams', '[]', 5, '2025-12-14 19:37:16', '2025-12-14 19:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_assessment_tasks`
--

CREATE TABLE `syllabus_assessment_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `section_number` int(11) DEFAULT NULL,
  `row_type` enum('main','sub') NOT NULL DEFAULT 'sub',
  `section_legacy` varchar(255) DEFAULT NULL,
  `section_label` varchar(255) DEFAULT NULL,
  `code` varchar(32) DEFAULT NULL,
  `task` text DEFAULT NULL,
  `ird` varchar(16) DEFAULT NULL,
  `percent` decimal(8,2) DEFAULT NULL,
  `ilo_flags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ilo_flags`)),
  `c` text DEFAULT NULL,
  `p` text DEFAULT NULL,
  `a` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_assessment_tasks`
--

INSERT INTO `syllabus_assessment_tasks` (`id`, `syllabus_id`, `section_number`, `row_type`, `section_legacy`, `section_label`, `code`, `task`, `ird`, `percent`, `ilo_flags`, `c`, `p`, `a`, `position`, `created_at`, `updated_at`) VALUES
(2311, 268, 1, 'main', 'Section 1', 'Lecture', 'LEC', 'Lecture', NULL, 40.00, '[null,null,null,null]', NULL, NULL, NULL, 0, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2312, 268, 1, 'sub', 'Section 1', 'Lecture', 'ME', 'Midterm Exam', 'I', NULL, '[null,null,null,null]', '70', NULL, NULL, 1, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2313, 268, 1, 'sub', 'Section 1', 'Lecture', 'FE', 'Final Exam', 'R', NULL, '[null,null,null,null]', '70', NULL, NULL, 2, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2314, 268, 1, 'sub', 'Section 1', 'Lecture', 'Q', 'Quizzes', 'R', NULL, '[null,null,null,null]', '100', NULL, NULL, 3, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2315, 268, 1, 'sub', 'Section 1', 'Lecture', 'AS', 'Assignment', 'I/R', NULL, '[null,null,null,null]', '200', NULL, NULL, 4, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2316, 268, 1, 'sub', 'Section 1', 'Lecture', 'PR', 'Project', 'D', NULL, '[null,null,null,null]', '70', '30', NULL, 5, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2317, 268, 2, 'main', 'Section 2', 'Laboratory', 'LAB', 'Laboratory', NULL, 60.00, '[null,null,null,null]', NULL, NULL, NULL, 6, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2318, 268, 2, 'sub', 'Section 2', 'Laboratory', 'LE', 'Laboratory Exercises', 'D', NULL, '[null,null,null,null]', NULL, '1400', NULL, 7, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2319, 268, 2, 'sub', 'Section 2', 'Laboratory', 'LEX', 'Laboratory Exams', 'D', NULL, '[null,null,null,null]', '100', '100', NULL, 8, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(2424, 275, 1, 'main', 'Section 1', 'Lecture', NULL, 'Lecture', NULL, 40.00, '[null,null,null]', NULL, NULL, NULL, 0, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2425, 275, 1, 'sub', 'Section 1', 'Lecture', NULL, 'Major Exams (Midterm and Final)', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 1, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2426, 275, 1, 'sub', 'Section 1', 'Lecture', NULL, 'Quizzes / Chapter Tests', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 2, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2427, 275, 1, 'sub', 'Section 1', 'Lecture', NULL, 'Attendance / Recitation', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 3, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2428, 275, 1, 'sub', 'Section 1', 'Lecture', NULL, 'Projects', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 4, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2429, 275, 2, 'main', 'Section 2', 'Laboratory', NULL, 'Laboratory', NULL, 60.00, '[null,null,null]', NULL, NULL, NULL, 5, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2430, 275, 2, 'sub', 'Section 2', 'Laboratory', NULL, 'Laboratory Exercises', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 6, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2431, 275, 2, 'sub', 'Section 2', 'Laboratory', NULL, 'Laboratory Projects/Exams', NULL, NULL, '[null,null,null]', NULL, NULL, NULL, 7, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2432, 277, 1, 'main', 'Section 1', 'Lecture', NULL, 'Lecture', NULL, 40.00, '[null,null,null,null,null,null]', NULL, NULL, NULL, 0, '2025-12-10 07:58:23', '2025-12-10 07:58:23'),
(2434, 277, 1, 'sub', 'Section 1', 'Lecture', NULL, 'Major Exams (Midterm and Final) 40%', NULL, NULL, '[null,null,null,null,null,null]', NULL, NULL, NULL, 1, '2025-12-10 07:58:23', '2025-12-10 07:58:23'),
(2480, 280, 1, 'main', 'Section 1', 'Lecture', 'LEC', 'Lecture', NULL, 40.00, '[null,null,null]', NULL, NULL, NULL, 0, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2481, 280, 1, 'sub', 'Section 1', 'Lecture', 'ME', 'Major Exams (Midterm and Final)', 'R', NULL, '[\"35\",\"35\",\"30\"]', '100', NULL, NULL, 1, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2482, 280, 1, 'sub', 'Section 1', 'Lecture', 'QCT', 'Quizzes / Chapter Tests', 'R', NULL, '[\"40\",\"30\",\"30\"]', '100', NULL, NULL, 2, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2483, 280, 1, 'sub', 'Section 1', 'Lecture', 'AR', 'Attendance / Recitation', 'I/R', NULL, '[\"40\",\"30\",\"30\"]', '100', NULL, NULL, 3, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2484, 280, 1, 'sub', 'Section 1', 'Lecture', 'PR', 'Projects', 'D', NULL, '[null,null,\"100\"]', NULL, '100', NULL, 4, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2485, 280, 2, 'main', 'Section 2', 'Laboratory', 'LAB', 'Laboratory', NULL, 60.00, '[null,null,null]', NULL, NULL, NULL, 5, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2486, 280, 2, 'sub', 'Section 2', 'Laboratory', 'LE', 'Laboratory Exercises', 'D', NULL, '[\"40\",\"20\",\"40\"]', NULL, '100', NULL, 6, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2487, 280, 2, 'sub', 'Section 2', 'Laboratory', 'LPE', 'Laboratory Projects/Exams', 'D', NULL, '[\"25\",\"25\",\"50\"]', NULL, '100', NULL, 7, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2528, 283, 1, 'main', 'Section 1', 'Lecture', 'LEC', 'Lecture', NULL, 40.00, '[null,null,null]', NULL, NULL, NULL, 0, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2529, 283, 1, 'sub', 'Section 1', 'Lecture', 'ME', 'Major Exams (Midterm and Final)', 'I', NULL, '[\"35\",null,null]', NULL, NULL, NULL, 1, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2530, 283, 1, 'sub', 'Section 1', 'Lecture', 'QCT', 'Quizzes / Chapter Tests', 'R', NULL, '[null,null,null]', NULL, NULL, NULL, 2, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2531, 283, 1, 'sub', 'Section 1', 'Lecture', 'AR', 'Attendance / Recitation', 'R', NULL, '[null,null,null]', NULL, NULL, NULL, 3, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2532, 283, 1, 'sub', 'Section 1', 'Lecture', 'PR', 'Projects', 'R', NULL, '[null,null,null]', NULL, NULL, NULL, 4, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2533, 283, 2, 'main', 'Section 2', 'Laboratory', 'LAB', 'Laboratory', NULL, 60.00, '[\"da\",null,null]', NULL, NULL, NULL, 5, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2534, 283, 2, 'sub', 'Section 2', 'Laboratory', 'LE', 'Laboratory Exercises', 'R', NULL, '[null,null,null]', NULL, NULL, NULL, 6, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2535, 283, 2, 'sub', 'Section 2', 'Laboratory', 'LPE', 'Laboratory Projects/Exams', 'R', NULL, '[null,null,null]', NULL, NULL, NULL, 7, '2025-12-14 19:37:16', '2025-12-14 19:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_cdios`
--

CREATE TABLE `syllabus_cdios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_cdios`
--

INSERT INTO `syllabus_cdios` (`id`, `syllabus_id`, `code`, `title`, `description`, `position`, `created_at`, `updated_at`) VALUES
(2369, 268, 'CDIO1', 'Disciplinary Knowledge & Reasonin', 'Knowledge of underlying mathematics and sciences, core engineering fundamental knowledge, advanced engineering fundamental knowledge, methods, and tools.', 1, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(2370, 268, 'CDIO2', 'Personal and Professional Skills & Attributes', 'Analytical reasoning and problem solving; experimentation, investigation, and knowledge discovery; system thinking; attitudes, thoughts, and learning; ethics, equity, and other responsibilities.', 2, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(2371, 268, 'CDIO3', 'Interpersonal Skills: Teamwork & Communication', 'Teamwork, communications, communication in a foreign language.', 3, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(2372, 269, 'CDIO1', 'Disciplinary Knowledge & Reasonin', 'Knowledge of underlying mathematics and sciences, core engineering fundamental knowledge, advanced engineering fundamental knowledge, methods, and tools.', 1, '2025-12-07 08:29:28', '2025-12-07 08:29:28'),
(2373, 269, 'CDIO2', 'Personal and Professional Skills & Attributes', 'Analytical reasoning and problem solving; experimentation, investigation, and knowledge discovery; system thinking; attitudes, thoughts, and learning; ethics, equity, and other responsibilities.', 2, '2025-12-07 08:29:28', '2025-12-07 08:29:28'),
(2374, 269, 'CDIO3', 'Interpersonal Skills: Teamwork & Communication', 'Teamwork, communications, communication in a foreign language.', 3, '2025-12-07 08:29:28', '2025-12-07 08:29:28'),
(2376, 271, 'CDIO1', NULL, NULL, 1, '2025-12-08 09:59:50', '2025-12-08 09:59:50'),
(2378, 272, 'CDIO1', NULL, NULL, 1, '2025-12-08 13:38:15', '2025-12-08 13:38:15'),
(2421, 275, 'CDIO1', 'Disciplinary Knowledge & Reasonin', 'Knowledge of underlying mathematics and sciences, core engineering fundamental knowledge, advanced engineering fundamental knowledge, methods, and tools.', 1, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2422, 275, 'CDIO2', 'Personal and Professional Skills & Attributes', 'Analytical reasoning and problem solving; experimentation, investigation, and knowledge discovery; system thinking; attitudes, thoughts, and learning; ethics, equity, and other responsibilities.', 2, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2423, 275, 'CDIO3', 'Interpersonal Skills: Teamwork & Communication', 'Teamwork, communications, communication in a foreign language.', 3, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(2424, 277, 'CDIO1', NULL, NULL, 1, '2025-12-10 07:58:23', '2025-12-10 07:58:23'),
(2425, 277, 'CDIO1', NULL, NULL, 1, '2025-12-10 07:58:23', '2025-12-10 07:58:23'),
(2446, 280, 'CDIO1', 'Disciplinary Knowledge & Reasonin', 'Knowledge of underlying mathematics and sciences, core engineering fundamental knowledge, advanced engineering fundamental knowledge, methods, and tools.', 1, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2447, 280, 'CDIO2', 'Personal and Professional Skills & Attributes', 'Analytical reasoning and problem solving; experimentation, investigation, and knowledge discovery; system thinking; attitudes, thoughts, and learning; ethics, equity, and other responsibilities.', 2, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2448, 280, 'CDIO3', 'Interpersonal Skills: Teamwork & Communication', 'Teamwork, communications, communication in a foreign language.', 3, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(2455, 283, 'CDIO1', NULL, NULL, 1, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2456, 283, 'CDIO2', NULL, NULL, 2, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(2475, 274, 'CDIO1', NULL, NULL, 1, '2025-12-27 08:53:45', '2025-12-27 08:53:45');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_comments`
--

CREATE TABLE `syllabus_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `partial_key` varchar(64) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'draft',
  `batch` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_comments`
--

INSERT INTO `syllabus_comments` (`id`, `syllabus_id`, `partial_key`, `title`, `body`, `status`, `batch`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 199, 'course-info', 'Course Info', 'aa', 'draft', 1, 139, 139, '2025-11-28 19:19:24', '2025-11-28 19:19:24'),
(2, 199, 'mission-vision', 'Mission Vision', 'aa', 'draft', 2, 139, 139, '2025-11-28 19:22:16', '2025-11-28 19:22:16'),
(3, 199, 'course-info', 'Course Info', 'aa', 'draft', 2, 139, 139, '2025-11-28 19:22:18', '2025-11-28 19:22:18'),
(4, 200, 'mission-vision', 'Mission Vision', 'mission', 'draft', 1, 139, 139, '2025-11-28 21:43:04', '2025-11-28 21:43:04'),
(5, 200, 'criteria-assessment', 'Criteria Assessment', 'make it', 'draft', 1, 139, 139, '2025-11-28 21:43:09', '2025-11-28 21:43:09'),
(6, 201, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 139, 139, '2025-11-28 22:05:13', '2025-11-28 22:05:13'),
(7, 202, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 139, 139, '2025-11-28 22:08:06', '2025-11-28 22:08:06'),
(8, 202, 'mission-vision', 'Mission Vision', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'draft', 2, 139, 139, '2025-11-28 22:08:54', '2025-11-28 22:09:01'),
(9, 202, 'mission-vision', 'Mission Vision', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:35', '2025-11-28 22:10:35'),
(10, 202, 'course-info', 'Course Info', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:35', '2025-11-28 22:10:35'),
(11, 202, 'criteria-assessment', 'Criteria Assessment', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:35', '2025-11-28 22:10:35'),
(12, 202, 'ilo', 'Ilo', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:36', '2025-11-28 22:10:36'),
(13, 202, 'tlas', 'Tlas', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:36', '2025-11-28 22:10:36'),
(14, 202, 'assessment-tasks-distribution', 'Assessment Tasks Distribution', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:36', '2025-11-28 22:10:36'),
(15, 202, 'textbook-upload', 'Textbook Upload', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:36', '2025-11-28 22:10:36'),
(16, 202, 'iga', 'Iga', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:37', '2025-11-28 22:10:37'),
(17, 202, 'so', 'So', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:37', '2025-11-28 22:10:37'),
(18, 202, 'cdio', 'Cdio', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:37', '2025-11-28 22:10:37'),
(19, 202, 'sdg', 'Sdg', NULL, 'draft', 3, 139, 139, '2025-11-28 22:10:38', '2025-11-28 22:10:38'),
(20, 202, 'mission-vision', 'Mission Vision', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:10', '2025-11-28 22:12:10'),
(21, 202, 'course-info', 'Course Info', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:10', '2025-11-28 22:12:10'),
(22, 202, 'criteria-assessment', 'Criteria Assessment', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:11', '2025-11-28 22:12:11'),
(23, 202, 'ilo', 'Ilo', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:11', '2025-11-28 22:12:11'),
(24, 202, 'assessment-tasks-distribution', 'Assessment Tasks Distribution', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:11', '2025-11-28 22:12:11'),
(25, 202, 'cdio', 'Cdio', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:11', '2025-11-28 22:12:11'),
(26, 202, 'sdg', 'Sdg', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:12', '2025-11-28 22:12:12'),
(27, 202, 'course-policies', 'Course Policies', NULL, 'draft', 4, 139, 139, '2025-11-28 22:12:12', '2025-11-28 22:12:12'),
(28, 202, 'mission-vision', 'Mission Vision', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'draft', 5, 139, 139, '2025-11-28 22:12:50', '2025-11-28 22:12:50'),
(29, 202, 'course-info', 'Course Info', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:51', '2025-11-28 22:12:51'),
(30, 202, 'criteria-assessment', 'Criteria Assessment', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:51', '2025-11-28 22:12:51'),
(31, 202, 'ilo', 'Ilo', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:52', '2025-11-28 22:12:52'),
(32, 202, 'assessment-tasks-distribution', 'Assessment Tasks Distribution', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:52', '2025-11-28 22:12:52'),
(33, 202, 'textbook-upload', 'Textbook Upload', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:52', '2025-11-28 22:12:52'),
(34, 202, 'iga', 'Iga', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:53', '2025-11-28 22:12:53'),
(35, 202, 'so', 'So', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:53', '2025-11-28 22:12:53'),
(36, 202, 'cdio', 'Cdio', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:54', '2025-11-28 22:12:54'),
(37, 202, 'sdg', 'Sdg', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:54', '2025-11-28 22:12:54'),
(38, 202, 'course-policies', 'Course Policies', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:55', '2025-11-28 22:12:55'),
(39, 202, 'assessment-mapping', 'Assessment Mapping', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:55', '2025-11-28 22:12:55'),
(40, 202, 'tla', 'Tla', NULL, 'draft', 5, 139, 139, '2025-11-28 22:12:55', '2025-11-28 22:12:55'),
(41, 202, 'mission-vision', 'Mission Vision', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:49', '2025-11-28 22:14:49'),
(42, 202, 'course-info', 'Course Info', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:50', '2025-11-28 22:14:50'),
(43, 202, 'criteria-assessment', 'Criteria Assessment', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:50', '2025-11-28 22:14:50'),
(44, 202, 'tlas', 'Tlas', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:50', '2025-11-28 22:14:50'),
(45, 202, 'ilo', 'Ilo', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:51', '2025-11-28 22:14:51'),
(46, 202, 'assessment-tasks-distribution', 'Assessment Tasks Distribution', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:51', '2025-11-28 22:14:51'),
(47, 202, 'textbook-upload', 'Textbook Upload', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:51', '2025-11-28 22:14:51'),
(48, 202, 'iga', 'Iga', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:51', '2025-11-28 22:14:51'),
(49, 202, 'so', 'So', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:52', '2025-11-28 22:14:52'),
(50, 202, 'cdio', 'Cdio', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:52', '2025-11-28 22:14:52'),
(51, 202, 'sdg', 'Sdg', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:52', '2025-11-28 22:14:52'),
(52, 202, 'course-policies', 'Course Policies', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:52', '2025-11-28 22:14:52'),
(53, 202, 'tla', 'Tla', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:53', '2025-11-28 22:14:53'),
(54, 202, 'assessment-mapping', 'Assessment Mapping', NULL, 'draft', 6, 139, 139, '2025-11-28 22:14:53', '2025-11-28 22:14:53'),
(55, 202, 'mission-vision', 'Mission Vision', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'draft', 7, 139, 139, '2025-11-28 22:15:35', '2025-11-28 22:15:35'),
(56, 211, 'ilo-iga-mapping', 'ILO-IGA Mapping', 'a', 'draft', 1, 155, 155, '2025-11-30 10:31:43', '2025-11-30 10:31:43'),
(57, 211, 'ilo-so-cpa-mapping', 'ILO-SO and ILO-CPA Mapping', 'a', 'draft', 1, 155, 155, '2025-11-30 10:31:44', '2025-11-30 10:32:15'),
(58, 211, 'ilo-cdio-sdg-mapping', 'ILO-CDIO and ILO-SDG Mapping', 'a', 'draft', 1, 155, 155, '2025-11-30 10:31:45', '2025-11-30 10:32:14'),
(59, 213, 'criteria-assessment', 'Criteria for Assessment', 'a', 'draft', 1, 155, 155, '2025-11-30 10:59:24', '2025-11-30 10:59:24'),
(60, 213, 'course-info', 'Course Info', 'a', 'draft', 1, 155, 155, '2025-11-30 10:59:25', '2025-11-30 10:59:25'),
(61, 213, 'mission-vision', 'Mission Vision', 'a', 'draft', 1, 155, 155, '2025-11-30 10:59:25', '2025-11-30 10:59:25'),
(62, 213, 'course-info', 'Course Info', NULL, 'draft', 2, 155, 155, '2025-11-30 11:00:12', '2025-11-30 11:00:12'),
(63, 213, 'mission-vision', 'Mission Vision', NULL, 'draft', 2, 155, 155, '2025-11-30 11:00:13', '2025-11-30 11:00:13'),
(64, 213, 'tlas', 'Teaching, Learning, and Assessment Strategies', NULL, 'draft', 3, 155, 155, '2025-11-30 11:00:34', '2025-11-30 11:00:34'),
(65, 213, 'ilo', 'Intended Learning Outcomes (ILO)', NULL, 'draft', 3, 155, 155, '2025-11-30 11:00:35', '2025-11-30 11:00:35'),
(66, 213, 'criteria-assessment', 'Criteria for Assessment', NULL, 'draft', 3, 155, 155, '2025-11-30 11:00:35', '2025-11-30 11:00:35'),
(67, 214, 'course-info', 'Course Info', NULL, 'draft', 1, 155, 155, '2025-11-30 11:08:34', '2025-11-30 11:08:34'),
(68, 214, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 155, 155, '2025-11-30 11:08:34', '2025-11-30 11:08:34'),
(69, 214, 'criteria-assessment', 'Criteria for Assessment', NULL, 'draft', 1, 155, 155, '2025-11-30 11:08:34', '2025-11-30 11:08:34'),
(70, 214, 'ilo', 'Intended Learning Outcomes (ILO)', NULL, 'draft', 1, 155, 155, '2025-11-30 11:08:34', '2025-11-30 11:08:34'),
(71, 214, 'tlas', 'Teaching, Learning, and Assessment Strategies', NULL, 'draft', 1, 155, 155, '2025-11-30 11:08:35', '2025-11-30 11:08:35'),
(72, 216, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 155, 155, '2025-11-30 11:12:30', '2025-11-30 11:12:30'),
(73, 216, 'course-info', 'Course Info', NULL, 'draft', 1, 155, 155, '2025-11-30 11:12:31', '2025-11-30 11:12:31'),
(74, 216, 'tlas', 'Teaching, Learning, and Assessment Strategies', NULL, 'draft', 1, 155, 155, '2025-11-30 11:12:31', '2025-11-30 11:12:31'),
(75, 216, 'course-info', 'Course Info', NULL, 'draft', 2, 155, 155, '2025-11-30 11:13:31', '2025-11-30 11:13:31'),
(76, 216, 'mission-vision', 'Mission Vision', NULL, 'draft', 2, 155, 155, '2025-11-30 11:13:31', '2025-11-30 11:13:31'),
(77, 216, 'course-info', 'Course Info', NULL, 'draft', 4, 155, 155, '2025-11-30 11:33:30', '2025-11-30 11:33:30'),
(78, 219, 'course-info', 'Course Info', NULL, 'draft', 1, 155, 155, '2025-11-30 18:50:33', '2025-11-30 18:50:33'),
(79, 219, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 155, 155, '2025-11-30 18:50:33', '2025-11-30 18:50:33'),
(80, 219, 'tlas', 'Teaching, Learning, and Assessment Strategies', NULL, 'draft', 1, 155, 155, '2025-11-30 18:50:33', '2025-11-30 18:50:33'),
(81, 221, 'course-info', 'Course Info', NULL, 'draft', 1, 155, 155, '2025-11-30 18:56:40', '2025-11-30 18:56:40'),
(82, 231, 'mission-vision', 'Mission Vision', 'hhjhkhhkhjk', 'draft', 1, 158, 158, '2025-12-01 17:25:29', '2025-12-01 17:25:29'),
(83, 231, 'course-info', 'Course Info', NULL, 'draft', 1, 158, 158, '2025-12-01 17:25:33', '2025-12-01 17:25:33'),
(84, 231, 'criteria-assessment', 'Criteria for Assessment', NULL, 'draft', 1, 158, 158, '2025-12-01 17:25:33', '2025-12-01 17:25:33'),
(85, 235, 'course-info', 'Course Info', NULL, 'draft', 1, 158, 158, '2025-12-01 18:22:05', '2025-12-01 18:24:05'),
(86, 235, 'mission-vision', 'Mission Vision', 'dsf', 'draft', 1, 158, 158, '2025-12-01 18:22:06', '2025-12-01 18:22:11'),
(87, 233, 'course-info', 'Course Info', NULL, 'draft', 1, 158, 158, '2025-12-01 18:25:39', '2025-12-01 18:25:39'),
(88, 233, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 158, 158, '2025-12-01 18:25:39', '2025-12-01 18:25:39'),
(89, 247, 'course-info', 'Course Info', 'No Course Rationale and Description', 'draft', 1, 216, 216, '2025-12-02 20:16:23', '2025-12-02 20:17:54'),
(90, 247, 'criteria-assessment', 'Criteria for Assessment', 'Indicate Criteria', 'draft', 1, 216, 216, '2025-12-02 20:17:05', '2025-12-02 20:17:25'),
(91, 251, 'course-info', 'Course Info', NULL, 'draft', 1, 217, 217, '2025-12-02 21:19:32', '2025-12-02 21:19:32'),
(92, 251, 'mission-vision', 'Mission Vision', NULL, 'draft', 1, 217, 217, '2025-12-02 21:19:33', '2025-12-02 21:19:33'),
(93, 251, 'criteria-assessment', 'Criteria for Assessment', NULL, 'draft', 1, 217, 217, '2025-12-02 21:19:33', '2025-12-02 21:19:33'),
(94, 251, 'ilo', 'Intended Learning Outcomes (ILO)', NULL, 'draft', 1, 217, 217, '2025-12-02 21:19:33', '2025-12-02 21:19:33'),
(95, 270, 'ilo-cdio-sdg-mapping', 'ILO-CDIO and ILO-SDG Mapping', 'ha haha a ah aha ha ah aha ah ah a', 'draft', 1, 227, 227, '2025-12-08 09:05:32', '2025-12-08 09:05:38'),
(96, 271, 'tla', 'Teaching, Learning, and Assessment (TLA) Activities', 'adjust afeaijvhja v', 'draft', 1, 234, 234, '2025-12-08 09:53:43', '2025-12-08 09:53:45'),
(97, 271, 'criteria-assessment', 'Criteria for Assessment', 'afaw', 'draft', 1, 234, 234, '2025-12-08 09:54:37', '2025-12-08 09:54:37'),
(98, 275, 'tlas', 'Teaching, Learning, and Assessment Strategies', 'fix gvfsertgh', 'draft', 2, 236, 236, '2025-12-10 05:59:53', '2025-12-10 05:59:56'),
(99, 275, 'tlas', 'Teaching, Learning, and Assessment Strategies', NULL, 'draft', 3, 236, 236, '2025-12-10 06:04:36', '2025-12-10 06:04:36'),
(100, 280, 'so', 'Student Outcomes (SO)', 'JJJJ', 'draft', 1, 231, 231, '2025-12-11 02:32:17', '2025-12-11 02:32:19'),
(101, 280, 'course-info', 'Course Info', NULL, 'draft', 2, 231, 231, '2025-12-11 05:46:05', '2025-12-11 05:46:05'),
(102, 283, 'iga', 'Institutional Graduate Attributes (IGA)', 'Include blah blah blah', 'draft', 1, 234, 234, '2025-12-14 19:36:11', '2025-12-14 19:36:11'),
(103, 283, 'assessment-tasks-distribution', 'Assessment Method and Distribution Map', 'justify why ME only blajdiahcuahca', 'draft', 1, 234, 234, '2025-12-14 19:36:20', '2025-12-14 19:36:25');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_course_infos`
--

CREATE TABLE `syllabus_course_infos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `course_title` varchar(255) DEFAULT NULL,
  `course_code` varchar(255) DEFAULT NULL,
  `course_category` varchar(255) DEFAULT NULL,
  `course_prerequisites` text DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `year_level` varchar(255) DEFAULT NULL,
  `credit_hours_text` varchar(255) DEFAULT NULL,
  `instructor_name` varchar(255) DEFAULT NULL,
  `employee_code` varchar(255) DEFAULT NULL,
  `reference_cmo` varchar(255) DEFAULT NULL,
  `instructor_designation` varchar(255) DEFAULT NULL,
  `date_prepared` varchar(255) DEFAULT NULL,
  `instructor_email` varchar(255) DEFAULT NULL,
  `revision_no` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `revision_date` varchar(255) DEFAULT NULL,
  `course_description` text DEFAULT NULL,
  `tla_strategies` text DEFAULT NULL,
  `contact_hours` text DEFAULT NULL,
  `contact_hours_lec` text DEFAULT NULL,
  `contact_hours_lab` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_course_infos`
--

INSERT INTO `syllabus_course_infos` (`id`, `syllabus_id`, `course_title`, `course_code`, `course_category`, `course_prerequisites`, `semester`, `year_level`, `credit_hours_text`, `instructor_name`, `employee_code`, `reference_cmo`, `instructor_designation`, `date_prepared`, `instructor_email`, `revision_no`, `academic_year`, `revision_date`, `course_description`, `tla_strategies`, `contact_hours`, `contact_hours_lec`, `contact_hours_lab`, `created_at`, `updated_at`) VALUES
(183, 266, 'Fundamentals of Business Analytics', 'BAT 401', 'Professional Elective: Business Analytics Track', '', '1st Semester', '2nd Year', '5 (3 hrs lec; 2 hrs lab)', 'PEREYRA MATTHEW ALEN', '22-72684', NULL, 'Professor 1', 'December 06, 2025', '22-72684@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture; 2 hours laboratory', '3 hours lecture', '2 hours laboratory', '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(185, 268, 'Fundamentals of Business Analytics', 'BAT 401', 'Professional Elective: Business Analytics Track', NULL, '1st Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'PABLICO ADRIANE ALLEN', '22-77551', NULL, 'Professor 1', 'December 07, 2025', '22-77551@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture\n2 hours laboratory', '3', '2', '2025-12-07 03:59:48', '2025-12-07 04:03:14'),
(186, 269, 'Computer Programming', 'CS 111', 'Core Elective', '', '1st Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'BENITEZ SHANE ANN', '22-79953', NULL, 'Assistant Professor', 'December 07, 2025', '22-79953@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture; 2 hours laboratory', '3 hours lecture', '2 hours laboratory', '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(188, 271, 'Computer Programming', 'CS 111', 'Core Elective', NULL, '2nd Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'MATUNDAN JAYLORD', '22-77774', NULL, 'dsfdsfdsf', 'December 08, 2025', '22-77774@g.batstate-u.edu.ph', '1', '2025-2026', '2025-12-08', NULL, NULL, '3 hours lecture\n2 hours laboratory', '3', '2', '2025-12-08 09:44:17', '2025-12-08 09:59:50'),
(189, 272, 'Advanced Computer Programming', 'IT 121', 'Core Elective', 'CS 111 - Computer Programming', '1st Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'Jason Magsino', 'jason.magsino', NULL, 'Lecturer I', 'December 08, 2025', 'jason.magsino@g.batstate-u.edu.ph', NULL, '2026-2027', NULL, NULL, NULL, '3 hours lecture\n2 hours laboratory', '3', '2', '2025-12-08 13:36:43', '2025-12-08 13:38:16'),
(191, 274, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nbm', NULL, NULL, NULL, NULL, NULL, NULL, 'mbnm', 'bnmbnm', NULL, '3', '2', '2025-12-10 05:16:41', '2025-12-27 08:24:42'),
(192, 275, 'Computer Programming', 'CS 111', 'Core Elective', NULL, '2nd Semester', '1st Year', '5 (2 hrs lec; 3 hrs lab)', 'BENITEZ SHANE ANN', '22-79953', NULL, 'Assistant Professor', 'December 10, 2025', '22-79953@g.batstate-u.edu.ph', '2', '2025-2026', '2025-12-10', NULL, 'Written/ Oral Exam\nThere will be two (2) major examinations to be conducted in-class. The examinations will cover the topics\ndiscussed for the given period but may include some topics from the preceding period due to the continuity of\nconcepts.\n\nThe course is taught using a structured program of online learning, video presentations, tutorials, laboratory\nactivities and student-centered learning specifically: (a) self-directed learning using on-line material and\nlectures to supplement on-line material (b) laboratory sessions to gain practical experience and re-enforce\ntheory (d) individual assignment work as part of laboratory work (e) web-based research and (f) reporting. For\nthose students with no internet connectivity, modules will be provided.. gttrtghr\n\nStudents will be assessed using any or combination of rubrics, paper and pencil tests, oral and paper\npresentation and portfolio or any of the following methods: Major Examinations, Quizzes, Chapter Tests,\nAttendance, Recitation, Projects, Evaluation of Laboratory Exercises and Examinations (using rubrics).', '2 hours lecture\n3 hours laboratory', '2', '3', '2025-12-10 05:24:38', '2025-12-10 06:01:12'),
(194, 277, 'Fundamentals of Business Analytics', 'BAT 401', 'Professional Elective: Business Analytics Track', NULL, '1st Semester', '2nd Year', '5 (3 hrs lec; 2 hrs lab)', 'DECILOS GLENMOR', '22-70727', NULL, 'Assoc. Prof.', 'December 10, 2025', '22-70727@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, 'This course provides a comprehensive introduction to the fundamentals of computer programming with a focus on applications in business analytics. Students will learn core programming concepts such as program structure, data types, control structures, algorithms, and basic data structures. Emphasis is placed on problem-solving, logical thinking, and the practical use of programming tools to address typical business scenarios. Through hands-on exercises and projects, students will develop the skills required to create simple programs that support', NULL, '3 hours lecture\n2 hours laboratory', '3', '2', '2025-12-10 06:37:33', '2025-12-10 07:58:23'),
(195, 278, 'Computer Programming', 'CS 111', 'Core Elective', '', '1st Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'BENITEZ SHANE ANN', '22-79953', NULL, 'Assistant Professor', 'December 10, 2025', '22-79953@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture; 2 hours laboratory', '3 hours lecture', '2 hours laboratory', '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(196, 279, 'Computer Programming', 'CS 111', 'Core Elective', '', '2nd Semester', '1st Year', '5 (3 hrs lec; 2 hrs lab)', 'CERTEZA CINDY', '22-76323', NULL, 'Associate  Professor', 'December 11, 2025', '22-76323@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture; 2 hours laboratory', '3 hours lecture', '2 hours laboratory', '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(197, 280, 'Computer Programming', 'CS 111', 'Core Elective', NULL, '2nd Semester', '1st Year', '5 (2 hrs lec; 3 hrs lab)', 'CERTEZA CINDY', '22-76323', NULL, 'Associate  Professor', 'December 11, 2025', '22-76323@g.batstate-u.edu.ph', '1', '2025-2026', '2025-12-11', 'Computer Programming introduces students to the fundamental principles and techniques of computer programming. Through a combination of lectures and hands-on laboratory exercises, students will learn about program structure, variables, data types, control structures, algorithms, and basic data structures. The course emphasizes developing proficiency in writing, debugging, and testing simple computer programs using a high-level programming language. Ethical, security, and professional issues in programming are also discussed. By the end of the course, students will be able to design and implement solutions to simple computational problems, preparing them for more advanced studies in computer science and related disciplines.', 'The teaching and learning approach for this course combines lectures, demonstrations, collaborative activities, and hands-on laboratory sessions to provide students with both theoretical knowledge and practical skills in computer programming. Lectures and discussions introduce fundamental programming concepts, supported by live coding demonstrations that clarify syntax, logic, and debugging techniques. Guided and independent laboratory exercises enable students to practice writing, testing, and troubleshooting code, reinforcing concepts covered in class. Collaborative learning is encouraged through pair programming and group projects, fostering teamwork and peer-to-peer support. Problem-based learning tasks and real-world scenarios help students develop problem-solving and algorithmic thinking skills. A variety of assessment methods are employed, including quizzes, major exams, laboratory exercises, programming projects, and class participation. These assessments are designed to measure students’ understanding of programming concepts, their ability to develop and implement algorithms, and their awareness of ethical and security issues in programming. Continuous feedback is provided to support student learning, encourage improvement, and ensure readiness for more advanced computing courses.', '2 hours lecture\n3 hours laboratory', '2', '3', '2025-12-11 02:23:14', '2025-12-11 03:05:37'),
(198, 281, 'Financial Accounting and Reporting 1', 'ACC 101', 'Core Accounting Education', '', '1st Semester', '1st Year', '6 (6 hrs lec; 0 hrs lab)', 'Alvin Andulan', '150625', NULL, 'BSA and BSMA Department Chair', 'December 11, 2025', 'alvin.andulan@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, 'This course will help the students understand the fundamental accounting concepts and principles. They will also be introduced to the double entry system of recording transactions, the accounting cycle under a service type of business. This also includes an introduction to the accounting for merchandising and manufacturing types of business. It also emphasizes the construction of financial statements which includes the statement of financial position, statement of comprehensive income, statement of changes in equity and statement of cash flows. Students will also be oriented about special and combination journals as well as the voucher system.', NULL, '6 hours lecture', '6 hours lecture', NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(200, 283, 'Introduction to Computing', 'IT 111', 'Core, Elective, Professional', NULL, '2nd Semester', '1st Year', '5 (2 hrs lec; 3 hrs lab)', 'BENITEZ SHANE ANN', '22-79953', NULL, 'Assistant Professor', 'December 14, 2025', '22-79953@g.batstate-u.edu.ph', '1', '2025-2026', '2025-12-14', 'In the modern world, computing and information technology form the backbone of innovation, business, and daily life. The ability to understand and leverage computing concepts is a fundamental skill for professionals across all disciplines. \"Introduction to Computing\" provides students with foundational knowledge in computer systems, programming, and problem-solving strategies essential for success in the global knowledge economy.', 'Lectures and Interactive Discussions: Introduce concepts such as the importance of programming, the evolution of technology, and core programming structures. Use real-life analogies and examples to enhance understanding.\nHands-on Laboratory Exercises: Students will practice programming fundamentals—variables, loops, control structures, algorithms, and data structures—using simple, guided projects and exercises.\nCollaborative Projects: Small groups will tackle programming problems or mini-projects, fostering teamwork, communication, and peer learning.', '2 hours lecture\n3 hours laboratory', '2', '3', '2025-12-14 19:27:14', '2025-12-14 19:36:30'),
(201, 284, 'Introduction to Computing', 'IT 111', 'Core, Elective, Professional', '', '1st Semester', '1st Year', '3 (3 hrs lec; 0 hrs lab)', 'Adriane Allen P. Pablico', '22-77551', NULL, 'Professor 1', 'December 27, 2025', '22-77551@g.batstate-u.edu.ph', NULL, '2025-2026', NULL, NULL, NULL, '3 hours lecture', '3 hours lecture', NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_course_policies`
--

CREATE TABLE `syllabus_course_policies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `section` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `position` int(11) DEFAULT 0,
  `grading_system` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`grading_system`)),
  `class_policy` text DEFAULT NULL,
  `missed_exams` text DEFAULT NULL,
  `academic_dishonesty` text DEFAULT NULL,
  `dropping` text DEFAULT NULL,
  `other_policies` text DEFAULT NULL,
  `consultation_advising` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_course_policies`
--

INSERT INTO `syllabus_course_policies` (`id`, `syllabus_id`, `section`, `content`, `position`, `grading_system`, `class_policy`, `missed_exams`, `academic_dishonesty`, `dropping`, `other_policies`, `consultation_advising`, `created_at`, `updated_at`) VALUES
(672, 266, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(673, 266, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(674, 266, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(675, 266, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(676, 266, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(682, 268, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(683, 268, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(684, 268, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(685, 268, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(686, 268, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(687, 269, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(688, 269, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(689, 269, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(690, 269, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(691, 269, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(697, 271, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(698, 271, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(699, 271, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(700, 271, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(701, 271, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(702, 272, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(703, 272, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(704, 272, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(705, 272, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(706, 272, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(712, 274, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(713, 274, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(714, 274, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(715, 274, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(716, 274, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:16:41', '2025-12-10 05:16:41'),
(717, 275, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(718, 275, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(719, 275, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(720, 275, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(721, 275, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(727, 277, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(728, 277, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(729, 277, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(730, 277, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(731, 277, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(732, 278, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(733, 278, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(734, 278, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(735, 278, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(736, 278, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(737, 279, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(738, 279, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(739, 279, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(740, 279, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(741, 279, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(742, 280, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(743, 280, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(744, 280, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(745, 280, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(746, 280, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(747, 281, 'policy', '', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(748, 281, 'exams', '', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(749, 281, 'dishonesty', '', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(750, 281, 'dropping', '', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(751, 281, 'other', '', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(757, 283, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(758, 283, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(759, 283, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(760, 283, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(761, 283, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(762, 284, 'policy', 'Prompt and regular attendance of students is required. Total unexcused absences shall not exceed ten (10) percent of\r\nthe maximum number of hours required per course per semester (or per summer term). A semester has 17 weeks.', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32'),
(763, 284, 'exams', 'Students who failed to take the exam during the schedule date can be given a special exam provided he/she has valid\r\nreason. If it is health reason, he/she should provide the faculty with the medical certificate signed by the attending\r\nPhysician. Other reasons shall be assessed first by the faculty to determine its validity.', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32'),
(764, 284, 'dishonesty', 'Academic dishonesty includes acts such as cheating during examinations or plagiarism in connection with any\r\nacademic work. Such acts are considered major offenses and will be dealt with according to the University’s Student\r\nNorms of Conduct.', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32'),
(765, 284, 'dropping', 'Dropping must be made official by accomplishing a dropping form and submitting it at the Registrar’s Office before\r\nthe midterm examination. Students who officially drop out of class shall be marked “Dropped” whether he took the\r\npreliminary examination or not and irrespective of their preliminary grades.\r\nA student who unofficially drops out of class shall be given a mark of “5.0” by the instructor.', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32'),
(766, 284, 'other', 'Students with Disabilities/Special Needs (PWD). All students who have an illness or disability are encouraged to disclose to the instructor the nate and extent of the illness or disability so that the instructor can make the necessary adjustments.\r\nAll students are expected to promote and foster an environment that encourages positive, informed and unprejudiced attitudes towads students with disability.\r\nCONSULTATION AND ACADEMIC ADVISING\r\nStudents are highly encouraged to use the consultation hour of the instructor set by the college, whether virtually or face-to-face. It will be used to seek for an advice if there is any problem or difficulty encountered during the term. Discussion for academic purposes will also be entertained.', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-27 09:50:32', '2025-12-27 09:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_criteria`
--

CREATE TABLE `syllabus_criteria` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_criteria`
--

INSERT INTO `syllabus_criteria` (`id`, `syllabus_id`, `key`, `heading`, `section`, `value`, `position`, `created_at`, `updated_at`) VALUES
(3764, 268, 'lecture_40', 'Lecture (40%)', 'Lecture (40%)', '[{\"description\":\"Midterm Exam\",\"percent\":\"20%\"},{\"description\":\"Final Exam\",\"percent\":\"30%\"},{\"description\":\"Quizzes\",\"percent\":\"15%\"},{\"description\":\"Assignment\",\"percent\":\"15%\"},{\"description\":\"Project\",\"percent\":\"20%\"}]', 0, '2025-12-07 05:02:36', '2025-12-07 05:02:36'),
(3765, 268, 'laboratory_60', 'Laboratory (60%)', 'Laboratory (60%)', '[{\"description\":\"Laboratory Exercises\",\"percent\":\"40%\"},{\"description\":\"Laboratory Exams\",\"percent\":\"60%\"}]', 1, '2025-12-07 05:02:36', '2025-12-07 05:02:36'),
(3768, 271, 'lecture', '', '', '[]', 0, '2025-12-08 09:59:51', '2025-12-08 09:59:51'),
(3769, 271, 'laboratory', '', '', '[]', 1, '2025-12-08 09:59:51', '2025-12-08 09:59:51'),
(3773, 272, 'lecture', '', '', '[]', 0, '2025-12-08 13:38:18', '2025-12-08 13:38:18'),
(3774, 272, 'laboratory', '', '', '[]', 1, '2025-12-08 13:38:18', '2025-12-08 13:38:18'),
(3775, 272, 'section_3', '', '', '[]', 2, '2025-12-08 13:38:18', '2025-12-08 13:38:18'),
(3802, 275, 'lecture_40', 'Lecture (40%)', 'Lecture (40%)', '[{\"description\":\"Major Exams (Midterm and Final)\",\"percent\":\"40%\"},{\"description\":\"Quizzes \\/ Chapter Tests\",\"percent\":\"30%\"},{\"description\":\"Attendance \\/ Recitation\",\"percent\":\"10%\"},{\"description\":\"Projects\",\"percent\":\"20%\"}]', 0, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(3803, 275, 'laboratory_60', 'Laboratory (60%)', 'Laboratory (60%)', '[{\"description\":\"Laboratory Exercises\",\"percent\":\"40%\"},{\"description\":\"Laboratory Projects\\/Exams\",\"percent\":\"60%\"}]', 1, '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(3804, 277, 'lecture_40', 'Lecture (40%)', 'Lecture (40%)', '[{\"description\":\"Major Exams (Midterm and Final) 40%\",\"percent\":\"\"}]', 0, '2025-12-10 07:58:24', '2025-12-10 07:58:24'),
(3819, 280, 'lecture_40', 'Lecture (40%)', 'Lecture (40%)', '[{\"description\":\"Major Exams (Midterm and Final)\",\"percent\":\"40%\"},{\"description\":\"Quizzes \\/ Chapter Tests\",\"percent\":\"30%\"},{\"description\":\"Attendance \\/ Recitation\",\"percent\":\"10%\"},{\"description\":\"Projects\",\"percent\":\"20%\"}]', 0, '2025-12-11 03:54:28', '2025-12-11 03:54:28'),
(3820, 280, 'laboratory_60', 'Laboratory (60%)', 'Laboratory (60%)', '[{\"description\":\"Laboratory Exercises\",\"percent\":\"40%\"},{\"description\":\"Laboratory Projects\\/Exams\",\"percent\":\"60%\"}]', 1, '2025-12-11 03:54:28', '2025-12-11 03:54:28'),
(3831, 283, 'lecture_40', 'Lecture (40%)', 'Lecture (40%)', '[{\"description\":\"Major Exams (Midterm and Final)\",\"percent\":\"40%\"},{\"description\":\"Quizzes \\/ Chapter Tests\",\"percent\":\"30%\"},{\"description\":\"Attendance \\/ Recitation\",\"percent\":\"10%\"},{\"description\":\"Projects\",\"percent\":\"20%\"}]', 0, '2025-12-14 19:37:17', '2025-12-14 19:37:17'),
(3832, 283, 'laboratory_60', 'Laboratory (60%)', 'Laboratory (60%)', '[{\"description\":\"Laboratory Exercises\",\"percent\":\"40%\"},{\"description\":\"Laboratory Projects\\/Exams\",\"percent\":\"60%\"}]', 1, '2025-12-14 19:37:17', '2025-12-14 19:37:17'),
(3858, 274, 'lecture', '', '', '[]', 0, '2025-12-27 09:06:16', '2025-12-27 09:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_igas`
--

CREATE TABLE `syllabus_igas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_igas`
--

INSERT INTO `syllabus_igas` (`id`, `syllabus_id`, `code`, `title`, `description`, `position`, `created_at`, `updated_at`) VALUES
(692, 268, 'IGA1', 'Knowledge Competence', 'Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.', 1, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(693, 268, 'IGA2', 'Creativity and Innovation', 'Experiment with new approaches, challenge existing knowledge boundaries, and design novel solutions to solve problems.', 2, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(694, 268, 'IGA3', 'Critical and Systems Thinking', 'Identify, define, and deal with complex problems pertinent to future professional practice or daily life through logical, analytical, and critical thinking.', 3, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(695, 268, 'IGA4', 'Communication', 'Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Filipino.', 4, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(696, 268, 'IGA5', 'Lifelong Learning', 'Identify own learning needs for professional or personal development; demonstrate eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.', 5, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(697, 268, 'IGA6', 'Leadership, Teamwork, and Interpersonal Skills', 'Function effectively both as a leader and as a member of a team; motivate and lead a team to work toward goals; work collaboratively with other team members; and connect and interact socially and effectively with diverse culture.', 6, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(698, 268, 'IGA7', 'Global Outlook', 'Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively, and show sensitivity to cultural diversity.', 7, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(699, 268, 'IGA8', 'Social and National Responsibility', 'Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of society; and behave ethically and responsibly in social, professional, and work environments.', 8, '2025-12-07 04:27:25', '2025-12-07 05:02:32'),
(700, 269, 'IGA1', 'Knowledge Competence', 'Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.', 1, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(701, 269, 'IGA2', 'Creativity and Innovation', 'Experiment with new approaches, challenge existing knowledge boundaries, and design novel solutions to solve problems.', 2, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(702, 269, 'IGA3', 'Critical and Systems Thinking', 'Identify, define, and deal with complex problems pertinent to future professional practice or daily life through logical, analytical, and critical thinking.', 3, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(703, 269, 'IGA4', 'Communication', 'Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Filipino.', 4, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(704, 269, 'IGA5', 'Lifelong Learning', 'Identify own learning needs for professional or personal development; demonstrate eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.', 5, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(705, 269, 'IGA6', 'Leadership, Teamwork, and Interpersonal Skills', 'Function effectively both as a leader and as a member of a team; motivate and lead a team to work toward goals; work collaboratively with other team members; and connect and interact socially and effectively with diverse culture.', 6, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(706, 269, 'IGA7', 'Global Outlook', 'Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively, and show sensitivity to cultural diversity.', 7, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(707, 269, 'IGA8', 'Social and National Responsibility', 'Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of society; and behave ethically and responsibly in social, professional, and work environments.', 8, '2025-12-07 08:29:12', '2025-12-07 08:29:12'),
(716, 275, 'IGA1', 'Knowledge Competence', 'Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.', 1, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(717, 275, 'IGA2', 'Creativity and Innovation', 'Experiment with new approaches, challenge existing knowledge boundaries, and design novel solutions to solve problems.', 2, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(718, 275, 'IGA3', 'Critical and Systems Thinking', 'Identify, define, and deal with complex problems pertinent to future professional practice or daily life through logical, analytical, and critical thinking.', 3, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(719, 275, 'IGA4', 'Communication', 'Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Filipino.', 4, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(720, 275, 'IGA5', 'Lifelong Learning', 'Identify own learning needs for professional or personal development; demonstrate eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.', 5, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(721, 275, 'IGA6', 'Leadership, Teamwork, and Interpersonal Skills', 'Function effectively both as a leader and as a member of a team; motivate and lead a team to work toward goals; work collaboratively with other team members; and connect and interact socially and effectively with diverse culture.', 6, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(722, 275, 'IGA7', 'Global Outlook', 'Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively, and show sensitivity to cultural diversity.', 7, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(723, 275, 'IGA8', 'Social and National Responsibility', 'Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of society; and behave ethically and responsibly in social, professional, and work environments.', 8, '2025-12-10 05:39:08', '2025-12-10 06:04:10'),
(748, 274, 'IGA1', 'Knowledge Competence', 'Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.', 1, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(749, 274, 'IGA2', 'Creativity and Innovation', 'Experiment with new approaches, challenge existing knowledge boundaries, and design novel solutions to solve problems.', 2, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(750, 274, 'IGA3', 'Critical and Systems Thinking', 'Identify, define, and deal with complex problems pertinent to future professional practice or daily life through logical, analytical, and critical thinking.', 3, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(751, 274, 'IGA4', 'Communication', 'Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Filipino.', 4, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(752, 274, 'IGA5', 'Lifelong Learning', 'Identify own learning needs for professional or personal development; demonstrate eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.', 5, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(753, 274, 'IGA6', 'Leadership, Teamwork, and Interpersonal Skills', 'Function effectively both as a leader and as a member of a team; motivate and lead a team to work toward goals; work collaboratively with other team members; and connect and interact socially and effectively with diverse culture.', 6, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(754, 274, 'IGA7', 'Global Outlook', 'Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively, and show sensitivity to cultural diversity.', 7, '2025-12-26 13:20:13', '2025-12-27 09:23:45'),
(755, 274, 'IGA8', 'Social and National Responsibility', 'Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of society; and behave ethically and responsibly in social, professional, and work environments.', 8, '2025-12-26 13:20:13', '2025-12-27 09:23:45');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_ilos`
--

CREATE TABLE `syllabus_ilos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_ilos`
--

INSERT INTO `syllabus_ilos` (`id`, `syllabus_id`, `code`, `description`, `position`, `created_at`, `updated_at`) VALUES
(771, 268, 'ILO1', 'Explain data management concepts and criticality of data availability in order to make reliable business \ndecisions.', 1, '2025-12-07 04:17:53', '2025-12-07 05:02:32'),
(772, 268, 'ILO2', 'Demonstrate understanding of  business intelligence including the importance of data gathering, data \nstoring, data analyzing and accessing data.', 2, '2025-12-07 04:17:53', '2025-12-07 05:02:32'),
(773, 268, 'ILO3', 'Describe where to look for data in an organization and create required reports', 3, '2025-12-07 04:17:53', '2025-12-07 05:02:32'),
(774, 268, 'ILO4', 'Perform high-quality tasks required by the organization in particular, and the industry in general', 4, '2025-12-07 04:17:53', '2025-12-07 05:02:32'),
(783, 275, 'ILO1', 'Solve computing problems using integrated development tool to meets specific requirements', 1, '2025-12-10 05:59:01', '2025-12-10 06:04:10'),
(785, 275, 'ILO2', 'Select and apply appropriate program constructs in developing computer programs.', 2, '2025-12-10 05:59:01', '2025-12-10 06:04:10'),
(787, 275, 'ILO3', 'Develop test and debug a computer program, based on a given specification using the fundamental\nprogramming components.', 3, '2025-12-10 05:59:01', '2025-12-10 06:04:10'),
(793, 277, 'ILO1', 'Explain fundamental programming concepts and their roles in solving business problems.', 1, '2025-12-10 06:37:33', '2025-12-10 07:58:21'),
(794, 277, 'ILO2', 'Apply basic programming constructs (such as variables, control structures, and data types) to develop simple programs relevant to business analytics.', 2, '2025-12-10 06:37:33', '2025-12-10 07:58:21'),
(795, 277, 'ILO3', 'Analyze business scenarios and design algorithmic solutions using computational thinking.', 3, '2025-12-10 06:37:33', '2025-12-10 07:58:21'),
(796, 277, 'ILO4', 'Utilize programming tools to automate data processing and generate business reports.', 4, '2025-12-10 06:37:33', '2025-12-10 07:58:21'),
(797, 277, 'ILO5', 'Demonstrate the ability to debug, test, and document code to ensure reliable program functionality.', 5, '2025-12-10 07:58:21', '2025-12-10 07:58:21'),
(798, 277, 'ILO6', 'Communicate technical information and programming solutions effectively in both written and oral forms.', 6, '2025-12-10 07:58:21', '2025-12-10 07:58:21'),
(799, 277, 'ILO5', 'Demonstrate the ability to debug, test, and document code to ensure reliable program functionality.', 5, '2025-12-10 07:58:21', '2025-12-10 07:58:21'),
(800, 277, 'ILO6', 'Communicate technical information and programming solutions effectively in both written and oral forms.', 6, '2025-12-10 07:58:21', '2025-12-10 07:58:21'),
(801, 280, 'ILO1', 'Develop and implement algorithms to solve simple problems', 1, '2025-12-11 03:05:36', '2025-12-11 03:54:26'),
(804, 280, 'ILO2', 'Write, debug, and test simple computer programs', 2, '2025-12-11 03:05:36', '2025-12-11 03:54:26'),
(805, 280, 'ILO3', 'Demonstrate awareness of security, ethical, and professional issues in programming', 3, '2025-12-11 03:05:36', '2025-12-11 03:54:26'),
(807, 283, 'ILO1', 'Apply algorithmic thinking to solve simple computational problems.', 1, '2025-12-14 19:33:46', '2025-12-14 19:37:15'),
(809, 283, 'ILO2', 'Describe and utilize basic data structures in programming.', 2, '2025-12-14 19:33:46', '2025-12-14 19:37:15'),
(811, 283, 'ILO3', 'Develop and test simple computer programs using a high-level programming language.', 3, '2025-12-14 19:33:46', '2025-12-14 19:37:15'),
(825, 274, 'ILO1', 'aa', 1, '2025-12-27 08:53:36', '2025-12-27 09:23:45');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_ilo_cdio_sdg`
--

CREATE TABLE `syllabus_ilo_cdio_sdg` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `ilo_text` text DEFAULT NULL,
  `cdios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cdios`)),
  `sdgs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sdgs`)),
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_ilo_cdio_sdg`
--

INSERT INTO `syllabus_ilo_cdio_sdg` (`id`, `syllabus_id`, `ilo_text`, `cdios`, `sdgs`, `position`, `created_at`, `updated_at`) VALUES
(97, 268, 'ILO1', '{\"1\":\"Q1,AS\",\"2\":\"Q1,AS\",\"3\":\"AS\"}', '{\"2\":\"Q1,AS\",\"3\":\"Q1,AS\"}', 0, '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(98, 268, 'ILO2', '{\"1\":\"Q1,AS\",\"2\":\"Q1,AS\",\"3\":\"Q1,AS\"}', '{\"2\":\"Q1,AS\",\"3\":\"Q1,AS\"}', 1, '2025-12-07 05:02:35', '2025-12-07 05:02:35');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_ilo_iga`
--

CREATE TABLE `syllabus_ilo_iga` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `ilo_text` varchar(255) DEFAULT NULL,
  `igas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`igas`)),
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_ilo_iga`
--

INSERT INTO `syllabus_ilo_iga` (`id`, `syllabus_id`, `ilo_text`, `igas`, `position`, `created_at`, `updated_at`) VALUES
(159, 268, 'ILO1', '{\"IGA1\":\"Q1,AS\"}', 0, '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(160, 268, 'ILO2', '{\"IGA1\":\"Q1,AS\"}', 1, '2025-12-07 05:02:35', '2025-12-07 05:02:35');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_ilo_so_cpa`
--

CREATE TABLE `syllabus_ilo_so_cpa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `ilo_text` varchar(255) DEFAULT NULL,
  `sos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sos`)),
  `c` text DEFAULT NULL,
  `p` text DEFAULT NULL,
  `a` text DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_ilo_so_cpa`
--

INSERT INTO `syllabus_ilo_so_cpa` (`id`, `syllabus_id`, `ilo_text`, `sos`, `c`, `p`, `a`, `position`, `created_at`, `updated_at`) VALUES
(203, 268, 'ILO1', '{\"SO1\":\"Q,AS\",\"SO3\":\"Q,AS\"}', 'Q,AS', NULL, NULL, 0, '2025-12-07 05:02:34', '2025-12-07 05:02:34'),
(204, 268, 'ILO2', '{\"SO1\":\"Q,AS\",\"SO3\":\"Q,AS\"}', 'Q,AS', NULL, 'Q,AS', 1, '2025-12-07 05:02:34', '2025-12-07 05:02:34');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_mission_visions`
--

CREATE TABLE `syllabus_mission_visions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_mission_visions`
--

INSERT INTO `syllabus_mission_visions` (`id`, `syllabus_id`, `mission`, `vision`, `created_at`, `updated_at`) VALUES
(187, 266, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-06 06:05:14', '2025-12-06 06:05:14'),
(189, 268, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-07 03:59:48', '2025-12-07 03:59:48'),
(190, 269, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(192, 271, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-08 09:44:17', '2025-12-08 09:44:17'),
(193, 272, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-08 13:36:43', '2025-12-08 13:36:43'),
(195, 274, '', '', '2025-12-10 05:16:41', '2025-12-27 09:21:40'),
(196, 275, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-10 05:24:38', '2025-12-10 05:24:38'),
(198, 277, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-10 06:37:33', '2025-12-10 06:37:33'),
(199, 278, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-10 07:31:38', '2025-12-10 07:31:38'),
(200, 279, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-11 02:06:22', '2025-12-11 02:06:22'),
(201, 280, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-11 02:23:14', '2025-12-11 02:23:14'),
(202, 281, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-11 03:28:01', '2025-12-11 03:28:01'),
(204, 283, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-14 19:27:14', '2025-12-14 19:27:14'),
(205, 284, 'A university committed to producing leaders by providing a 21st century learning environment through innovations\r\nin education, multidisciplinary research, and community and industry partnerships in order to nurture the spirit of\r\nnationhood, propel the national economy and engage the world for sustainable development.', 'A premier national university that develops leaders in the global knowledge economy', '2025-12-27 09:50:32', '2025-12-27 09:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_sdgs`
--

CREATE TABLE `syllabus_sdgs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(32) NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_sdgs`
--

INSERT INTO `syllabus_sdgs` (`id`, `syllabus_id`, `code`, `sort_order`, `title`, `description`, `created_at`, `updated_at`) VALUES
(591, 268, 'SDG1', 1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\n harnessing their deep aspirations.', '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(592, 268, 'SDG2', 2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\n their world views by having them reflect on unsustainable practices.', '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(593, 268, 'SDG3', 3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \ncomplex situations.', '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(594, 268, 'SDG4', 4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\n commitment to sustainable action through education and learning.', '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(595, 268, 'SDG5', 5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-12-07 05:02:35', '2025-12-07 05:02:35'),
(596, 269, 'SDG1', 1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\r\n harnessing their deep aspirations.', '2025-12-07 08:29:43', '2025-12-07 08:29:43'),
(597, 269, 'SDG2', 2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\r\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\r\n their world views by having them reflect on unsustainable practices.', '2025-12-07 08:29:43', '2025-12-07 08:29:43'),
(598, 269, 'SDG3', 3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \r\ncomplex situations.', '2025-12-07 08:29:43', '2025-12-07 08:29:43'),
(599, 269, 'SDG4', 4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\r\n commitment to sustainable action through education and learning.', '2025-12-07 08:29:43', '2025-12-07 08:29:43'),
(600, 269, 'SDG5', 5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-12-07 08:29:43', '2025-12-07 08:29:43'),
(671, 275, 'SDG1', 1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\n harnessing their deep aspirations.', '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(672, 275, 'SDG2', 2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\n their world views by having them reflect on unsustainable practices.', '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(673, 275, 'SDG3', 3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \ncomplex situations.', '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(674, 275, 'SDG4', 4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\n commitment to sustainable action through education and learning.', '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(675, 275, 'SDG5', 5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-12-10 06:04:11', '2025-12-10 06:04:11'),
(676, 279, 'SDG1', 1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\r\n harnessing their deep aspirations.', '2025-12-11 02:09:40', '2025-12-11 02:09:40'),
(677, 279, 'SDG2', 2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\r\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\r\n their world views by having them reflect on unsustainable practices.', '2025-12-11 02:09:40', '2025-12-11 02:09:40'),
(678, 279, 'SDG3', 3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \r\ncomplex situations.', '2025-12-11 02:09:40', '2025-12-11 02:09:40'),
(679, 279, 'SDG4', 4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\r\n commitment to sustainable action through education and learning.', '2025-12-11 02:09:40', '2025-12-11 02:09:40'),
(680, 279, 'SDG5', 5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-12-11 02:09:40', '2025-12-11 02:09:40'),
(711, 280, 'SDG1', 1, 'Envisioning', 'Est ablishalinkbetweenlong-termgoalsandandimmediateactions,andmotivatepeopletotakeactionby\n harnessing their deep aspirations.', '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(712, 280, 'SDG2', 2, 'Critical', 'Examine economic, environmental, social and cultural structures in the context of sustainable\n development, andchallengespeople toexamineandquestiontheunderlyingassumptions that influence\n their world views by having them reflect on unsustainable practices.', '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(713, 280, 'SDG3', 3, 'Systematic thinking', 'Recognise that the whole is more than the sum of its parts, and it is a better way to understand and manage \ncomplex situations.', '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(714, 280, 'SDG4', 4, 'Building Partnership', 'Promote dialogue andnegotiation, learning towork together, so as to strengthenownership of and\n commitment to sustainable action through education and learning.', '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(715, 280, 'SDG5', 5, 'Participation in Making Decisions', 'Empower oneself and others through involvement in joint analysis, planning and control of local decisions.', '2025-12-11 03:54:27', '2025-12-11 03:54:27');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_sections`
--

CREATE TABLE `syllabus_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_sos`
--

CREATE TABLE `syllabus_sos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_sos`
--

INSERT INTO `syllabus_sos` (`id`, `syllabus_id`, `code`, `title`, `position`, `description`, `created_at`, `updated_at`) VALUES
(3189, 268, 'SO1', '', 1, 'Ability to analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3190, 268, 'SO2', '', 2, 'Ability to design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program’s discipline.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3191, 268, 'SO3', '', 3, 'Ability to communicate effectively in a variety of professional contexts.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3192, 268, 'SO4', '', 4, 'Ability to recognize professional responsibilities and make informed judgments in computing practice based on legal and ethical principles.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3193, 268, 'SO5', '', 5, 'Ability to function effectively as a member or leader of a team engaged in activities appropriate to the program’s discipline.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3194, 268, 'SO6', '', 6, 'Ability to identify and analyze user needs and take them into account in the selection, creation, integration, evaluation, and administration of computing-based systems.', '2025-12-07 04:27:28', '2025-12-07 05:02:33'),
(3195, 269, 'SO1', NULL, 1, 'Ability to analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3196, 269, 'SO2', NULL, 2, 'Ability to design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program’s discipline.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3197, 269, 'SO3', NULL, 3, 'Ability to communicate effectively in a variety of professional contexts.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3198, 269, 'SO4', NULL, 4, 'Ability to recognize professional responsibilities and make informed judgments in computing practice based on legal and ethical principles.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3199, 269, 'SO5', NULL, 5, 'Ability to function effectively as a member or leader of a team engaged in activities appropriate to the program’s discipline.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3200, 269, 'SO6', NULL, 6, 'Ability to identify and analyze user needs and take them into account in the selection, creation, integration, evaluation, and administration of computing-based systems.', '2025-12-07 08:29:20', '2025-12-07 08:29:20'),
(3202, 271, 'SO1', '', 1, '', '2025-12-08 09:59:50', '2025-12-08 09:59:50'),
(3203, 272, 'SO1', '', 1, '', '2025-12-08 13:38:14', '2025-12-08 13:38:14'),
(3204, 275, 'SO1', '', 1, 'Ability to analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3205, 275, 'SO2', '', 2, 'Ability to design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program’s discipline.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3206, 275, 'SO3', '', 3, 'Ability to communicate effectively in a variety of professional contexts.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3207, 275, 'SO4', '', 4, 'Ability to recognize professional responsibilities and make informed judgments in computing practice based on legal and ethical principles.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3208, 275, 'SO5', '', 5, 'Ability to function effectively as a member or leader of a team engaged in activities appropriate to the program’s discipline.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3209, 275, 'SO6', '', 6, 'Ability to identify and analyze user needs and take them into account in the selection, creation, integration, evaluation, and administration of computing-based systems.', '2025-12-10 05:39:28', '2025-12-10 06:04:10'),
(3211, 277, 'SO1', '', 1, '', '2025-12-10 07:58:22', '2025-12-10 07:58:22'),
(3212, 280, 'SO1', '', 1, 'Ability to analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3213, 280, 'SO2', '', 2, 'Ability to design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program’s discipline.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3214, 280, 'SO3', '', 3, 'Ability to communicate effectively in a variety of professional contexts.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3215, 280, 'SO4', '', 4, 'Ability to recognize professional responsibilities and make informed judgments in computing practice based on legal and ethical principles.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3216, 280, 'SO5', '', 5, 'Ability to function effectively as a member or leader of a team engaged in activities appropriate to the program’s discipline.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3217, 280, 'SO6', '', 6, 'Ability to identify and analyze user needs and take them into account in the selection, creation, integration, evaluation, and administration of computing-based systems.', '2025-12-11 02:30:32', '2025-12-11 03:54:26'),
(3218, 283, 'SO1', '', 1, '', '2025-12-14 19:33:46', '2025-12-14 19:37:16'),
(3219, 274, 'SO1', '', 1, '', '2025-12-26 13:12:17', '2025-12-27 08:53:43');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_submissions`
--

CREATE TABLE `syllabus_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `submitted_by` bigint(20) UNSIGNED NOT NULL,
  `from_status` enum('draft','pending_review','revision','approved','final_approval','final_approved') NOT NULL,
  `to_status` enum('draft','pending_review','revision','approved','final_approval','final_approved') NOT NULL,
  `action_by` bigint(20) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `action_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_submissions`
--

INSERT INTO `syllabus_submissions` (`id`, `syllabus_id`, `submitted_by`, `from_status`, `to_status`, `action_by`, `remarks`, `action_at`, `created_at`, `updated_at`) VALUES
(184, 268, 229, 'draft', 'pending_review', 229, NULL, '2025-12-07 05:03:34', '2025-12-07 05:03:34', '2025-12-07 05:03:34'),
(185, 268, 229, 'pending_review', 'approved', 231, NULL, '2025-12-07 05:19:04', '2025-12-07 05:19:04', '2025-12-07 05:19:04'),
(186, 269, 231, 'draft', 'pending_review', 231, NULL, '2025-12-08 06:29:22', '2025-12-08 06:29:22', '2025-12-08 06:29:22'),
(191, 271, 227, 'draft', 'pending_review', 227, NULL, '2025-12-08 09:53:09', '2025-12-08 09:53:09', '2025-12-08 09:53:09'),
(192, 271, 227, 'pending_review', 'revision', 234, NULL, '2025-12-08 09:54:40', '2025-12-08 09:54:40', '2025-12-08 09:54:40'),
(193, 271, 227, 'revision', 'pending_review', 227, NULL, '2025-12-08 09:57:13', '2025-12-08 09:57:13', '2025-12-08 09:57:13'),
(194, 271, 227, 'pending_review', 'approved', 234, NULL, '2025-12-08 09:57:23', '2025-12-08 09:57:23', '2025-12-08 09:57:23'),
(195, 271, 227, 'approved', 'final_approval', 227, NULL, '2025-12-08 10:00:02', '2025-12-08 10:00:02', '2025-12-08 10:00:02'),
(196, 272, 235, 'draft', 'pending_review', 235, NULL, '2025-12-08 13:38:59', '2025-12-08 13:38:59', '2025-12-08 13:38:59'),
(197, 275, 231, 'draft', 'pending_review', 231, NULL, '2025-12-10 05:50:35', '2025-12-10 05:50:35', '2025-12-10 05:50:35'),
(198, 275, 231, 'pending_review', 'revision', 236, NULL, '2025-12-10 05:53:20', '2025-12-10 05:53:20', '2025-12-10 05:53:20'),
(199, 275, 231, 'revision', 'pending_review', 231, NULL, '2025-12-10 05:59:32', '2025-12-10 05:59:32', '2025-12-10 05:59:32'),
(200, 275, 231, 'pending_review', 'revision', 236, NULL, '2025-12-10 06:00:03', '2025-12-10 06:00:03', '2025-12-10 06:00:03'),
(201, 275, 231, 'revision', 'pending_review', 231, NULL, '2025-12-10 06:04:14', '2025-12-10 06:04:14', '2025-12-10 06:04:14'),
(202, 275, 231, 'pending_review', 'approved', 236, NULL, '2025-12-10 06:04:37', '2025-12-10 06:04:37', '2025-12-10 06:04:37'),
(203, 275, 231, 'approved', 'final_approval', 231, NULL, '2025-12-10 06:08:05', '2025-12-10 06:08:05', '2025-12-10 06:08:05'),
(204, 280, 234, 'draft', 'pending_review', 234, NULL, '2025-12-11 02:31:40', '2025-12-11 02:31:40', '2025-12-11 02:31:40'),
(205, 280, 234, 'pending_review', 'revision', 231, NULL, '2025-12-11 02:32:26', '2025-12-11 02:32:26', '2025-12-11 02:32:26'),
(206, 280, 234, 'revision', 'pending_review', 234, NULL, '2025-12-11 03:54:30', '2025-12-11 03:54:30', '2025-12-11 03:54:30'),
(207, 283, 231, 'draft', 'pending_review', 231, NULL, '2025-12-14 19:35:30', '2025-12-14 19:35:30', '2025-12-14 19:35:30'),
(208, 283, 231, 'pending_review', 'revision', 234, NULL, '2025-12-14 19:36:30', '2025-12-14 19:36:30', '2025-12-14 19:36:30'),
(209, 283, 231, 'revision', 'pending_review', 231, NULL, '2025-12-14 19:37:19', '2025-12-14 19:37:19', '2025-12-14 19:37:19'),
(210, 272, 235, 'pending_review', 'approved', 234, NULL, '2025-12-14 19:37:28', '2025-12-14 19:37:28', '2025-12-14 19:37:28'),
(211, 283, 231, 'pending_review', 'approved', 234, NULL, '2025-12-14 19:37:40', '2025-12-14 19:37:40', '2025-12-14 19:37:40');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus_textbooks`
--

CREATE TABLE `syllabus_textbooks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `original_name` varchar(1000) NOT NULL,
  `type` enum('main','other') NOT NULL DEFAULT 'main',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `syllabus_textbooks`
--

INSERT INTO `syllabus_textbooks` (`id`, `syllabus_id`, `file_path`, `original_name`, `type`, `created_at`, `updated_at`) VALUES
(107, 268, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 'An Introduction to Business Analytics By Ger koole.pdf', 'main', '2025-12-07 04:27:20', '2025-12-07 04:27:20'),
(108, 269, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 'CS 111 - Module 1.pdf', 'main', '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(109, 274, NULL, 'sdfsd', 'main', '2025-12-10 06:38:07', '2025-12-10 06:38:07'),
(110, 277, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 'Computer-Programming-Fundamentals-for-Absolute-Beginners-by-Alexander-Bell.pdf', 'main', '2025-12-10 06:38:30', '2025-12-10 06:38:30'),
(111, 277, NULL, 'shfahfa', 'other', '2025-12-10 06:38:47', '2025-12-10 06:38:47'),
(112, 279, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 'Computer-Programming-Fundamentals-for-Absolute-Beginners-by-Alexander-Bell.pdf', 'main', '2025-12-11 02:07:56', '2025-12-11 02:07:56'),
(113, 280, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 'Computer-Programming-Fundamentals-for-Absolute-Beginners-by-Alexander-Bell.pdf', 'main', '2025-12-11 02:25:03', '2025-12-11 02:25:03'),
(114, 283, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 'Computer-Programming-Fundamentals-for-Absolute-Beginners-by-Alexander-Bell.pdf', 'main', '2025-12-14 19:29:58', '2025-12-14 19:29:58');

-- --------------------------------------------------------

--
-- Table structure for table `textbook_chunks`
--

CREATE TABLE `textbook_chunks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `textbook_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Optional reference id to a textbook record',
  `source_path` varchar(255) DEFAULT NULL,
  `chunk_index` int(11) NOT NULL DEFAULT 0,
  `content` longtext NOT NULL,
  `embedding` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`embedding`)),
  `tokens_estimate` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `textbook_chunks`
--

INSERT INTO `textbook_chunks` (`id`, `textbook_id`, `source_path`, `chunk_index`, `content`, `embedding`, `tokens_estimate`, `created_at`, `updated_at`) VALUES
(5256, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 0, 'Introduction to Computing Explorations in Language, Logic, and Machines David Evans University of Virginia For the latest version of this book and supplementary materials, visit: http://computingbook.org Version: August 19, 2011 Attribution-Noncommercial-Share Alike 3.0 United States License Contents 1 Computing 1 1.1 Processes, Procedures, and Computers . . . . . . . . . . . . . . . . 2 1.2 Measuring Computing Power . . . . . . . . . . . . . . . . . . . . . 3 1.2.1 Information . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 1.2.2 Representing Data . . . . . . . . . . . . . . . . . . . . . . . 8 1.2.3 Growth of Computing Power . . . . . . . . . . . . . . . . . 12 1.3 Science, Engineering, and the Liberal Arts . . . . . . . . . . . . . . 13 1.4 Summary and Roadmap . . . . . . . . . . . . . . . . . . . . . . . . 16 Part I: Dening Procedures 2 Language 19 2.1 Surface Forms and Meanings . . . . . . . . . . . . . . . . . . . . . 19 2.2 Language Construction . . . . . . . . . . . . . . . . . . . . . . . . . 20 2.3 Recursive Transition Networks . . . . . . . . . . . . . . . . . . . . . 22 2.4 Replacement Grammars . . . . . . . . . . . . . . . . . . . . . . . . 26 2.5 Summary . . ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5257, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 1, '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32 3 Programming 35 3.1 Problems with Natural Languages . . . . . . . . . . . . . . . . . . . 36 3.2 Programming Languages . . . . . . . . . . . . . . . . . . . . . . . . 37 3.3 Scheme . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 39 3.4 Expressions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 40 3.4.1 Primitives . . . . . . . . . . . . . . . . . . . . . . . . . . . . 40 3.4.2 Application Expressions . . . . . . . . . . . . . . . . . . . . 41 3.5 Denitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 44 3.6 Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 45 3.6.1 Making Procedures . . . . . . . . . . . . . . . . . . . . . . . 45 3.6.2 Substitution Model of Evaluation . . . . . . . . . . . . . . . 46 3.7 Decisions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48 3.8 Evaluation Rules . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 50 3.9 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52 4 Problems and Procedures 53 4.1 Solving Problems . . . . . . . . . . . . . . . . . . . . . . .', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5258, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 2, ' . . . . . 53 4.2 Composing Procedures . . . . . . . . . . . . . . . . . . . . . . . . . 54 4.2.1 Procedures as Inputs and Outputs . . . . . . . . . . . . . . 55 4.3 Recursive Problem Solving . . . . . . . . . . . . . . . . . . . . . . . 56 4.4 Evaluating Recursive Applications . . . . . . . . . . . . . . . . . . . 64 4.5 Developing Complex Programs . . . . . . . . . . . . . . . . . . . . 67 4.5.1 Printing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 68 4.5.2 Tracing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 69 4.6 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 73 5 Data 75 5.1 Types . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 75 5.2 Pairs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 77 5.2.1 Making Pairs . . . . . . . . . . . . . . . . . . . . . . . . . . . 79 5.2.2 Triples to Octuples . . . . . . . . . . . . . . . . . . . . . . . 80 5.3 Lists . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 81 5.4 List Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 83 5.4.1 Procedures that Examine Lists . . . . . . . . . . . . . . . . . 83 5', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5259, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 3, '.4.2 Generic Accumulators . . . . . . . . . . . . . . . . . . . . . 84 5.4.3 Procedures that Construct Lists . . . . . . . . . . . . . . . . 86 5.5 Lists of Lists . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 90 5.6 Data Abstraction . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 92 5.7 Summary of Part I . . . . . . . . . . . . . . . . . . . . . . . . . . . . 102 Part II: Analyzing Procedures 6 Machines 105 6.1 History of Computing Machines . . . . . . . . . . . . . . . . . . . . 106 6.2 Mechanizing Logic . . . . . . . . . . . . . . . . . . . . . . . . . . . 108 6.2.1 Implementing Logic . . . . . . . . . . . . . . . . . . . . . . 109 6.2.2 Composing Operations . . . . . . . . . . . . . . . . . . . . . 111 6.2.3 Arithmetic . . . . . . . . . . . . . . . . . . . . . . . . . . . . 114 6.3 Modeling Computing . . . . . . . . . . . . . . . . . . . . . . . . . . 116 6.3.1 Turing Machines . . . . . . . . . . . . . . . . . . . . . . . . 118 6.4 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 123 7 Cost 125 7.1 Empirical Measurements . . . . . . . . . . . . . . . . . . . . . . . . 125 7.2 Orders of Growth . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5260, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 4, '. . . . . . . . . . 129 7.2.1 BigO. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 130 7.2.2 Omega . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 133 7.2.3 Theta . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 134 7.3 Analyzing Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . 136 7.3.1 Input Size . . . . . . . . . . . . . . . . . . . . . . . . . . . . 136 7.3.2 Running Time . . . . . . . . . . . . . . . . . . . . . . . . . . 137 7.3.3 Worst Case Input . . . . . . . . . . . . . . . . . . . . . . . . 138 7.4 Growth Rates . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 139 7.4.1 No Growth: Constant Time . . . . . . . . . . . . . . . . . . 139 7.4.2 Linear Growth . . . . . . . . . . . . . . . . . . . . . . . . . . 140 7.4.3 Quadratic Growth . . . . . . . . . . . . . . . . . . . . . . . . 145 7.4.4 Exponential Growth . . . . . . . . . . . . . . . . . . . . . . . 147 7.4.5 Faster than Exponential Growth . . . . . . . . . . . . . . . . 149 7.4.6 Non-terminating Procedures . . . . . . . . . . . . . . . . . 149 7.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 149 8 Sorting and Searching 153 8.1 ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5261, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 5, 'Sorting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 153 8.1.1 Best-First Sort . . . . . . . . . . . . . . . . . . . . . . . . . . 153 8.1.2 Insertion Sort . . . . . . . . . . . . . . . . . . . . . . . . . . 157 8.1.3 Quicker Sorting . . . . . . . . . . . . . . . . . . . . . . . . . 158 8.1.4 Binary Trees . . . . . . . . . . . . . . . . . . . . . . . . . . . 161 8.1.5 Quicksort . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 166 8.2 Searching . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 167 8.2.1 Unstructured Search . . . . . . . . . . . . . . . . . . . . . . 168 8.2.2 Binary Search . . . . . . . . . . . . . . . . . . . . . . . . . . 168 8.2.3 Indexed Search . . . . . . . . . . . . . . . . . . . . . . . . . 169 8.3 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 178 Part III: Improving Expressiveness 9 Mutation 179 9.1 Assignment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 179 9.2 Impact of Mutation . . . . . . . . . . . . . . . . . . . . . . . . . . . 181 9.2.1 Names, Places, Frames, and Environments . . . . . . . . . 182 9.2.2 Evaluation Rules with State . . . . . . . . . . . . . .', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5262, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 6, ' . . . . 183 9.3 Mutable Pairs and Lists . . . . . . . . . . . . . . . . . . . . . . . . . 186 9.4 Imperative Programming . . . . . . . . . . . . . . . . . . . . . . . . 188 9.4.1 List Mutators . . . . . . . . . . . . . . . . . . . . . . . . . . . 188 9.4.2 Imperative Control Structures . . . . . . . . . . . . . . . . . 191 9.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 193 10 Objects 195 10.1 Packaging Procedures and State . . . . . . . . . . . . . . . . . . . . 196 10.1.1 Encapsulation . . . . . . . . . . . . . . . . . . . . . . . . . . 196 10.1.2 Messages . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 197 10.1.3 Object Terminology . . . . . . . . . . . . . . . . . . . . . . . 199 10.2 Inheritance . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 200 10.2.1 Implementing Subclasses . . . . . . . . . . . . . . . . . . . 202 10.2.2 Overriding Methods . . . . . . . . . . . . . . . . . . . . . . 204 10.3 Object-Oriented Programming . . . . . . . . . . . . . . . . . . . . 207 10.4 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 209 11 Interpreters 211 11.1 Python . . . . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5263, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 7, '. . . . . . . . . . . . . 212 11.1.1 Python Programs . . . . . . . . . . . . . . . . . . . . . . . . 213 11.1.2 Data Types . . . . . . . . . . . . . . . . . . . . . . . . . . . . 216 11.1.3 Applications and Invocations . . . . . . . . . . . . . . . . . 219 11.1.4 Control Statements . . . . . . . . . . . . . . . . . . . . . . . 219 11.2 Parser . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 221 11.3 Evaluator . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 223 11.3.1 Primitives . . . . . . . . . . . . . . . . . . . . . . . . . . . . 223 11.3.2 If Expressions . . . . . . . . . . . . . . . . . . . . . . . . . . 225 11.3.3 Denitions and Names . . . . . . . . . . . . . . . . . . . . . 226 11.3.4 Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . 227 11.3.5 Application . . . . . . . . . . . . . . . . . . . . . . . . . . . 228 11.3.6 Finishing the Interpreter . . . . . . . . . . . . . . . . . . . . 229 11.4 Lazy Evaluation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 229 11.4.1 Lazy Interpreter . . . . . . . . . . . . . . . . . . . . . . . . . 230 11.4.2 Lazy Programming . . . . . . . . . . . . . . . . . . . . . . . 232', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5264, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 8, ' 11.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 235 Part IV: The Limits of Computing 12 Computability 237 12.1 Mechanizing Reasoning . . . . . . . . . . . . . . . . . . . . . . . . 237 12.1.1 G¨odel\'s Incompleteness Theorem . . . . . . . . . . . . . . . 240 12.2 The Halting Problem . . . . . . . . . . . . . . . . . . . . . . . . . . 241 12.3 Universality . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 244 12.4 Proving Non-Computability . . . . . . . . . . . . . . . . . . . . . . 245 12.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 251 Indexes 253 Index . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 253 People . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 256 List of Explorations 1.1 Guessing Numbers . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 1.2 Twenty Questions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8 2.1 Power of Language Systems . . . . . . . . . . . . . . . . . . . . . . . 29 4.1 Square Roots . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 62 4.2 Recipes forp. . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5265, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 9, '. . . . . . . . . . . . . 69 4.3 Recursive Denitions and Games . . . . . . . . . . . . . . . . . . . . 71 5.1 Pascal\'s Triangle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 91 5.2 Pegboard Puzzle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 7.1 Multiplying Like Rabbits . . . . . . . . . . . . . . . . . . . . . . . . . 127 8.1 Searching the Web . . . . . . . . . . . . . . . . . . . . . . . . . . . . 177 12.1 Virus Detection . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 246 12.2 Busy Beavers . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 249 List of Figures 1.1 Using three bits to distinguish eight possible values. . . . . . . . . . . 6 2.1 Simple recursive transition network. . . . . . . . . . . . . . . . . . . . 22 2.2 RTN with a cycle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23 2.3 Recursive transition network with subnetworks. . . . . . . . . . . . . 24 2.4 AlternateNounsubnetwork. . . . . . . . . . . . . . . . . . . . . . . . . 24 2.5 RTN generating Alice runs. . . . . . . . . . . . . . . . . . . . . . . . . 25 2.6 System power relationships. . . . . . . . . . . . . . . . . . . . . . . . . 30 ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5266, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 10, '2.7 Converting theNumberproductions to an RTN. . . . . . . . . . . . . 31 2.8 Converting theMoreDigitsproductions to an RTN. . . . . . . . . . . . 31 2.9 Converting theDigitproductions to an RTN. . . . . . . . . . . . . . . 32 3.1 Running a Scheme program. . . . . . . . . . . . . . . . . . . . . . . . . 39 4.1 A procedure maps inputs to an output. . . . . . . . . . . . . . . . . . . 54 4.2 Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 54 4.3 Circular Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . . 57 4.4 Recursive Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . 58 4.5 Cornering the Queen. . . . . . . . . . . . . . . . . . . . . . . . . . . . . 72 5.1 Pegboard Puzzle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 6.1 Computingandwith wine. . . . . . . . . . . . . . . . . . . . . . . . . . 110 6.2 Computing logicalorandnotwith wine . . . . . . . . . . . . . . . . . 111 6.3 Computingand3by composing twoandfunctions. . . . . . . . . . . 112 6.4 Turing Machine model. . . . . . . . . . . . . . . . . . . . . . . . . . . . 119 6.5 Rules for checking balanced parentheses Turing Machine. . . . . . . . 121 6.6', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5267, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 11, ' Checking parentheses Turing Machine. . . . . . . . . . . . . . . . . . 121 7.1 Evaluation ofboprocedure. . . . . . . . . . . . . . . . . . . . . . . . 128 7.2 Visualization of the setsO(f),W(f), andQ(f). . . . . . . . . . . . . . 130 7.3 Orders of Growth. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 131 8.1 Unbalanced trees. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 165 9.1 Sample environments. . . . . . . . . . . . . . . . . . . . . . . . . . . . 182 9.2 Environment created to evaluate (bigger 3 4). . . . . . . . . . . . . . . 184 9.3 Environment after evaluating (dene inc(make-adder1)). . . . . . . 185 9.4 Environment for evaluating the body of (inc 149). . . . . . . . . . . . . 186 9.5 Mutable pair created by evaluating (set-mcdr! pair pair ). . . . . . . . 187 9.6 MutableList created by evaluating (mlist 1 2 3). . . . . . . . . . . . . . 187 10.1 Environment produced by evaluating: . . . . . . . . . . . . . . . . . . 197 10.2 Inheritance hierarchy. . . . . . . . . . . . . . . . . . . . . . . . . . . . 201 10.3 Counter class hierarchy. . . . . . . . . . . . . . . . . . . . . . . . . . . 206 12.1 Incomplete and inconsistent axiomatic systems. .', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5268, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 12, ' . . . . . . . . . . . 239 12.2 Universal Turing Machine. . . . . . . . . . . . . . . . . . . . . . . . . . 245 12.3 Two-state Busy Beaver Machine. . . . . . . . . . . . . . . . . . . . . . 249 Image Credits Most of the images in the book, including the tiles on the cover, were generated by the author. Some of the tile images on the cover are from ickr creative commons licenses images from: ell brown, Johnson Cameraface, cogdogblog, Cyberslayer, dmealif- fe, Dunechaser, MichaelFitz, Wole Fox, glingl, jurvetson, KayVee.INC, michaeld- beavers, and Oneras. The Van GoghStarry Nightimage from Section 1.2.2 is from the Google Art Project. The Apollo Guidance Computer image in Section 1.2.3 was released by NASA and is in the public domain. The trafc light in Section 2.1 is from iStock- Photo, and the rotary trafc signal is from the Wikimedia Commons. The pic- ture of Grace Hopper in Chapter 3 is from the Computer History Museum. The playing card images in Chapter 4 are from iStockPhoto. The images of Gauss, Heron, and Grace Hopper\'s bug are in the public domain. The Dilbert comic in Chapter 4 is licensed from United Feature Syndicate, Inc. The Pascal\'s triangle image in Excursion 5.1 ', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5269, 104, 'syllabi/textbooks/Ww3pfG4oOieCuDDkU5vcVfZRMKKsMoCTPZyn7dmZ.pdf', 13, 'is from Wikipedia and is in the public domain. The image of Ada Lovelace in Chapter 6 is from the Wikimedia Commons, of a painting by Margaret Carpenter. The odomoter image in Chapter 7 is from iStockPhoto, as is the image of the frustrated student. The Python snake charmer in Section 11.1 is from iStockPhoto. The Dynabook images at the end of Chapter 10 are from Alan Kay\'s paper. The xkcd comic a', NULL, 300, '2025-11-30 23:24:52', '2025-11-30 23:24:52'),
(5270, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 0, 'Introduction to Computing Explorations in Language, Logic, and Machines David Evans University of Virginia For the latest version of this book and supplementary materials, visit: http://computingbook.org Version: August 19, 2011 Attribution-Noncommercial-Share Alike 3.0 United States License Contents 1 Computing 1 1.1 Processes, Procedures, and Computers . . . . . . . . . . . . . . . . 2 1.2 Measuring Computing Power . . . . . . . . . . . . . . . . . . . . . 3 1.2.1 Information . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 1.2.2 Representing Data . . . . . . . . . . . . . . . . . . . . . . . 8 1.2.3 Growth of Computing Power . . . . . . . . . . . . . . . . . 12 1.3 Science, Engineering, and the Liberal Arts . . . . . . . . . . . . . . 13 1.4 Summary and Roadmap . . . . . . . . . . . . . . . . . . . . . . . . 16 Part I: Dening Procedures 2 Language 19 2.1 Surface Forms and Meanings . . . . . . . . . . . . . . . . . . . . . 19 2.2 Language Construction . . . . . . . . . . . . . . . . . . . . . . . . . 20 2.3 Recursive Transition Networks . . . . . . . . . . . . . . . . . . . . . 22 2.4 Replacement Grammars . . . . . . . . . . . . . . . . . . . . . . . . 26 2.5 Summary . . ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5271, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 1, '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32 3 Programming 35 3.1 Problems with Natural Languages . . . . . . . . . . . . . . . . . . . 36 3.2 Programming Languages . . . . . . . . . . . . . . . . . . . . . . . . 37 3.3 Scheme . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 39 3.4 Expressions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 40 3.4.1 Primitives . . . . . . . . . . . . . . . . . . . . . . . . . . . . 40 3.4.2 Application Expressions . . . . . . . . . . . . . . . . . . . . 41 3.5 Denitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 44 3.6 Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 45 3.6.1 Making Procedures . . . . . . . . . . . . . . . . . . . . . . . 45 3.6.2 Substitution Model of Evaluation . . . . . . . . . . . . . . . 46 3.7 Decisions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48 3.8 Evaluation Rules . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 50 3.9 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52 4 Problems and Procedures 53 4.1 Solving Problems . . . . . . . . . . . . . . . . . . . . . . .', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5272, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 2, ' . . . . . 53 4.2 Composing Procedures . . . . . . . . . . . . . . . . . . . . . . . . . 54 4.2.1 Procedures as Inputs and Outputs . . . . . . . . . . . . . . 55 4.3 Recursive Problem Solving . . . . . . . . . . . . . . . . . . . . . . . 56 4.4 Evaluating Recursive Applications . . . . . . . . . . . . . . . . . . . 64 4.5 Developing Complex Programs . . . . . . . . . . . . . . . . . . . . 67 4.5.1 Printing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 68 4.5.2 Tracing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 69 4.6 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 73 5 Data 75 5.1 Types . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 75 5.2 Pairs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 77 5.2.1 Making Pairs . . . . . . . . . . . . . . . . . . . . . . . . . . . 79 5.2.2 Triples to Octuples . . . . . . . . . . . . . . . . . . . . . . . 80 5.3 Lists . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 81 5.4 List Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 83 5.4.1 Procedures that Examine Lists . . . . . . . . . . . . . . . . . 83 5', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5273, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 3, '.4.2 Generic Accumulators . . . . . . . . . . . . . . . . . . . . . 84 5.4.3 Procedures that Construct Lists . . . . . . . . . . . . . . . . 86 5.5 Lists of Lists . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 90 5.6 Data Abstraction . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 92 5.7 Summary of Part I . . . . . . . . . . . . . . . . . . . . . . . . . . . . 102 Part II: Analyzing Procedures 6 Machines 105 6.1 History of Computing Machines . . . . . . . . . . . . . . . . . . . . 106 6.2 Mechanizing Logic . . . . . . . . . . . . . . . . . . . . . . . . . . . 108 6.2.1 Implementing Logic . . . . . . . . . . . . . . . . . . . . . . 109 6.2.2 Composing Operations . . . . . . . . . . . . . . . . . . . . . 111 6.2.3 Arithmetic . . . . . . . . . . . . . . . . . . . . . . . . . . . . 114 6.3 Modeling Computing . . . . . . . . . . . . . . . . . . . . . . . . . . 116 6.3.1 Turing Machines . . . . . . . . . . . . . . . . . . . . . . . . 118 6.4 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 123 7 Cost 125 7.1 Empirical Measurements . . . . . . . . . . . . . . . . . . . . . . . . 125 7.2 Orders of Growth . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5274, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 4, '. . . . . . . . . . 129 7.2.1 BigO. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 130 7.2.2 Omega . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 133 7.2.3 Theta . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 134 7.3 Analyzing Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . 136 7.3.1 Input Size . . . . . . . . . . . . . . . . . . . . . . . . . . . . 136 7.3.2 Running Time . . . . . . . . . . . . . . . . . . . . . . . . . . 137 7.3.3 Worst Case Input . . . . . . . . . . . . . . . . . . . . . . . . 138 7.4 Growth Rates . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 139 7.4.1 No Growth: Constant Time . . . . . . . . . . . . . . . . . . 139 7.4.2 Linear Growth . . . . . . . . . . . . . . . . . . . . . . . . . . 140 7.4.3 Quadratic Growth . . . . . . . . . . . . . . . . . . . . . . . . 145 7.4.4 Exponential Growth . . . . . . . . . . . . . . . . . . . . . . . 147 7.4.5 Faster than Exponential Growth . . . . . . . . . . . . . . . . 149 7.4.6 Non-terminating Procedures . . . . . . . . . . . . . . . . . 149 7.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 149 8 Sorting and Searching 153 8.1 ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5275, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 5, 'Sorting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 153 8.1.1 Best-First Sort . . . . . . . . . . . . . . . . . . . . . . . . . . 153 8.1.2 Insertion Sort . . . . . . . . . . . . . . . . . . . . . . . . . . 157 8.1.3 Quicker Sorting . . . . . . . . . . . . . . . . . . . . . . . . . 158 8.1.4 Binary Trees . . . . . . . . . . . . . . . . . . . . . . . . . . . 161 8.1.5 Quicksort . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 166 8.2 Searching . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 167 8.2.1 Unstructured Search . . . . . . . . . . . . . . . . . . . . . . 168 8.2.2 Binary Search . . . . . . . . . . . . . . . . . . . . . . . . . . 168 8.2.3 Indexed Search . . . . . . . . . . . . . . . . . . . . . . . . . 169 8.3 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 178 Part III: Improving Expressiveness 9 Mutation 179 9.1 Assignment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 179 9.2 Impact of Mutation . . . . . . . . . . . . . . . . . . . . . . . . . . . 181 9.2.1 Names, Places, Frames, and Environments . . . . . . . . . 182 9.2.2 Evaluation Rules with State . . . . . . . . . . . . . .', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5276, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 6, ' . . . . 183 9.3 Mutable Pairs and Lists . . . . . . . . . . . . . . . . . . . . . . . . . 186 9.4 Imperative Programming . . . . . . . . . . . . . . . . . . . . . . . . 188 9.4.1 List Mutators . . . . . . . . . . . . . . . . . . . . . . . . . . . 188 9.4.2 Imperative Control Structures . . . . . . . . . . . . . . . . . 191 9.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 193 10 Objects 195 10.1 Packaging Procedures and State . . . . . . . . . . . . . . . . . . . . 196 10.1.1 Encapsulation . . . . . . . . . . . . . . . . . . . . . . . . . . 196 10.1.2 Messages . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 197 10.1.3 Object Terminology . . . . . . . . . . . . . . . . . . . . . . . 199 10.2 Inheritance . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 200 10.2.1 Implementing Subclasses . . . . . . . . . . . . . . . . . . . 202 10.2.2 Overriding Methods . . . . . . . . . . . . . . . . . . . . . . 204 10.3 Object-Oriented Programming . . . . . . . . . . . . . . . . . . . . 207 10.4 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 209 11 Interpreters 211 11.1 Python . . . . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5277, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 7, '. . . . . . . . . . . . . 212 11.1.1 Python Programs . . . . . . . . . . . . . . . . . . . . . . . . 213 11.1.2 Data Types . . . . . . . . . . . . . . . . . . . . . . . . . . . . 216 11.1.3 Applications and Invocations . . . . . . . . . . . . . . . . . 219 11.1.4 Control Statements . . . . . . . . . . . . . . . . . . . . . . . 219 11.2 Parser . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 221 11.3 Evaluator . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 223 11.3.1 Primitives . . . . . . . . . . . . . . . . . . . . . . . . . . . . 223 11.3.2 If Expressions . . . . . . . . . . . . . . . . . . . . . . . . . . 225 11.3.3 Denitions and Names . . . . . . . . . . . . . . . . . . . . . 226 11.3.4 Procedures . . . . . . . . . . . . . . . . . . . . . . . . . . . . 227 11.3.5 Application . . . . . . . . . . . . . . . . . . . . . . . . . . . 228 11.3.6 Finishing the Interpreter . . . . . . . . . . . . . . . . . . . . 229 11.4 Lazy Evaluation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 229 11.4.1 Lazy Interpreter . . . . . . . . . . . . . . . . . . . . . . . . . 230 11.4.2 Lazy Programming . . . . . . . . . . . . . . . . . . . . . . . 232', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5278, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 8, ' 11.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 235 Part IV: The Limits of Computing 12 Computability 237 12.1 Mechanizing Reasoning . . . . . . . . . . . . . . . . . . . . . . . . 237 12.1.1 G¨odel\'s Incompleteness Theorem . . . . . . . . . . . . . . . 240 12.2 The Halting Problem . . . . . . . . . . . . . . . . . . . . . . . . . . 241 12.3 Universality . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 244 12.4 Proving Non-Computability . . . . . . . . . . . . . . . . . . . . . . 245 12.5 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 251 Indexes 253 Index . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 253 People . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 256 List of Explorations 1.1 Guessing Numbers . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 1.2 Twenty Questions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8 2.1 Power of Language Systems . . . . . . . . . . . . . . . . . . . . . . . 29 4.1 Square Roots . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 62 4.2 Recipes forp. . . . . . . . . . . . . . . . . . . ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5279, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 9, '. . . . . . . . . . . . . 69 4.3 Recursive Denitions and Games . . . . . . . . . . . . . . . . . . . . 71 5.1 Pascal\'s Triangle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 91 5.2 Pegboard Puzzle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 7.1 Multiplying Like Rabbits . . . . . . . . . . . . . . . . . . . . . . . . . 127 8.1 Searching the Web . . . . . . . . . . . . . . . . . . . . . . . . . . . . 177 12.1 Virus Detection . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 246 12.2 Busy Beavers . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 249 List of Figures 1.1 Using three bits to distinguish eight possible values. . . . . . . . . . . 6 2.1 Simple recursive transition network. . . . . . . . . . . . . . . . . . . . 22 2.2 RTN with a cycle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23 2.3 Recursive transition network with subnetworks. . . . . . . . . . . . . 24 2.4 AlternateNounsubnetwork. . . . . . . . . . . . . . . . . . . . . . . . . 24 2.5 RTN generating Alice runs. . . . . . . . . . . . . . . . . . . . . . . . . 25 2.6 System power relationships. . . . . . . . . . . . . . . . . . . . . . . . . 30 ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5280, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 10, '2.7 Converting theNumberproductions to an RTN. . . . . . . . . . . . . 31 2.8 Converting theMoreDigitsproductions to an RTN. . . . . . . . . . . . 31 2.9 Converting theDigitproductions to an RTN. . . . . . . . . . . . . . . 32 3.1 Running a Scheme program. . . . . . . . . . . . . . . . . . . . . . . . . 39 4.1 A procedure maps inputs to an output. . . . . . . . . . . . . . . . . . . 54 4.2 Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 54 4.3 Circular Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . . 57 4.4 Recursive Composition. . . . . . . . . . . . . . . . . . . . . . . . . . . 58 4.5 Cornering the Queen. . . . . . . . . . . . . . . . . . . . . . . . . . . . . 72 5.1 Pegboard Puzzle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 6.1 Computingandwith wine. . . . . . . . . . . . . . . . . . . . . . . . . . 110 6.2 Computing logicalorandnotwith wine . . . . . . . . . . . . . . . . . 111 6.3 Computingand3by composing twoandfunctions. . . . . . . . . . . 112 6.4 Turing Machine model. . . . . . . . . . . . . . . . . . . . . . . . . . . . 119 6.5 Rules for checking balanced parentheses Turing Machine. . . . . . . . 121 6.6', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5281, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 11, ' Checking parentheses Turing Machine. . . . . . . . . . . . . . . . . . 121 7.1 Evaluation ofboprocedure. . . . . . . . . . . . . . . . . . . . . . . . 128 7.2 Visualization of the setsO(f),W(f), andQ(f). . . . . . . . . . . . . . 130 7.3 Orders of Growth. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 131 8.1 Unbalanced trees. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 165 9.1 Sample environments. . . . . . . . . . . . . . . . . . . . . . . . . . . . 182 9.2 Environment created to evaluate (bigger 3 4). . . . . . . . . . . . . . . 184 9.3 Environment after evaluating (dene inc(make-adder1)). . . . . . . 185 9.4 Environment for evaluating the body of (inc 149). . . . . . . . . . . . . 186 9.5 Mutable pair created by evaluating (set-mcdr! pair pair ). . . . . . . . 187 9.6 MutableList created by evaluating (mlist 1 2 3). . . . . . . . . . . . . . 187 10.1 Environment produced by evaluating: . . . . . . . . . . . . . . . . . . 197 10.2 Inheritance hierarchy. . . . . . . . . . . . . . . . . . . . . . . . . . . . 201 10.3 Counter class hierarchy. . . . . . . . . . . . . . . . . . . . . . . . . . . 206 12.1 Incomplete and inconsistent axiomatic systems. .', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5282, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 12, ' . . . . . . . . . . . 239 12.2 Universal Turing Machine. . . . . . . . . . . . . . . . . . . . . . . . . . 245 12.3 Two-state Busy Beaver Machine. . . . . . . . . . . . . . . . . . . . . . 249 Image Credits Most of the images in the book, including the tiles on the cover, were generated by the author. Some of the tile images on the cover are from ickr creative commons licenses images from: ell brown, Johnson Cameraface, cogdogblog, Cyberslayer, dmealif- fe, Dunechaser, MichaelFitz, Wole Fox, glingl, jurvetson, KayVee.INC, michaeld- beavers, and Oneras. The Van GoghStarry Nightimage from Section 1.2.2 is from the Google Art Project. The Apollo Guidance Computer image in Section 1.2.3 was released by NASA and is in the public domain. The trafc light in Section 2.1 is from iStock- Photo, and the rotary trafc signal is from the Wikimedia Commons. The pic- ture of Grace Hopper in Chapter 3 is from the Computer History Museum. The playing card images in Chapter 4 are from iStockPhoto. The images of Gauss, Heron, and Grace Hopper\'s bug are in the public domain. The Dilbert comic in Chapter 4 is licensed from United Feature Syndicate, Inc. The Pascal\'s triangle image in Excursion 5.1 ', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5283, 105, 'syllabi/textbooks/YjWCUT8MMGug2vWGfdh4rm7DsPNqv4HLvQG8xRNH.pdf', 13, 'is from Wikipedia and is in the public domain. The image of Ada Lovelace in Chapter 6 is from the Wikimedia Commons, of a painting by Margaret Carpenter. The odomoter image in Chapter 7 is from iStockPhoto, as is the image of the frustrated student. The Python snake charmer in Section 11.1 is from iStockPhoto. The Dynabook images at the end of Chapter 10 are from Alan Kay\'s paper. The xkcd comic a', NULL, 300, '2025-12-01 00:57:00', '2025-12-01 00:57:00'),
(5298, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 0, 'AnIntroductiontoBusinessAnalytics Copyrightc!2019Ger Koole All rights reserved MG books, Amsterdam ISBN 978 90 820179 3 9 Cover design: Ingrid Brandenburg & Luciano Picozzi AnIntroductiontoBusinessAnalytics GerKoole MG books Amsterdam Preface Books on Business Analytics (BA) typically fall into two categories: manage- rial books without any technical details, and very technical books, written for BA majors who already have a background in advanced mathematics or computer science. This book tries to ﬁll the gap by discussing BA tech- niques at a level appropriate for readers with a less technical background. This makes it suitable for many different audiences, especially managers who want to better understand the work of their data scientists, or people who want to learn the basics of BA and do their ﬁrst BA projects themselves. The full range of BA-related topics is covered: from the many different techniques to an overview of managerial aspects; from comparisons of the usefulness of different techniques in different situations to their historical context. While working with this book, you will also learn appropriate tool- ing, especially R and a bit of Excel. There are exercises t', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5299, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 1, 'o sharpen your skills and test your understanding. Because this book contains a large variety of topics, I sought advice from many experts. I am especially indebted to Sandjai Bhulai, Bram Gorissen, Jeroen van Kasteren, Diederik Roijers and Qingchen Wang for their feed- back on scientiﬁc issues and Peggy Curley for editing. Business Analytics is a young ﬁeld in full development, which uses as- pects from various ﬁelds of science. Although I tried to integrate the knowl- edge from many ﬁelds, it is unavoidable that the content will be biased based on my background and experience. Please do not hesitate to send me an email if you have any ideas or comments to share. I sincerely hope that reading this book is a rewarding experience. All chapters can be read independently, but I advise to read Chapter1 ﬁrst to understand the connections between the chapters. The index at the end can be helpful for unknown terms and abbreviations. Ger Koole Amsterdam/Peymeinade, 2016–2019 i ii Koole — Business Analytics Contents Preface i Contents v 1 Introduction 1 1.1 What is business analytics?.................... 1 1.2 Historical overview......................... 5 1.3 Non-technical overview........', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5300, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 2, '.............. 7 1.4 Tooling................................ 10 1.5 Implementation........................... 14 1.6 Additional reading......................... 14 2 Going on a Tour with R 17 2.1 Getting started............................ 17 2.2 Learning R.............................. 19 2.3 Libraries............................... 20 2.4 Data structures........................... 20 2.5 Programming............................ 21 2.6 Simulation and hypothesis testing................ 22 2.7 Clustering.............................. 24 2.8 Regression and deep learning................... 25 2.9 Classiﬁcation............................. 26 2.10 Optimization............................. 28 2.11 Additional reading......................... 29 3 Variability 31 3.1 Summarizing data.......................... 32 3.2 Probability theory and the binomial distribution........ 34 3.3 Other distributions and the central limit theorem........ 41 iii iv Koole — Business Analytics 3.4 Parameter estimation........................ 49 3.5 Additional reading......................... 53 4 Machine Learning 55 4.1 Data preparation.......................... 56 4.2 Clustering.............................. 57', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5301, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 3, ' 4.3 Linear regression.......................... 59 4.4 Nonlinear prediction........................ 64 4.5 Forecasting.............................. 69 4.6 Classiﬁcation............................. 72 4.7 Additional reading......................... 76 5 Simulation 77 5.1 Monte Carlo simulation...................... 77 5.2 Discrete-event simulation..................... 80 5.3 Additional reading......................... 84 6 Linear Optimization 85 6.1 Problem formulation........................ 85 6.2 LO in Excel.............................. 89 6.3 Example LO problems....................... 92 6.4 Integer problems.......................... 95 6.5 Example ILO problems....................... 98 6.6 Modeling tools............................ 100 6.7 Modeling tricks........................... 101 6.8 Additional reading......................... 106 7 Combinatorial Optimization 107 7.1 The shortest path problem..................... 107 7.2 The maximum ﬂow problem ................... 111 7.3 The traveling salesman problem................. 112 7.4 Complexity.............................. 114 7.5 Additional reading......................... 116 8 Simulation Optimization 117 8.1 Introduction', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5302, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 4, '............................. 118 8.2 Comparing scenarios........................ 119 8.3 Ranking and selection....................... 119 8.4 Local search............................. 121 Contents v 8.5 Additional reading......................... 122 9 Dynamic Programming and Reinforcement Learning 123 9.1 Dynamic programming ...................... 124 9.2 Stochastic Dynamic Programming................ 126 9.3 Approximate Dynamic Programming .............. 129 9.4 Models with partial information................. 130 9.5 Reinforcement Learning...................... 132 9.6 Additional reading......................... 135 10 Answers to Exercises 137 Bibliography 153 Index 157 vi Koole — Business Analytics Chapter1 Introduction This chapter explains business analytics and data science without going into any technical detail. We will clarify the meaning of different terms used, put the current developments in a historical perspective, give the reader an idea of the potential of business analytics (BA), and give a high-level overview of the steps and pitfalls in implementing a BA strategy. Learning outcomesOn completion of this chapter, you will be able to: •describe in non-technical te', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5303, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 5, 'rms the ﬁeld of business analytics, the dif- ferent steps involved, the connections to other ﬁelds of study and its historical context •reﬂect on the skills and knowledge required to successfully apply busi- ness analytics in practice 1.1 What is business analytics? According to Wikipedia, ”Business analytics refers to the skills, technolo- gies, practices for continuous iterative exploration and investigation of past business performance to gain insight and drive business planning.” In short, BA is a rational, fact-based approach to decision making. These facts come from data, therefore BA is about the science and the skills to turn data into decisions. The science is mostlystatistics,artiﬁcial intelligence(data mining andmachine learning), andoptimization; the skills are computer skills, com- munication skills, project and change management, etc. 1 2 Koole — Business Analytics It should be clear that BA by itself is not a science. It is the total set of knowledge that is required to solve business problems in a rational way. To be a successful business analyst, experience in BA projects and knowledge of the business areas that the data comes from (such as healthcare, advertis- in', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5304, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 6, 'g, ﬁnance) is also very valuable. BA is often subdivided into three consecutive activities:descriptive ana- lytics,predictive analytics, andprescriptive analytics. During the descriptive phase, data is analyzed and patterns are found. The insights are conse- quently used in the predictive phase to predict what is likely to happen in the future, if the situation remains the same. Finally, in the prescriptive phase, alternative decisions are determined that change the situation and which will lead to desirable outcomes. Example 1.1A hotel chain analyzes its reservations to look for patterns: which are the busiest days of the week? What is the impact of events in the city? Is there a seasonal pattern? Etc. The outcomes are used to make a prediction for the revenue in the upcoming months. By changing the pricing of the rooms in certain situations (such as sports events), the expected revenue can be maximized. Analytics can only start when there is data. Certain organizations al- ready have a centralizeddata warehousein which relevant current and his- torical data is stored for the purpose of reporting and analytics. Setting up such a data warehouse and maintaining it is part of thebusi', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5305, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 7, 'ness intelligence (BI) strategy of a company. However, not all companies have such a central- ized database, and even when it exists it rarely contains all the information required for a certain analysis. Therefore, data often needs to be collected, cleansed and combined with other sources. Data collection, cleansing and further pre-processing is usually a very time-consuming task, often taking more time than the actual analysis. Example 1.2In the hotelrevenue managementexample above we need histor- ical data on reservations but also data on historical and future events in the sur- roundings of the hotel. There are many reasons why this data can be hard to get: reservation data may only be stored at an aggregated level, there may have been changes in IT systems which overrode previously collected data, there may be no centrally available list with events, etc. Many organizations assume they already have all the data required, but as soon as the data scientist asks for reservation data combined with the date the booking was made or the event list from the surrounding area, the hotel might ﬁnd out that they lack data. Chapter1— Introduction 3 Therefore, data collection and pre-proces', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5306, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 8, 'sing are always the ﬁrst steps of a BA project. Following the data collection and pre-processing the real data science steps begin with descriptive analytics. Moreover, a BA project does not end with prescriptive analytics, i.e., with generating an (optimal) decision. The decision has to be implemented, which requires various skills, such as knowledge of change management. To summarize, we distinguish the following steps in a BA project: The model above suggests a linear process, but in practice this is rarely the case. At many of the steps, depending on the outcome, you might re- visit earlier steps. For example, if the predictions are not accurate enough for a particular aaplication then you might collect extra data to improve them. Furthermore, not all BA projects include prescriptive analytics, many projects have insight or prediction as goal and therefore ﬁnish after the de- scriptive or predictive steps. The major scientiﬁc ﬁelds of study corresponding to these BA steps are: Next to cleansing,feature engineeringis an important part of data prepa- ration, to be discussed later. During descriptive analytics you get an under- standing of the data. You visualize the data and you ', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5307, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 9, 'summarize it using the tool of statistical data analysis. Getting a good understanding is crucial for making the right choices in the consecutive steps. Following the descriptive analytics a BA project continues with predic- tive analytics. A target value is speciﬁed which we want to predict. Based on the data available, the parameters of the selected predictive method are determined. We say that the model istrainedon the data. The methods originate from inferential statistics and machine learning, which have their respective roots in mathematics and computer science. Although the ap- proach and the background of these ﬁelds are quite different, the techniques 4 Koole — Business Analytics largely overlap. Example 1.3A debt collection agency wants to use its resources, mainly calls to debtors, in a better way. It collects data on payments which is enriched by exter- nal data on household composition and neighborhood characteristics. After the data analysis and visualization a method is selected that predicts, given the characteris- tics of the dept and the actions taken by the agengy, the probability that the deptor will pay off their debt. In the prescriptive step, which is to be d', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21');
INSERT INTO `textbook_chunks` (`id`, `textbook_id`, `source_path`, `chunk_index`, `content`, `embedding`, `tokens_estimate`, `created_at`, `updated_at`) VALUES
(5308, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 10, 'iscussed next, the best action for each deptor is determined. Finally, during the prescriptive analytics phase, options are found to maximize a certain objective. Because the future is always unpredictable to a certain extent, optimization techniques often have to account for this randomness. The ﬁeld that specializes in this is (mathematical)optimization. It overlaps partially withreinforcement learning, which has its roots in com- puter science. A special feature of reinforcement learning is that prediction and optimization are integrated: it combines in one method the predictive and prescriptive phases. Example 1.4Consider again Example1.2on hotel revenue management. After having studied the inﬂuence of events and for example intra-week ﬂuctuations on hotel reservations in the descriptive step demand per price class isforecastedin the predictive step. These forecasts are input to an optimization algorithm that determines on a daily basis the prices that maximize total revenue. We end this section by discussing two terms that are closely related to BA:Data scienceandbig data. Data science is an older term which has re- cently shifted in meaning and increased in popularity. It is ', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5309, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 11, 'a combination of different scientiﬁc ﬁelds all concerned with extracting knowledge from data, mainly data mining and statistics. Part of the popularity probably stems from the fact that the Harvard Business Review called a data scien- tist role ”the sexiest job of 21st century”, anticipating the huge demand for data scientists. The knowledge base of data scientists and business analysts largely overlap. However, the deliverable of BA is improved business per- formance, whereas data scientists focus more on methods and insights from data. Improved business performance requires optimization to generate de- cisions andsoft skillsto implement the decisions. Finally, a few words on big data. Big data differentiates itself from reg- ular data sets by the so-called 3 V’s:volume,variety, andvelocity. A data Chapter1— Introduction 5 Box 1.1. From randomized trials to using already available data The traditional way to do scientiﬁc research in the medical and behavorial sci- ences is through (double-blind)randomized trials. This means that subjects (e.g., patients) have to be selected, and by a randomized procedure they are made part of the trial or part of the control group. It is called do', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5310, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 12, 'uble blind when the subject and the researcher are both not aware of who is in which group. This kind of research set-up allows for a relatively simple statistical analysis, but it is often hard to implement and very time-consuming. Nowadays, data can often be obtained from Electronic Health Records and other data sources. This eliminates the need for separate trials. However, there will be all kinds of statisticalbiasesin the data, making it harder to make a fair comparison between treatments. For example, patients of a certain age or hav- ing certain symptoms might get more-often a certain treatment. This calls for advanced statistical methods to eliminate these biases. These methods are usu- ally not taught in medical curricula, requiring the help of expert data scientists. set is considered to be ”big data” when the amount of data is too much to be stored in a regular database, when it lacks a homogeneous structure (i.e., free text instead of well-described ﬁelds), and/or when it is only avail- able real-time. Big data requires adapted storage systems and analysis tech- niques in order to exploit it. Big data now receives a lot of attention due to the speed at which data is col', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5311, 107, 'syllabi/textbooks/ibx1jtI5K2ee29b6HqHoUInIwyzBCzeeZ3hPnq5A.pdf', 13, 'lected these days. As more and more devices and sensors automatically generating data are connected to the internet (theinternet of things) again, the amount of stored data doubles approximately every 3 years. However, most BA projects do not involve big data, but use with relatively small and structured data sets. It might have been the case that such a dataset had its origin in big data from whi', NULL, 300, '2025-12-07 04:27:21', '2025-12-07 04:27:21'),
(5312, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 0, 'Asst. Prof. Renz Mervin A. Salac College of Engineering and Computing Sciences Batangas State University ARASOF - Nasugbu C++: Starter Guide for Beginners 1 Chapter 1: Foundation of Computer Programming 2 Introduction COMPUTER PROGRAMMING is a step by step process of designing and developing various sets of computer programs to accomplish a specific computing outcome. The purpose of computer programming is to find a sequence of instructions that solve a specific problem on a computer [1]. Intended Learning Outcome After completing this module the students will be able to: 1. Gain knowledge on what is Computer Programming, 2. Understand and familiarize on different Programming Languages 3. Identify the basic instruction of a Programming Language 4. Familiarize on the function of a Compiler I. What is Computer Programming?  The art of making a computer do what you want it to do.  It is a ﬁeld that has to do with the analytical creation of source code that can be used to conﬁgure computer systems.  It is process of designing and building an executable computer program to accomplish a specific computing result or to perform a specific task.  Programming involves tasks such as: anal', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5313, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 1, 'ysis, generating algorithms, profiling algorithms\' accuracy and resource consumption, and the implementation of algorithms in a chosen programming language (commonly referred to as coding). Computer Programming is very easy if it is appropriately managed. There are many computer programming languages available so finalizing the right programming language is not an easy task. Programmers provide the basis for the creation and ongoing function of the systems that many people rely upon for all sorts of information exchange, both business related and for entertainment purposes Computer programmers may choose to function in a broad range of programming functions, or specialize in some aspect of development, support, or maintenance of computers for the home or workplace. II. What is a Programming Language?  It is a formal language which comprises a set of instruction that produce various kind of output. 3  Just like human languages, programming languages also follow grammar called syntax. There are certain basic program code elements which are common for all the programming languages [1].  A computer programming language consists of a set of symbols and characters, words, and grammar ', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5314, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 2, 'rules that permit people to construct instructions in the format that can be interpreted by the computer system.  Used in computer programming to implement algorithms. It is a vocabulary and set of grammatical rules for instructing a computer or computing devices to perform specific tasks.  The term Programming Language usually refers to high level languages.  Programming Language is Far more understandable to programmers than machine language because Programming Language resemble the structure and syntax of human language Code can be written much faster with PL than ML because programming languages automate instructions; one programming language instruction can cover many machine language instructions. III. THE BASIC INSTRUCTIONS OF PROGRAMMING LANGUAGE  Input - the user is giving something to the program. This means to provide the program with some data to be used in the program  Output – the program is giving something to the user. This means to display data on screen or write the data to a printer or a file.  Math – It is the addition, subtraction, multiplication, and division. These mathematical operations are performed according to an order of operations.  Conditional ', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5315, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 3, 'Execution – These are used to make decisions based on the conditions. Is a specific statements that allow to check a condition and execute certain parts of code depending on whether the condition is true or false?  Repetition – It means repeating a sequence of instructions a certain number of times, or until some specific result is achieved IV. Most Important Basic Elements for Programming Languages:  Programming Environment - This term sometimes reserved for environments containing language specific editors and source level debugging facilities; here, the term will be used in its broader sense to refer to all of the hardware and software in the environment used by the programmer [2].  Data Types – it is a classification that specifies which type of value a variable has and what type of mathematical, relational or logical operations can be applied to it without causing an error. 4  Variables - names you give to computer memory locations which are used to store values in a computer program [3].  Keywords - word that is reserved by a program because the word has a special meaning. It can be commands or parameters.  Arithmetical and Logical Operators - an operator in a programmi', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5316, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 4, 'ng language is a symbol that tells the compiler or interpreter to perform specific mathematical, relational or logical operation and produce final result. Arithmetic operators are used to perform mathematical operations like addition, subtraction, multiplication, etc. Logical operators are very important in any programming language and they help us take decisions based on certain conditions.  If else - conditions perform different computations or actions depending on whether a programmer-specified boolean condition evaluates to true or false.  Loops - is a sequence of instructions that is repeated until a certain condition is reached.  Numbers - numbers a simple whole integers and floating point numbers.  Characters - Characters are simple alphabets like a, b, c, d...., A, B, C, D,....., but with an exception. In computer programming, any single digit number like 0, 1, 2,....and special characters like $, %, +, -.... etc., are also treated as characters.  Arrays – used to store a collection of data. It is a data structure, which can store a fixed- size collection of elements of the same data type.  Functions - is a block of organized, reusable code that is used to perform a s', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5317, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 5, 'ingle, related action. Functions provide better modularity for your application and a high degree of code reusing.  Input and Output Operations - is to read a characters from the standard input device such as the keyboard and to output or writing it to the output unit usually the screen. V. Type of Programming Languages Any of various languages for expressing a set of detailed instructions for a digital computer. Such instructions can be executed directly when they are in the computer manufacturer-specific numerical form known as machine language, after a simple substitution process when expressed in a corresponding assembly language, or after translation from some “higher-level” language. Although there are many computer languages, relatively few are widely used [4]. 1. Machine language  Machine Language native language of computer.  Machine code is the fundamental language of a computer and is normally written as strings of binary 1s and 0s.  Since computers are digital devices, they only recognize binary data. Every program, video, image, and character of text is represented in binary. This binary data, or machine code, is processed as input by the CPU. The resulting output ', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5318, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 6, 'is sent to the operating system or an application, which displays the data visually [5]. 5  Machine language is difficult to read and write, since it does not resemble conventional mathematical notation or human language, and its codes vary from computer to computer. Example of Machine Language 01101000 01100101 01101100 01101100 01101111 0010000 0 01110111 01101111 01110010 01101100 01100100 Which is equivalent to hello world 2. Assembly Language  Assembly language is one level above machine language.  Known to be as second generation languages.  An assembly language is a low-level programming language designed for a specific type of processor.  These languages substitute alphabetic symbols for the binary codes of machine language.  In assembly language, symbols are used in place of absolute addresses to represent memory locations.  Mnemonics are used for operation code, i.e., single letters or short abbreviations that help the programmers to understand what the code represents.  Assembly language easier than machine The following is an example of assembly language that add the numbers 3 and 4: Mov eax, 3 mov ebx, 4 add eax, ebx, ecx Writing assembly language is a tedious ', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5319, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 7, 'process since each operation must be performed at a very basic level. 3. High level Programming language  The time and cost of creating machine and assembly languages was quite high. And this was the prime motivation for the development of high level languages.  1950 people started devising progressively more expressive languages that could be automatically converted into machine language by a program called compiler. This called high level languages because they were written at a higher level of abstraction than Assembly Lang.  COBOL (Common Business Oriented Language) the first of its kind.  Allows user to commands that were as much like English sentences as possible. 6  High level programming languages create computer programs using instructions that are much easier to understand than machine or assembly language code because you can use words that more clearly describe the task being performed.  Programmers write in high-level languages because they are easier to understand and are less complex than machine code. Source Code Source code is the term given to a set of instructions that are written in human readable programming language. Source code must be translated into m', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5320, 108, 'syllabi/textbooks/8iIS8JzJUkymnoiSNpbfZiPSG9pH611q7VmgOPNZ.pdf', 8, 'achine code before a computer can understand and execute it. Compiler A compiler is a special program that processes statements written in a particular programming language and turns them into machine language or \"code\" that a computer\'s processor uses. Compilers are very large programs, with error-checking and other abilities. Compiler process 1. Create the program. 2. Compiler will parse or analyses all of the language statements for its correctness. 3. If incorrect, throws an error 4. If no error, the compiler will convert source code to machine code. 5. It links different code files into a runnable program(know as exe) 6. Run the Program Activity Read  Difference between High Level And Low Level Languages https://www.geeksforgeeks.org/difference-between-high-level-and-low-level-languages/  High level languages vs Low level languages (Infographics) https://www.educba.com/high-level-languages-vs-low-level-languages/ Watch  Why Programming Is Important? https://www.youtube.com/watch?v=Dv7gLpW91DM  What is coding? https://www.youtube.com/watch?v=cKhVupvyhKk  The Brief History of Programming Languages https://www.youtube.com/watch?v=Pn5znSOGHcs', NULL, 300, '2025-12-07 08:30:59', '2025-12-07 08:30:59'),
(5321, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 0, 'Computer Programming Fundamentals for Absolute Beginners Alexander Bell © Copyright 2019 Alexander Bell - All rights reserved. The content contained within this book may not be reproduced, duplicated or transmitted without direct written permission from the author or the publisher. Under no circumstances will any blame or legal responsibility be held against the publisher, or author, for any damages, reparation, or monetary loss due to the information contained within this book. Either directly or indirectly. Legal Notice: This book is copyright protected. This book is only for personal use. You cannot amend, distribute, sell, use, quote or paraphrase any part, or the content within this book, without the consent of the author or publisher. Disclaimer Notice: Please note the information contained within this document is for educational and entertainment purposes only. All effort has been executed to present accurate, up to date, and reliable, complete information. No warranties of any kind are declared or implied. Readers acknowledge that the author is not engaging in the rendering of legal, financial, medical or professional advice. The content within this book has been derived fr', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5322, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 1, 'om various sources. Please consult a licensed professional before attempting any techniques outlined in this book. By reading this document, the reader agrees that under no circumstances is the author responsible for any losses, direct or indirect, which are incurred as a result of the use of information contained within this document, including, but not limited to, — errors, omissions, or inaccuracies. Table of Contents Introduction Chapter 1: Importance of Learning Computer Programming Understanding systems Educational interaction The case for creativity Coding for the future Important life lessons The evolution of technology Career path Chapter 2: Fundamental Programming Concepts Program structure Variable declaration Looping structures Control structures Syntax Chapter 3: Algorithms in Programming Sort algorithms Search algorithms String matching and parsing Hashing algorithms Dynamic programming Primality testing algorithms Exponentiation by squaring Chapter 4: Data Structures Multiple requests Data searches Processing speed Classification of data structures Linear data structures Non-linear data structures Data structure operations Chapter 5: Programming Languages 1 st Genera', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5323, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 2, 'tion – Machine language (1GL) 2 nd Generation – Assembly language (2GL) 3 rd Generation – High-level programming language (3GL) 4 th Generation – Very high-level languages (4GL) 5 th Generation – Neural networks and artificial intelligence (5GL) Characteristics of programming languages Chapter 6: Web Programming Factors to consider when choosing a programming language Programming languages Python CSS Java JavaScript PHP Ruby Swift SQL Objective C C C-Sharp (C#) C++ Chapter 7: Security in Programming Design security Simplicity Embrace secure coding Everyone is at risk Security by obscurity Privileged access Chapter 8: The Future of Programming Abstract programming Artificial intelligence (AI) Universal programming language More cloud computing Concerns with Internet of Things (IoT) Chapter 9: Common Programming Challenges Debugging Working smart User experience Estimates Constant updates Problems communicating Security concerns Relying on foreign code Lack of planning Finally Conclusion Introduction Technology is all around us. We are living in a dynamic world where interaction with computers and machines is becoming a reality with each passing day. There was once a time when human ', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5324, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 3, 'basic needs were limited to food, water and shelter. Today, access to the internet is considered a basic need in many parts of the world. If you want to know how true this is, pay attention to the outrage whenever there is a widespread network outage. The outrage is so much it might soon spark a revolution. Of interest is not just access to the internet, but the applications, tools and resources we connect to. Social media, for example, is driving an industrial revolution of some sort. A lot of activities take place on social networks, and they have nothing to do with basic socialization. Businesses are thriving off the back of social networks. Communities are growing bolder and stronger, participation in activities is heightened and so forth. Yet, this is just one aspect of the internet. There have been great developments in as far as technology is concerned. Today we are looking forward to a world where artificial intelligence takes center stage. Many research labs and affiliated companies around the world are already experimenting with this. Some companies have already rolled out their prototypes and are making plans for mass production. With all these developments, where does t', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5325, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 4, 'he average individual come in? What is your place in this highly connected society? Computer programming. Programming is no longer a preserve of a few individuals or geeks who end up in the IT department in some company, typing frantically at their keyboards. Programming is becoming a way of life. A careful analysis of some of the interactions we have today reveals that for a society that is as heavily leveraged on technology and computers, knowledge of the ins and outs of these systems should be basic, if not compulsory. Some critics fear that in the future, the world might be such a hostile place for individuals who lack basic programming skills. Developed countries realize this prospect for the future, and have introduced coding camps and training programs for young children. This way, we are nurturing future generations to be tech savvy from the ground-up. Such children learn some basic skills that most people older than them learned at an advanced stage in their lives. If at 9 years old, a child in 2025 has the same knowledge and skills about programming as an 18 year old in 2019, this is progress. This means that the child already has 9 years of experience ahead of their time', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5326, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 5, '. With all the discussions about the future and its prospects regarding programming, it is important to highlight the fact that computer programming is essentially about solving problems in an efficient way. This is the rudimentary reason why we build programs – to solve problems. Why would a teacher pull out a calculator to get the averages of the class scores in Math when they can key in the data in an Excel sheet and get the averages, totals and all kinds of computations in a second? This is just the simplest iteration of what you can do with basic programming knowledge. You solve problems without going through a longer, resource intensive process. The beauty of programing is that there is so much to learn. A lot of the things you might have learned in 2010 are no longer relevant in 2019. Some of them were not relevant as early as 2013. This is proof of the fact that technology and associated systems keep changing and they do at a very fast pace. You either keep up, or get left behind. Programming also opens up so many opportunities to an optimistic individual. There are so many diverse fields where your skills are appreciated. You can carve out a niche for yourself and serve yo', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5327, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 6, 'ur clients’ needs. You will also realize that in as much as there is a lot of development in the world, many companies are still struggling to migrate their operations into a modern and technology-friendly world. Therefore, there are so many opportunities for you to create cutting-edge solutions that such organizations would benefit from. This book gives you a primer into computer programming. You learn the basics upon which you can lay your foundation. In case you are, like most people, struggling to choose the first programming language you want to study, you will learn that each of these languages is unique to certain developments. Therefore, you can choose where to start depending on what you want to achieve out of your programming career. As you read on, remember to ease up on the pressure. You cannot learn everything at the same time. If you want to become one of the best in your field, you must be patient, take your time learning, and lay the perfect foundation. Reach out to people around you who can assist whenever you are stuck in a rut. More importantly, simplicity will almost always carry the day. Chapter 1: Importance of Learning Computer Programming Programming is one ', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5328, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 7, 'of the most important subjects you can learn today. It is at the forefront in innovation and development of environment friendly solutions to most of the problems we face in the world today. There are several steps involved in developing a program. The role of a programmer is to identify the problem, come up with a feasible solution, write a program to address it, test the program and release the program for the target audience. Once the program is released, the programmer must still keep an eye on it for debugging purposes. Technology keeps advancing, which means that programming advances in similar fashion. Considering the development environment we have today, you have more than enough reasons to consider a career in computer programming. The following are some reasons why knowledge of computer programming is useful: Understanding systems As a programmer, you have intricate knowledge on the performance and features of different programs. Therefore, whenever you interact with any program, you do not just use it as an average user, but your in-depth knowledge allows you to interact with it better than most. You understand why a given program is necessary and why it does what it do', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5329, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 8, 'es. You also know the limitations of some of the programs you interact with, which means you can come up with feasible expectations of your interaction with the programs so that you can fully utilize the accessories and the equipment available at your disposal. Educational interaction One of the fields that has benefited a great deal from programming is the education industry. Programmers are coming up with web applications that can do amazing things. Today people from all walks of life have access to some of the best educational facilities, and from top learning institutions all over the world. All they need to do is get online. The case for creativity Programming is a diverse field with lots of experts. Everyone specializes in something, and with specialization comes the need for robust creativity. Mundane techniques barely cut it these days. In an environment where everyone is clamoring to come up with a solution to major problems, creativity is important. Through programming, you will learn how to do a lot of awesome things, including developing some of the most amazing video games, animations and graphical illustrations. The more creative you are, the easier it is for you to g', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5330, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 9, 'et the attention of powerful entities in the tech industry. Before you know it, you might be head-hunted to work at Google. Coding for the future The future is now. Thanks to computer programming, we have a shot at experiencing futuristic concepts today. Developers are currently implementing artificial intelligence in their laboratories. These systems introduce a new way of interacting with computers, computer systems and networks. Together, the future looks bright, especially when you consider the speed with which the Internet of Things (IoT) is advancing. Programming for the future is not only limited to what happens in development labs worldwide, it is also about the people. Today many countries are reinventing their learning curriculums to make sure that their children are exposed to computer programming at a very early age. This is in realization of the fact that the future is bright with technologically empowered people. Starting kids on programming at an early age means that they have sufficient time to get used to devices and networks that exist all around them. This also gives them a better chance of changing the way they interact with technology around them. Most of these', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5331, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 10, ' children will learn the infinite details of how laptops, smartphones and other gadgets work before they get to their teenage years, something that most people in the former generations might have done in their twenties or thirties. Important life lessons Computer programming is not just about computers. There are so many other life lessons that you can learn from programming. Considering the interaction diversity you go through from the moment you take a project from conceptualization to implementation, evaluation and maintenance, there are so many lessons to learn in between. You learn the importance of working with milestones. Milestones help you break down gigantic tasks into smaller, manageable sub-tasks. Completing these tasks makes work easy for you and gives you something to cheer about. In life, celebrating the small wins helps you set the platform for bigger and better things. You will make a lot of mistakes in programming, especially when you are just starting out. This is not the end of the world. Mistakes are an opportunity for you to learn. Learning from mistakes makes you a better programmer and a better individual in general. It is not just about learning from mista', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5332, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 11, 'kes, but you also learn that there is no reason to fear failure, or mistakes. In programming, you will also learn the importance of teamwork. You cannot do it alone. You need a team around you, where everyone pulls their weight. Whenever you see someone receiving accolades for some good project in programming, remember that they never did it alone – most people do not. These are all important lessons that will define the way you interact with people around you both at work and at home. Some important social connections and networks will be created from these interactions too. The evolution of technology A lot of skeptics believe that some years down the line, computers will take over and we will be rendered jobless. Well, most of those who might be rendered jobless are people who cannot adapt. Computers essentially help to make life easier. There are so many systems in use today which have made work easier and more efficient for us. Considering this possibility, knowledge of computer programming will be useful in the near future. While most of the applications and programs are automated, they still need the input of professionals to ensure they work in the right manner. This is onl', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5333, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 12, 'y possible when you understand computer programming. Career path Whichever career path you choose, it is widely expected that you will need some basic knowledge of programming in the future. Take the marketing industry, for example. It is no longer about printing ads and posting them all over on billboards or coming up with a catchy tune for a radio ad. Marketing has evolved and today, knowledge of analytics, HTML, SQL comes in handy. Other than that, there is a demand for computer programming experts in the market, but very few people can meet those demands. Technology keeps advancing, and with it the need for experts who understand the technologies in place and more importantly, how to protect and maintain them. This shortage of experienced personnel also means that those who are available earn lucrative salaries. Chapter 2: Fundamental Programming Concepts Programming is essentially about solving problems. You write lines of code to save the world. Each program you write must satisfy a specific need, which eventually makes work easier. Before you set out to write a program, you must first understand the issue at hand. Ask yourself what you are trying to solve. One of the best th', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5334, 110, 'syllabi/textbooks/DBhrA1KEunXuoI5Pm1EnHwpAydo2Cx75JMhvQP88.pdf', 13, 'ings about using computers is that they are programmed to solve repetitive assignments. Take calculations, for example. You can use your calculator and work out answers to a given series of problems. It might take you a long time, but you will get it done eventually. However, with your computer, all you need is to create a formula and work out all the answers in seconds. Most problems have more th', NULL, 300, '2025-12-10 06:38:31', '2025-12-10 06:38:31'),
(5335, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 0, 'Computer Programming Fundamentals for Absolute Beginners Alexander Bell © Copyright 2019 Alexander Bell - All rights reserved. The content contained within this book may not be reproduced, duplicated or transmitted without direct written permission from the author or the publisher. Under no circumstances will any blame or legal responsibility be held against the publisher, or author, for any damages, reparation, or monetary loss due to the information contained within this book. Either directly or indirectly. Legal Notice: This book is copyright protected. This book is only for personal use. You cannot amend, distribute, sell, use, quote or paraphrase any part, or the content within this book, without the consent of the author or publisher. Disclaimer Notice: Please note the information contained within this document is for educational and entertainment purposes only. All effort has been executed to present accurate, up to date, and reliable, complete information. No warranties of any kind are declared or implied. Readers acknowledge that the author is not engaging in the rendering of legal, financial, medical or professional advice. The content within this book has been derived fr', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5336, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 1, 'om various sources. Please consult a licensed professional before attempting any techniques outlined in this book. By reading this document, the reader agrees that under no circumstances is the author responsible for any losses, direct or indirect, which are incurred as a result of the use of information contained within this document, including, but not limited to, — errors, omissions, or inaccuracies. Table of Contents Introduction Chapter 1: Importance of Learning Computer Programming Understanding systems Educational interaction The case for creativity Coding for the future Important life lessons The evolution of technology Career path Chapter 2: Fundamental Programming Concepts Program structure Variable declaration Looping structures Control structures Syntax Chapter 3: Algorithms in Programming Sort algorithms Search algorithms String matching and parsing Hashing algorithms Dynamic programming Primality testing algorithms Exponentiation by squaring Chapter 4: Data Structures Multiple requests Data searches Processing speed Classification of data structures Linear data structures Non-linear data structures Data structure operations Chapter 5: Programming Languages 1 st Genera', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5337, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 2, 'tion – Machine language (1GL) 2 nd Generation – Assembly language (2GL) 3 rd Generation – High-level programming language (3GL) 4 th Generation – Very high-level languages (4GL) 5 th Generation – Neural networks and artificial intelligence (5GL) Characteristics of programming languages Chapter 6: Web Programming Factors to consider when choosing a programming language Programming languages Python CSS Java JavaScript PHP Ruby Swift SQL Objective C C C-Sharp (C#) C++ Chapter 7: Security in Programming Design security Simplicity Embrace secure coding Everyone is at risk Security by obscurity Privileged access Chapter 8: The Future of Programming Abstract programming Artificial intelligence (AI) Universal programming language More cloud computing Concerns with Internet of Things (IoT) Chapter 9: Common Programming Challenges Debugging Working smart User experience Estimates Constant updates Problems communicating Security concerns Relying on foreign code Lack of planning Finally Conclusion Introduction Technology is all around us. We are living in a dynamic world where interaction with computers and machines is becoming a reality with each passing day. There was once a time when human ', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5338, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 3, 'basic needs were limited to food, water and shelter. Today, access to the internet is considered a basic need in many parts of the world. If you want to know how true this is, pay attention to the outrage whenever there is a widespread network outage. The outrage is so much it might soon spark a revolution. Of interest is not just access to the internet, but the applications, tools and resources we connect to. Social media, for example, is driving an industrial revolution of some sort. A lot of activities take place on social networks, and they have nothing to do with basic socialization. Businesses are thriving off the back of social networks. Communities are growing bolder and stronger, participation in activities is heightened and so forth. Yet, this is just one aspect of the internet. There have been great developments in as far as technology is concerned. Today we are looking forward to a world where artificial intelligence takes center stage. Many research labs and affiliated companies around the world are already experimenting with this. Some companies have already rolled out their prototypes and are making plans for mass production. With all these developments, where does t', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5339, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 4, 'he average individual come in? What is your place in this highly connected society? Computer programming. Programming is no longer a preserve of a few individuals or geeks who end up in the IT department in some company, typing frantically at their keyboards. Programming is becoming a way of life. A careful analysis of some of the interactions we have today reveals that for a society that is as heavily leveraged on technology and computers, knowledge of the ins and outs of these systems should be basic, if not compulsory. Some critics fear that in the future, the world might be such a hostile place for individuals who lack basic programming skills. Developed countries realize this prospect for the future, and have introduced coding camps and training programs for young children. This way, we are nurturing future generations to be tech savvy from the ground-up. Such children learn some basic skills that most people older than them learned at an advanced stage in their lives. If at 9 years old, a child in 2025 has the same knowledge and skills about programming as an 18 year old in 2019, this is progress. This means that the child already has 9 years of experience ahead of their time', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5340, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 5, '. With all the discussions about the future and its prospects regarding programming, it is important to highlight the fact that computer programming is essentially about solving problems in an efficient way. This is the rudimentary reason why we build programs – to solve problems. Why would a teacher pull out a calculator to get the averages of the class scores in Math when they can key in the data in an Excel sheet and get the averages, totals and all kinds of computations in a second? This is just the simplest iteration of what you can do with basic programming knowledge. You solve problems without going through a longer, resource intensive process. The beauty of programing is that there is so much to learn. A lot of the things you might have learned in 2010 are no longer relevant in 2019. Some of them were not relevant as early as 2013. This is proof of the fact that technology and associated systems keep changing and they do at a very fast pace. You either keep up, or get left behind. Programming also opens up so many opportunities to an optimistic individual. There are so many diverse fields where your skills are appreciated. You can carve out a niche for yourself and serve yo', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5341, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 6, 'ur clients’ needs. You will also realize that in as much as there is a lot of development in the world, many companies are still struggling to migrate their operations into a modern and technology-friendly world. Therefore, there are so many opportunities for you to create cutting-edge solutions that such organizations would benefit from. This book gives you a primer into computer programming. You learn the basics upon which you can lay your foundation. In case you are, like most people, struggling to choose the first programming language you want to study, you will learn that each of these languages is unique to certain developments. Therefore, you can choose where to start depending on what you want to achieve out of your programming career. As you read on, remember to ease up on the pressure. You cannot learn everything at the same time. If you want to become one of the best in your field, you must be patient, take your time learning, and lay the perfect foundation. Reach out to people around you who can assist whenever you are stuck in a rut. More importantly, simplicity will almost always carry the day. Chapter 1: Importance of Learning Computer Programming Programming is one ', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5342, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 7, 'of the most important subjects you can learn today. It is at the forefront in innovation and development of environment friendly solutions to most of the problems we face in the world today. There are several steps involved in developing a program. The role of a programmer is to identify the problem, come up with a feasible solution, write a program to address it, test the program and release the program for the target audience. Once the program is released, the programmer must still keep an eye on it for debugging purposes. Technology keeps advancing, which means that programming advances in similar fashion. Considering the development environment we have today, you have more than enough reasons to consider a career in computer programming. The following are some reasons why knowledge of computer programming is useful: Understanding systems As a programmer, you have intricate knowledge on the performance and features of different programs. Therefore, whenever you interact with any program, you do not just use it as an average user, but your in-depth knowledge allows you to interact with it better than most. You understand why a given program is necessary and why it does what it do', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5343, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 8, 'es. You also know the limitations of some of the programs you interact with, which means you can come up with feasible expectations of your interaction with the programs so that you can fully utilize the accessories and the equipment available at your disposal. Educational interaction One of the fields that has benefited a great deal from programming is the education industry. Programmers are coming up with web applications that can do amazing things. Today people from all walks of life have access to some of the best educational facilities, and from top learning institutions all over the world. All they need to do is get online. The case for creativity Programming is a diverse field with lots of experts. Everyone specializes in something, and with specialization comes the need for robust creativity. Mundane techniques barely cut it these days. In an environment where everyone is clamoring to come up with a solution to major problems, creativity is important. Through programming, you will learn how to do a lot of awesome things, including developing some of the most amazing video games, animations and graphical illustrations. The more creative you are, the easier it is for you to g', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5344, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 9, 'et the attention of powerful entities in the tech industry. Before you know it, you might be head-hunted to work at Google. Coding for the future The future is now. Thanks to computer programming, we have a shot at experiencing futuristic concepts today. Developers are currently implementing artificial intelligence in their laboratories. These systems introduce a new way of interacting with computers, computer systems and networks. Together, the future looks bright, especially when you consider the speed with which the Internet of Things (IoT) is advancing. Programming for the future is not only limited to what happens in development labs worldwide, it is also about the people. Today many countries are reinventing their learning curriculums to make sure that their children are exposed to computer programming at a very early age. This is in realization of the fact that the future is bright with technologically empowered people. Starting kids on programming at an early age means that they have sufficient time to get used to devices and networks that exist all around them. This also gives them a better chance of changing the way they interact with technology around them. Most of these', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5345, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 10, ' children will learn the infinite details of how laptops, smartphones and other gadgets work before they get to their teenage years, something that most people in the former generations might have done in their twenties or thirties. Important life lessons Computer programming is not just about computers. There are so many other life lessons that you can learn from programming. Considering the interaction diversity you go through from the moment you take a project from conceptualization to implementation, evaluation and maintenance, there are so many lessons to learn in between. You learn the importance of working with milestones. Milestones help you break down gigantic tasks into smaller, manageable sub-tasks. Completing these tasks makes work easy for you and gives you something to cheer about. In life, celebrating the small wins helps you set the platform for bigger and better things. You will make a lot of mistakes in programming, especially when you are just starting out. This is not the end of the world. Mistakes are an opportunity for you to learn. Learning from mistakes makes you a better programmer and a better individual in general. It is not just about learning from mista', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57');
INSERT INTO `textbook_chunks` (`id`, `textbook_id`, `source_path`, `chunk_index`, `content`, `embedding`, `tokens_estimate`, `created_at`, `updated_at`) VALUES
(5346, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 11, 'kes, but you also learn that there is no reason to fear failure, or mistakes. In programming, you will also learn the importance of teamwork. You cannot do it alone. You need a team around you, where everyone pulls their weight. Whenever you see someone receiving accolades for some good project in programming, remember that they never did it alone – most people do not. These are all important lessons that will define the way you interact with people around you both at work and at home. Some important social connections and networks will be created from these interactions too. The evolution of technology A lot of skeptics believe that some years down the line, computers will take over and we will be rendered jobless. Well, most of those who might be rendered jobless are people who cannot adapt. Computers essentially help to make life easier. There are so many systems in use today which have made work easier and more efficient for us. Considering this possibility, knowledge of computer programming will be useful in the near future. While most of the applications and programs are automated, they still need the input of professionals to ensure they work in the right manner. This is onl', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5347, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 12, 'y possible when you understand computer programming. Career path Whichever career path you choose, it is widely expected that you will need some basic knowledge of programming in the future. Take the marketing industry, for example. It is no longer about printing ads and posting them all over on billboards or coming up with a catchy tune for a radio ad. Marketing has evolved and today, knowledge of analytics, HTML, SQL comes in handy. Other than that, there is a demand for computer programming experts in the market, but very few people can meet those demands. Technology keeps advancing, and with it the need for experts who understand the technologies in place and more importantly, how to protect and maintain them. This shortage of experienced personnel also means that those who are available earn lucrative salaries. Chapter 2: Fundamental Programming Concepts Programming is essentially about solving problems. You write lines of code to save the world. Each program you write must satisfy a specific need, which eventually makes work easier. Before you set out to write a program, you must first understand the issue at hand. Ask yourself what you are trying to solve. One of the best th', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5348, 112, 'syllabi/textbooks/LSesqS1BG8ge94ND1qI80RXtTith4V2MSj5ZdlVV.pdf', 13, 'ings about using computers is that they are programmed to solve repetitive assignments. Take calculations, for example. You can use your calculator and work out answers to a given series of problems. It might take you a long time, but you will get it done eventually. However, with your computer, all you need is to create a formula and work out all the answers in seconds. Most problems have more th', NULL, 300, '2025-12-11 02:07:57', '2025-12-11 02:07:57'),
(5349, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 0, 'Computer Programming Fundamentals for Absolute Beginners Alexander Bell © Copyright 2019 Alexander Bell - All rights reserved. The content contained within this book may not be reproduced, duplicated or transmitted without direct written permission from the author or the publisher. Under no circumstances will any blame or legal responsibility be held against the publisher, or author, for any damages, reparation, or monetary loss due to the information contained within this book. Either directly or indirectly. Legal Notice: This book is copyright protected. This book is only for personal use. You cannot amend, distribute, sell, use, quote or paraphrase any part, or the content within this book, without the consent of the author or publisher. Disclaimer Notice: Please note the information contained within this document is for educational and entertainment purposes only. All effort has been executed to present accurate, up to date, and reliable, complete information. No warranties of any kind are declared or implied. Readers acknowledge that the author is not engaging in the rendering of legal, financial, medical or professional advice. The content within this book has been derived fr', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5350, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 1, 'om various sources. Please consult a licensed professional before attempting any techniques outlined in this book. By reading this document, the reader agrees that under no circumstances is the author responsible for any losses, direct or indirect, which are incurred as a result of the use of information contained within this document, including, but not limited to, — errors, omissions, or inaccuracies. Table of Contents Introduction Chapter 1: Importance of Learning Computer Programming Understanding systems Educational interaction The case for creativity Coding for the future Important life lessons The evolution of technology Career path Chapter 2: Fundamental Programming Concepts Program structure Variable declaration Looping structures Control structures Syntax Chapter 3: Algorithms in Programming Sort algorithms Search algorithms String matching and parsing Hashing algorithms Dynamic programming Primality testing algorithms Exponentiation by squaring Chapter 4: Data Structures Multiple requests Data searches Processing speed Classification of data structures Linear data structures Non-linear data structures Data structure operations Chapter 5: Programming Languages 1 st Genera', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5351, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 2, 'tion – Machine language (1GL) 2 nd Generation – Assembly language (2GL) 3 rd Generation – High-level programming language (3GL) 4 th Generation – Very high-level languages (4GL) 5 th Generation – Neural networks and artificial intelligence (5GL) Characteristics of programming languages Chapter 6: Web Programming Factors to consider when choosing a programming language Programming languages Python CSS Java JavaScript PHP Ruby Swift SQL Objective C C C-Sharp (C#) C++ Chapter 7: Security in Programming Design security Simplicity Embrace secure coding Everyone is at risk Security by obscurity Privileged access Chapter 8: The Future of Programming Abstract programming Artificial intelligence (AI) Universal programming language More cloud computing Concerns with Internet of Things (IoT) Chapter 9: Common Programming Challenges Debugging Working smart User experience Estimates Constant updates Problems communicating Security concerns Relying on foreign code Lack of planning Finally Conclusion Introduction Technology is all around us. We are living in a dynamic world where interaction with computers and machines is becoming a reality with each passing day. There was once a time when human ', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5352, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 3, 'basic needs were limited to food, water and shelter. Today, access to the internet is considered a basic need in many parts of the world. If you want to know how true this is, pay attention to the outrage whenever there is a widespread network outage. The outrage is so much it might soon spark a revolution. Of interest is not just access to the internet, but the applications, tools and resources we connect to. Social media, for example, is driving an industrial revolution of some sort. A lot of activities take place on social networks, and they have nothing to do with basic socialization. Businesses are thriving off the back of social networks. Communities are growing bolder and stronger, participation in activities is heightened and so forth. Yet, this is just one aspect of the internet. There have been great developments in as far as technology is concerned. Today we are looking forward to a world where artificial intelligence takes center stage. Many research labs and affiliated companies around the world are already experimenting with this. Some companies have already rolled out their prototypes and are making plans for mass production. With all these developments, where does t', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5353, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 4, 'he average individual come in? What is your place in this highly connected society? Computer programming. Programming is no longer a preserve of a few individuals or geeks who end up in the IT department in some company, typing frantically at their keyboards. Programming is becoming a way of life. A careful analysis of some of the interactions we have today reveals that for a society that is as heavily leveraged on technology and computers, knowledge of the ins and outs of these systems should be basic, if not compulsory. Some critics fear that in the future, the world might be such a hostile place for individuals who lack basic programming skills. Developed countries realize this prospect for the future, and have introduced coding camps and training programs for young children. This way, we are nurturing future generations to be tech savvy from the ground-up. Such children learn some basic skills that most people older than them learned at an advanced stage in their lives. If at 9 years old, a child in 2025 has the same knowledge and skills about programming as an 18 year old in 2019, this is progress. This means that the child already has 9 years of experience ahead of their time', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5354, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 5, '. With all the discussions about the future and its prospects regarding programming, it is important to highlight the fact that computer programming is essentially about solving problems in an efficient way. This is the rudimentary reason why we build programs – to solve problems. Why would a teacher pull out a calculator to get the averages of the class scores in Math when they can key in the data in an Excel sheet and get the averages, totals and all kinds of computations in a second? This is just the simplest iteration of what you can do with basic programming knowledge. You solve problems without going through a longer, resource intensive process. The beauty of programing is that there is so much to learn. A lot of the things you might have learned in 2010 are no longer relevant in 2019. Some of them were not relevant as early as 2013. This is proof of the fact that technology and associated systems keep changing and they do at a very fast pace. You either keep up, or get left behind. Programming also opens up so many opportunities to an optimistic individual. There are so many diverse fields where your skills are appreciated. You can carve out a niche for yourself and serve yo', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5355, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 6, 'ur clients’ needs. You will also realize that in as much as there is a lot of development in the world, many companies are still struggling to migrate their operations into a modern and technology-friendly world. Therefore, there are so many opportunities for you to create cutting-edge solutions that such organizations would benefit from. This book gives you a primer into computer programming. You learn the basics upon which you can lay your foundation. In case you are, like most people, struggling to choose the first programming language you want to study, you will learn that each of these languages is unique to certain developments. Therefore, you can choose where to start depending on what you want to achieve out of your programming career. As you read on, remember to ease up on the pressure. You cannot learn everything at the same time. If you want to become one of the best in your field, you must be patient, take your time learning, and lay the perfect foundation. Reach out to people around you who can assist whenever you are stuck in a rut. More importantly, simplicity will almost always carry the day. Chapter 1: Importance of Learning Computer Programming Programming is one ', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5356, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 7, 'of the most important subjects you can learn today. It is at the forefront in innovation and development of environment friendly solutions to most of the problems we face in the world today. There are several steps involved in developing a program. The role of a programmer is to identify the problem, come up with a feasible solution, write a program to address it, test the program and release the program for the target audience. Once the program is released, the programmer must still keep an eye on it for debugging purposes. Technology keeps advancing, which means that programming advances in similar fashion. Considering the development environment we have today, you have more than enough reasons to consider a career in computer programming. The following are some reasons why knowledge of computer programming is useful: Understanding systems As a programmer, you have intricate knowledge on the performance and features of different programs. Therefore, whenever you interact with any program, you do not just use it as an average user, but your in-depth knowledge allows you to interact with it better than most. You understand why a given program is necessary and why it does what it do', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5357, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 8, 'es. You also know the limitations of some of the programs you interact with, which means you can come up with feasible expectations of your interaction with the programs so that you can fully utilize the accessories and the equipment available at your disposal. Educational interaction One of the fields that has benefited a great deal from programming is the education industry. Programmers are coming up with web applications that can do amazing things. Today people from all walks of life have access to some of the best educational facilities, and from top learning institutions all over the world. All they need to do is get online. The case for creativity Programming is a diverse field with lots of experts. Everyone specializes in something, and with specialization comes the need for robust creativity. Mundane techniques barely cut it these days. In an environment where everyone is clamoring to come up with a solution to major problems, creativity is important. Through programming, you will learn how to do a lot of awesome things, including developing some of the most amazing video games, animations and graphical illustrations. The more creative you are, the easier it is for you to g', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5358, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 9, 'et the attention of powerful entities in the tech industry. Before you know it, you might be head-hunted to work at Google. Coding for the future The future is now. Thanks to computer programming, we have a shot at experiencing futuristic concepts today. Developers are currently implementing artificial intelligence in their laboratories. These systems introduce a new way of interacting with computers, computer systems and networks. Together, the future looks bright, especially when you consider the speed with which the Internet of Things (IoT) is advancing. Programming for the future is not only limited to what happens in development labs worldwide, it is also about the people. Today many countries are reinventing their learning curriculums to make sure that their children are exposed to computer programming at a very early age. This is in realization of the fact that the future is bright with technologically empowered people. Starting kids on programming at an early age means that they have sufficient time to get used to devices and networks that exist all around them. This also gives them a better chance of changing the way they interact with technology around them. Most of these', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5359, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 10, ' children will learn the infinite details of how laptops, smartphones and other gadgets work before they get to their teenage years, something that most people in the former generations might have done in their twenties or thirties. Important life lessons Computer programming is not just about computers. There are so many other life lessons that you can learn from programming. Considering the interaction diversity you go through from the moment you take a project from conceptualization to implementation, evaluation and maintenance, there are so many lessons to learn in between. You learn the importance of working with milestones. Milestones help you break down gigantic tasks into smaller, manageable sub-tasks. Completing these tasks makes work easy for you and gives you something to cheer about. In life, celebrating the small wins helps you set the platform for bigger and better things. You will make a lot of mistakes in programming, especially when you are just starting out. This is not the end of the world. Mistakes are an opportunity for you to learn. Learning from mistakes makes you a better programmer and a better individual in general. It is not just about learning from mista', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5360, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 11, 'kes, but you also learn that there is no reason to fear failure, or mistakes. In programming, you will also learn the importance of teamwork. You cannot do it alone. You need a team around you, where everyone pulls their weight. Whenever you see someone receiving accolades for some good project in programming, remember that they never did it alone – most people do not. These are all important lessons that will define the way you interact with people around you both at work and at home. Some important social connections and networks will be created from these interactions too. The evolution of technology A lot of skeptics believe that some years down the line, computers will take over and we will be rendered jobless. Well, most of those who might be rendered jobless are people who cannot adapt. Computers essentially help to make life easier. There are so many systems in use today which have made work easier and more efficient for us. Considering this possibility, knowledge of computer programming will be useful in the near future. While most of the applications and programs are automated, they still need the input of professionals to ensure they work in the right manner. This is onl', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5361, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 12, 'y possible when you understand computer programming. Career path Whichever career path you choose, it is widely expected that you will need some basic knowledge of programming in the future. Take the marketing industry, for example. It is no longer about printing ads and posting them all over on billboards or coming up with a catchy tune for a radio ad. Marketing has evolved and today, knowledge of analytics, HTML, SQL comes in handy. Other than that, there is a demand for computer programming experts in the market, but very few people can meet those demands. Technology keeps advancing, and with it the need for experts who understand the technologies in place and more importantly, how to protect and maintain them. This shortage of experienced personnel also means that those who are available earn lucrative salaries. Chapter 2: Fundamental Programming Concepts Programming is essentially about solving problems. You write lines of code to save the world. Each program you write must satisfy a specific need, which eventually makes work easier. Before you set out to write a program, you must first understand the issue at hand. Ask yourself what you are trying to solve. One of the best th', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5362, 113, 'syllabi/textbooks/wdBMEjf7q8fCjR7vFSt56CeUI9lAZ5rxIRjsXFfR.pdf', 13, 'ings about using computers is that they are programmed to solve repetitive assignments. Take calculations, for example. You can use your calculator and work out answers to a given series of problems. It might take you a long time, but you will get it done eventually. However, with your computer, all you need is to create a formula and work out all the answers in seconds. Most problems have more th', NULL, 300, '2025-12-11 02:25:04', '2025-12-11 02:25:04'),
(5363, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 0, 'Computer Programming Fundamentals for Absolute Beginners Alexander Bell © Copyright 2019 Alexander Bell - All rights reserved. The content contained within this book may not be reproduced, duplicated or transmitted without direct written permission from the author or the publisher. Under no circumstances will any blame or legal responsibility be held against the publisher, or author, for any damages, reparation, or monetary loss due to the information contained within this book. Either directly or indirectly. Legal Notice: This book is copyright protected. This book is only for personal use. You cannot amend, distribute, sell, use, quote or paraphrase any part, or the content within this book, without the consent of the author or publisher. Disclaimer Notice: Please note the information contained within this document is for educational and entertainment purposes only. All effort has been executed to present accurate, up to date, and reliable, complete information. No warranties of any kind are declared or implied. Readers acknowledge that the author is not engaging in the rendering of legal, financial, medical or professional advice. The content within this book has been derived fr', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5364, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 1, 'om various sources. Please consult a licensed professional before attempting any techniques outlined in this book. By reading this document, the reader agrees that under no circumstances is the author responsible for any losses, direct or indirect, which are incurred as a result of the use of information contained within this document, including, but not limited to, — errors, omissions, or inaccuracies. Table of Contents Introduction Chapter 1: Importance of Learning Computer Programming Understanding systems Educational interaction The case for creativity Coding for the future Important life lessons The evolution of technology Career path Chapter 2: Fundamental Programming Concepts Program structure Variable declaration Looping structures Control structures Syntax Chapter 3: Algorithms in Programming Sort algorithms Search algorithms String matching and parsing Hashing algorithms Dynamic programming Primality testing algorithms Exponentiation by squaring Chapter 4: Data Structures Multiple requests Data searches Processing speed Classification of data structures Linear data structures Non-linear data structures Data structure operations Chapter 5: Programming Languages 1 st Genera', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5365, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 2, 'tion – Machine language (1GL) 2 nd Generation – Assembly language (2GL) 3 rd Generation – High-level programming language (3GL) 4 th Generation – Very high-level languages (4GL) 5 th Generation – Neural networks and artificial intelligence (5GL) Characteristics of programming languages Chapter 6: Web Programming Factors to consider when choosing a programming language Programming languages Python CSS Java JavaScript PHP Ruby Swift SQL Objective C C C-Sharp (C#) C++ Chapter 7: Security in Programming Design security Simplicity Embrace secure coding Everyone is at risk Security by obscurity Privileged access Chapter 8: The Future of Programming Abstract programming Artificial intelligence (AI) Universal programming language More cloud computing Concerns with Internet of Things (IoT) Chapter 9: Common Programming Challenges Debugging Working smart User experience Estimates Constant updates Problems communicating Security concerns Relying on foreign code Lack of planning Finally Conclusion Introduction Technology is all around us. We are living in a dynamic world where interaction with computers and machines is becoming a reality with each passing day. There was once a time when human ', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5366, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 3, 'basic needs were limited to food, water and shelter. Today, access to the internet is considered a basic need in many parts of the world. If you want to know how true this is, pay attention to the outrage whenever there is a widespread network outage. The outrage is so much it might soon spark a revolution. Of interest is not just access to the internet, but the applications, tools and resources we connect to. Social media, for example, is driving an industrial revolution of some sort. A lot of activities take place on social networks, and they have nothing to do with basic socialization. Businesses are thriving off the back of social networks. Communities are growing bolder and stronger, participation in activities is heightened and so forth. Yet, this is just one aspect of the internet. There have been great developments in as far as technology is concerned. Today we are looking forward to a world where artificial intelligence takes center stage. Many research labs and affiliated companies around the world are already experimenting with this. Some companies have already rolled out their prototypes and are making plans for mass production. With all these developments, where does t', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5367, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 4, 'he average individual come in? What is your place in this highly connected society? Computer programming. Programming is no longer a preserve of a few individuals or geeks who end up in the IT department in some company, typing frantically at their keyboards. Programming is becoming a way of life. A careful analysis of some of the interactions we have today reveals that for a society that is as heavily leveraged on technology and computers, knowledge of the ins and outs of these systems should be basic, if not compulsory. Some critics fear that in the future, the world might be such a hostile place for individuals who lack basic programming skills. Developed countries realize this prospect for the future, and have introduced coding camps and training programs for young children. This way, we are nurturing future generations to be tech savvy from the ground-up. Such children learn some basic skills that most people older than them learned at an advanced stage in their lives. If at 9 years old, a child in 2025 has the same knowledge and skills about programming as an 18 year old in 2019, this is progress. This means that the child already has 9 years of experience ahead of their time', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5368, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 5, '. With all the discussions about the future and its prospects regarding programming, it is important to highlight the fact that computer programming is essentially about solving problems in an efficient way. This is the rudimentary reason why we build programs – to solve problems. Why would a teacher pull out a calculator to get the averages of the class scores in Math when they can key in the data in an Excel sheet and get the averages, totals and all kinds of computations in a second? This is just the simplest iteration of what you can do with basic programming knowledge. You solve problems without going through a longer, resource intensive process. The beauty of programing is that there is so much to learn. A lot of the things you might have learned in 2010 are no longer relevant in 2019. Some of them were not relevant as early as 2013. This is proof of the fact that technology and associated systems keep changing and they do at a very fast pace. You either keep up, or get left behind. Programming also opens up so many opportunities to an optimistic individual. There are so many diverse fields where your skills are appreciated. You can carve out a niche for yourself and serve yo', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5369, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 6, 'ur clients’ needs. You will also realize that in as much as there is a lot of development in the world, many companies are still struggling to migrate their operations into a modern and technology-friendly world. Therefore, there are so many opportunities for you to create cutting-edge solutions that such organizations would benefit from. This book gives you a primer into computer programming. You learn the basics upon which you can lay your foundation. In case you are, like most people, struggling to choose the first programming language you want to study, you will learn that each of these languages is unique to certain developments. Therefore, you can choose where to start depending on what you want to achieve out of your programming career. As you read on, remember to ease up on the pressure. You cannot learn everything at the same time. If you want to become one of the best in your field, you must be patient, take your time learning, and lay the perfect foundation. Reach out to people around you who can assist whenever you are stuck in a rut. More importantly, simplicity will almost always carry the day. Chapter 1: Importance of Learning Computer Programming Programming is one ', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5370, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 7, 'of the most important subjects you can learn today. It is at the forefront in innovation and development of environment friendly solutions to most of the problems we face in the world today. There are several steps involved in developing a program. The role of a programmer is to identify the problem, come up with a feasible solution, write a program to address it, test the program and release the program for the target audience. Once the program is released, the programmer must still keep an eye on it for debugging purposes. Technology keeps advancing, which means that programming advances in similar fashion. Considering the development environment we have today, you have more than enough reasons to consider a career in computer programming. The following are some reasons why knowledge of computer programming is useful: Understanding systems As a programmer, you have intricate knowledge on the performance and features of different programs. Therefore, whenever you interact with any program, you do not just use it as an average user, but your in-depth knowledge allows you to interact with it better than most. You understand why a given program is necessary and why it does what it do', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5371, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 8, 'es. You also know the limitations of some of the programs you interact with, which means you can come up with feasible expectations of your interaction with the programs so that you can fully utilize the accessories and the equipment available at your disposal. Educational interaction One of the fields that has benefited a great deal from programming is the education industry. Programmers are coming up with web applications that can do amazing things. Today people from all walks of life have access to some of the best educational facilities, and from top learning institutions all over the world. All they need to do is get online. The case for creativity Programming is a diverse field with lots of experts. Everyone specializes in something, and with specialization comes the need for robust creativity. Mundane techniques barely cut it these days. In an environment where everyone is clamoring to come up with a solution to major problems, creativity is important. Through programming, you will learn how to do a lot of awesome things, including developing some of the most amazing video games, animations and graphical illustrations. The more creative you are, the easier it is for you to g', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5372, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 9, 'et the attention of powerful entities in the tech industry. Before you know it, you might be head-hunted to work at Google. Coding for the future The future is now. Thanks to computer programming, we have a shot at experiencing futuristic concepts today. Developers are currently implementing artificial intelligence in their laboratories. These systems introduce a new way of interacting with computers, computer systems and networks. Together, the future looks bright, especially when you consider the speed with which the Internet of Things (IoT) is advancing. Programming for the future is not only limited to what happens in development labs worldwide, it is also about the people. Today many countries are reinventing their learning curriculums to make sure that their children are exposed to computer programming at a very early age. This is in realization of the fact that the future is bright with technologically empowered people. Starting kids on programming at an early age means that they have sufficient time to get used to devices and networks that exist all around them. This also gives them a better chance of changing the way they interact with technology around them. Most of these', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5373, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 10, ' children will learn the infinite details of how laptops, smartphones and other gadgets work before they get to their teenage years, something that most people in the former generations might have done in their twenties or thirties. Important life lessons Computer programming is not just about computers. There are so many other life lessons that you can learn from programming. Considering the interaction diversity you go through from the moment you take a project from conceptualization to implementation, evaluation and maintenance, there are so many lessons to learn in between. You learn the importance of working with milestones. Milestones help you break down gigantic tasks into smaller, manageable sub-tasks. Completing these tasks makes work easy for you and gives you something to cheer about. In life, celebrating the small wins helps you set the platform for bigger and better things. You will make a lot of mistakes in programming, especially when you are just starting out. This is not the end of the world. Mistakes are an opportunity for you to learn. Learning from mistakes makes you a better programmer and a better individual in general. It is not just about learning from mista', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5374, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 11, 'kes, but you also learn that there is no reason to fear failure, or mistakes. In programming, you will also learn the importance of teamwork. You cannot do it alone. You need a team around you, where everyone pulls their weight. Whenever you see someone receiving accolades for some good project in programming, remember that they never did it alone – most people do not. These are all important lessons that will define the way you interact with people around you both at work and at home. Some important social connections and networks will be created from these interactions too. The evolution of technology A lot of skeptics believe that some years down the line, computers will take over and we will be rendered jobless. Well, most of those who might be rendered jobless are people who cannot adapt. Computers essentially help to make life easier. There are so many systems in use today which have made work easier and more efficient for us. Considering this possibility, knowledge of computer programming will be useful in the near future. While most of the applications and programs are automated, they still need the input of professionals to ensure they work in the right manner. This is onl', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5375, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 12, 'y possible when you understand computer programming. Career path Whichever career path you choose, it is widely expected that you will need some basic knowledge of programming in the future. Take the marketing industry, for example. It is no longer about printing ads and posting them all over on billboards or coming up with a catchy tune for a radio ad. Marketing has evolved and today, knowledge of analytics, HTML, SQL comes in handy. Other than that, there is a demand for computer programming experts in the market, but very few people can meet those demands. Technology keeps advancing, and with it the need for experts who understand the technologies in place and more importantly, how to protect and maintain them. This shortage of experienced personnel also means that those who are available earn lucrative salaries. Chapter 2: Fundamental Programming Concepts Programming is essentially about solving problems. You write lines of code to save the world. Each program you write must satisfy a specific need, which eventually makes work easier. Before you set out to write a program, you must first understand the issue at hand. Ask yourself what you are trying to solve. One of the best th', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59'),
(5376, 114, 'syllabi/textbooks/2g3tN87yTxZ2NaIJaedQQuUS8wCP3AUXbXDjCau1.pdf', 13, 'ings about using computers is that they are programmed to solve repetitive assignments. Take calculations, for example. You can use your calculator and work out answers to a given series of problems. It might take you a long time, but you will get it done eventually. However, with your computer, all you need is to create a formula and work out all the answers in seconds. Most problems have more th', NULL, 300, '2025-12-14 19:29:59', '2025-12-14 19:29:59');

-- --------------------------------------------------------

--
-- Table structure for table `tla`
--

CREATE TABLE `tla` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_id` bigint(20) UNSIGNED NOT NULL,
  `ch` varchar(255) DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `wks` varchar(255) DEFAULT NULL,
  `outcomes` text DEFAULT NULL,
  `ilo` varchar(255) DEFAULT NULL,
  `so` varchar(255) DEFAULT NULL,
  `delivery` varchar(255) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tla`
--

INSERT INTO `tla` (`id`, `syllabus_id`, `ch`, `topic`, `wks`, `outcomes`, `ilo`, `so`, `delivery`, `position`, `created_at`, `updated_at`) VALUES
(1010, 157, '', '', '2', '', '', '', '', 0, '2025-11-25 01:48:33', '2025-11-25 01:48:33'),
(1011, 157, '', '', '3', '', '', '', '', 1, '2025-11-25 01:48:33', '2025-11-25 01:48:33'),
(1012, 157, '', '', '1', '', '', '', '', 2, '2025-11-25 01:48:33', '2025-11-25 01:48:33'),
(1013, 157, '', '', '4', '', '', '', '', 3, '2025-11-25 01:48:33', '2025-11-25 01:48:33'),
(1015, 179, 'a', 'a', '1', '', '', '', '', 0, '2025-11-26 19:46:57', '2025-11-26 19:46:57'),
(1020, 180, '', '', '23', '', '', '', '', 0, '2025-11-26 19:55:01', '2025-11-26 19:55:01'),
(1134, 225, '', 'Orientation & Introduction', '1', 'VMGO Orientation, Presentation of \nSyllabus, Class Rules', '', '', 'Face-to-face/  Online Discussion', 0, '2025-12-01 03:46:49', '2025-12-01 03:46:49'),
(1135, 225, '1', 'Main Topic 1: Overview of Big Data and \nAnalytics\n\nAssignment #1\nLaboratory Activity #1', '1-2', 'Describe the basic concepts on \nbusiness intelligence, Big Data and \nbusiness analytics                        \nDiscuss the importance of business \nanalytics in decision making                        \nTrace the evolution of business \nanalytics                                     \nDiscuss the scope of business analytics                                                          \nDiscuss the importance of data in \nbusiness analytics', '1,2', '1', 'Face-to\nface/Online \nDiscussion,  \nVideos,\n Practical Work, \nModule', 1, '2025-12-01 03:46:49', '2025-12-01 03:46:49'),
(1140, 239, '2', 'sdfsd', '23', 'ddfsd', '23', '3', 'dsfsdfsdfsd', 0, '2025-12-01 18:38:13', '2025-12-01 18:38:13'),
(1141, 267, '', '', '', '', '', '', '', 1, '2025-12-07 03:58:29', '2025-12-07 03:58:29'),
(1175, 268, '', 'Orientation', '1', '', '', '', '', 0, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(1176, 268, '1', 'Main Topic #1 Introduction to Business Analytics\n\nAssignment#1\nQuiz#1', '1', '', '1,2', '1,3', '', 1, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(1177, 268, '', '', '', '', '', '', '', 2, '2025-12-07 05:02:33', '2025-12-07 05:02:33'),
(1178, 269, '', '', '', '', '', '', '', 1, '2025-12-07 08:19:23', '2025-12-07 08:19:23'),
(1179, 270, '', '', '', '', '', '', '', 1, '2025-12-08 06:37:18', '2025-12-08 06:37:18'),
(1182, 271, '', '', '', '', '', '', '', 0, '2025-12-08 09:59:50', '2025-12-08 09:59:50'),
(1185, 272, '', '', '', '', '', '', '', 0, '2025-12-08 13:38:15', '2025-12-08 13:38:15'),
(1186, 273, '', '', '', '', '', '', '', 1, '2025-12-09 03:13:20', '2025-12-09 03:13:20'),
(1202, 275, '', '', '', '', '', '', '', 0, '2025-12-10 06:04:10', '2025-12-10 06:04:10'),
(1203, 276, '', '', '', '', '', '', '', 1, '2025-12-10 06:34:43', '2025-12-10 06:34:43'),
(1205, 278, '', '', '', '', '', '', '', 1, '2025-12-10 07:31:39', '2025-12-10 07:31:39'),
(1207, 277, '', '', '', '', '', '', '', 0, '2025-12-10 07:58:22', '2025-12-10 07:58:22'),
(1208, 279, '', '', '', '', '', '', '', 1, '2025-12-11 02:06:23', '2025-12-11 02:06:23'),
(1214, 281, '', '', '', '', '', '', '', 1, '2025-12-11 03:28:03', '2025-12-11 03:28:03'),
(1220, 280, '', '', '1', '', '', '', 'Virtual/Online\nDiscussion', 0, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(1221, 280, '', '', '', '', '', '', '', 1, '2025-12-11 03:54:27', '2025-12-11 03:54:27'),
(1222, 282, '', '', '', '', '', '', '', 1, '2025-12-11 04:22:51', '2025-12-11 04:22:51'),
(1230, 283, '', '', '', '', '', '', '', 0, '2025-12-14 19:37:16', '2025-12-14 19:37:16'),
(1231, 283, '', '', '', '', '', '', '', 1, '2025-12-14 19:37:16', '2025-12-14 19:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `tla_ilo`
--

CREATE TABLE `tla_ilo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tla_id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_ilo_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tla_so`
--

CREATE TABLE `tla_so` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tla_id` bigint(20) UNSIGNED NOT NULL,
  `syllabus_so_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `status` enum('pending','active','rejected') NOT NULL DEFAULT 'pending',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `employee_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `role`, `status`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `designation`, `employee_code`) VALUES
(221, 'PEREYRA MATTHEW ALEN', '22-72684@g.batstate-u.edu.ph', '111721505571170932945', 'faculty', 'active', NULL, NULL, NULL, '2025-12-03 08:04:55', '2025-12-04 03:00:35', 'Professor 1', '22-72684'),
(224, 'MONTEALEGRE PAUL JELAN', '22-70787@g.batstate-u.edu.ph', '108434727613386660229', 'faculty', 'active', NULL, NULL, NULL, '2025-12-03 08:06:28', '2025-12-04 03:00:34', 'Professor 1', '22-70787'),
(226, 'ASIBAR PAUL JUSTINE REY', '22-73610@g.batstate-u.edu.ph', '115681611370892614613', 'faculty', 'active', NULL, NULL, NULL, '2025-12-03 08:12:22', '2025-12-07 03:54:38', 'sad', '22-73610'),
(227, 'MATUNDAN JAYLORD', '22-77774@g.batstate-u.edu.ph', '102131477618847675288', 'faculty', 'active', NULL, NULL, NULL, '2025-12-03 08:12:47', '2025-12-04 03:00:34', 'dsfdsfdsf', '22-77774'),
(229, 'Adriane Allen P. Pablico', '22-77551@g.batstate-u.edu.ph', '105027007800844806186', 'faculty', 'active', NULL, NULL, NULL, '2025-12-06 04:41:13', '2025-12-07 05:55:03', 'Professor 1', '22-77551'),
(230, 'PEREZ JOANNA MAE', '22-73989@g.batstate-u.edu.ph', '106357008339439343316', 'faculty', 'active', NULL, NULL, NULL, '2025-12-06 10:08:46', '2025-12-07 03:54:02', 'Student', '22-73989'),
(231, 'BENITEZ SHANE ANN', '22-79953@g.batstate-u.edu.ph', '118033289501926117506', 'faculty', 'active', NULL, NULL, NULL, '2025-12-06 10:16:07', '2025-12-06 10:24:56', 'Assistant Professor', '22-79953'),
(232, 'PANGANIBAN ALVIN', '22-74738@g.batstate-u.edu.ph', '113731591072814589149', 'faculty', 'pending', NULL, NULL, NULL, '2025-12-06 11:12:44', '2025-12-06 11:12:44', NULL, '22-74738'),
(233, 'MARKSPINUS JONSON', '21-76694@g.batstate-u.edu.ph', '100533293436568550425', 'faculty', 'pending', NULL, NULL, NULL, '2025-12-08 09:38:34', '2025-12-08 09:38:34', NULL, '21-76694'),
(234, 'CERTEZA CINDY', '22-76323@g.batstate-u.edu.ph', '113014386221136833018', 'faculty', 'active', NULL, NULL, NULL, '2025-12-08 09:39:30', '2025-12-11 01:53:22', 'Associate  Professor', '22-76323'),
(235, 'Jason Magsino', 'jason.magsino@g.batstate-u.edu.ph', '101881198428509996722', 'faculty', 'active', NULL, NULL, NULL, '2025-12-08 13:32:42', '2025-12-08 13:34:47', 'Lecturer I', 'jason.magsino'),
(236, 'DECILOS GLENMOR', '22-70727@g.batstate-u.edu.ph', '114336539391155661692', 'faculty', 'active', NULL, NULL, NULL, '2025-12-09 03:08:55', '2025-12-10 05:41:22', 'Assoc. Prof.', '22-70727'),
(237, 'SEVILLA LAINE MERVINEL', '22-72923@g.batstate-u.edu.ph', '110915889791735206778', 'faculty', 'pending', NULL, NULL, NULL, '2025-12-09 03:09:22', '2025-12-09 03:09:22', NULL, '22-72923'),
(238, 'GARILVA CHRISTIAN', '22-77831@g.batstate-u.edu.ph', '102260624519766276732', 'faculty', 'pending', NULL, NULL, NULL, '2025-12-10 07:51:12', '2025-12-10 07:51:12', NULL, '22-77831'),
(239, 'AMASAN CARL MARK', '22-70214@g.batstate-u.edu.ph', '109678669191243383482', 'faculty', 'active', NULL, NULL, NULL, '2025-12-11 02:20:40', '2025-12-11 02:22:21', 'Assoc. Prof', '22-70214'),
(240, 'Alvin Andulan', 'alvin.andulan@g.batstate-u.edu.ph', '110473640174060508765', 'faculty', 'active', NULL, NULL, NULL, '2025-12-11 03:21:42', '2025-12-11 03:24:44', 'BSA and BSMA Department Chair', '150625');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_assigned_by_foreign` (`assigned_by`),
  ADD KEY `appointments_user_id_role_status_index` (`user_id`,`role`,`status`),
  ADD KEY `appointments_scope_type_scope_id_role_status_index` (`scope_type`,`scope_id`,`role`,`status`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cdios`
--
ALTER TABLE `cdios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chair_requests`
--
ALTER TABLE `chair_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chair_requests_department_id_foreign` (`department_id`),
  ADD KEY `chair_requests_program_id_foreign` (`program_id`),
  ADD KEY `chair_requests_decided_by_foreign` (`decided_by`),
  ADD KEY `chair_requests_user_id_status_index` (`user_id`,`status`),
  ADD KEY `chair_requests_requested_role_department_id_program_id_index` (`requested_role`,`department_id`,`program_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `courses_code_unique` (`code`),
  ADD KEY `courses_department_id_foreign` (`department_id`);

--
-- Indexes for table `course_prerequisite`
--
ALTER TABLE `course_prerequisite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_prerequisite_course_id_foreign` (`course_id`),
  ADD KEY `course_prerequisite_prerequisite_id_foreign` (`prerequisite_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_code_unique` (`code`);

--
-- Indexes for table `faculty_syllabus`
--
ALTER TABLE `faculty_syllabus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `faculty_syllabus_faculty_id_syllabus_id_unique` (`faculty_id`,`syllabus_id`),
  ADD KEY `faculty_syllabus_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `general_information`
--
ALTER TABLE `general_information`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_section_per_department` (`section`,`department_id`),
  ADD KEY `general_information_department_id_foreign` (`department_id`);

--
-- Indexes for table `igas`
--
ALTER TABLE `igas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `intended_learning_outcomes`
--
ALTER TABLE `intended_learning_outcomes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ilo_course_id_code_unique` (`course_id`,`code`),
  ADD KEY `intended_learning_outcomes_course_id_foreign` (`course_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `programs_code_unique` (`code`),
  ADD KEY `programs_department_id_foreign` (`department_id`),
  ADD KEY `programs_created_by_foreign` (`created_by`);

--
-- Indexes for table `sdgs`
--
ALTER TABLE `sdgs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `so`
--
ALTER TABLE `so`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_outcomes`
--
ALTER TABLE `student_outcomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_outcomes_department_id_foreign` (`department_id`);

--
-- Indexes for table `superadmins`
--
ALTER TABLE `superadmins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `superadmins_username_unique` (`username`);

--
-- Indexes for table `super_admins`
--
ALTER TABLE `super_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `super_admins_username_unique` (`username`);

--
-- Indexes for table `syllabi`
--
ALTER TABLE `syllabi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabi_course_id_foreign` (`course_id`),
  ADD KEY `syllabi_reviewed_by_foreign` (`reviewed_by`),
  ADD KEY `syllabi_faculty_id_foreign` (`faculty_id`);

--
-- Indexes for table `syllabus_assessment_mappings`
--
ALTER TABLE `syllabus_assessment_mappings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_assessment_mappings_syllabus_id_position_index` (`syllabus_id`,`position`);

--
-- Indexes for table `syllabus_assessment_tasks`
--
ALTER TABLE `syllabus_assessment_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_assessment_tasks_syllabus_id_position_index` (`syllabus_id`,`position`),
  ADD KEY `sat_section_row_pos_idx` (`syllabus_id`,`section_number`,`row_type`,`position`);

--
-- Indexes for table `syllabus_cdios`
--
ALTER TABLE `syllabus_cdios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_cdios_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `syllabus_comments`
--
ALTER TABLE `syllabus_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_comments_syllabus_id_partial_key_batch_index` (`syllabus_id`,`partial_key`,`batch`),
  ADD KEY `syllabus_comments_created_by_index` (`created_by`),
  ADD KEY `syllabus_comments_updated_by_index` (`updated_by`);

--
-- Indexes for table `syllabus_course_infos`
--
ALTER TABLE `syllabus_course_infos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_course_infos_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `syllabus_course_policies`
--
ALTER TABLE `syllabus_course_policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_course_policies_syllabus_id_foreign` (`syllabus_id`),
  ADD KEY `syllabus_course_policies_section_index` (`section`);

--
-- Indexes for table `syllabus_criteria`
--
ALTER TABLE `syllabus_criteria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `syllabus_criteria_syllabus_id_key_unique` (`syllabus_id`,`key`);

--
-- Indexes for table `syllabus_igas`
--
ALTER TABLE `syllabus_igas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_igas_syllabus_id_foreign` (`syllabus_id`),
  ADD KEY `syllabus_igas_position_index` (`position`);

--
-- Indexes for table `syllabus_ilos`
--
ALTER TABLE `syllabus_ilos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_ilos_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `syllabus_ilo_cdio_sdg`
--
ALTER TABLE `syllabus_ilo_cdio_sdg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_ilo_cdio_sdg_syllabus_id_index` (`syllabus_id`);

--
-- Indexes for table `syllabus_ilo_iga`
--
ALTER TABLE `syllabus_ilo_iga`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_ilo_iga_syllabus_id_index` (`syllabus_id`);

--
-- Indexes for table `syllabus_ilo_so_cpa`
--
ALTER TABLE `syllabus_ilo_so_cpa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_ilo_so_cpa_syllabus_id_index` (`syllabus_id`);

--
-- Indexes for table `syllabus_mission_visions`
--
ALTER TABLE `syllabus_mission_visions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `syllabus_mission_visions_syllabus_id_unique` (`syllabus_id`);

--
-- Indexes for table `syllabus_sdgs`
--
ALTER TABLE `syllabus_sdgs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `syllabus_sdgs_syllabus_id_code_unique` (`syllabus_id`,`code`),
  ADD KEY `syllabus_sdgs_sort_order_index` (`sort_order`);

--
-- Indexes for table `syllabus_sections`
--
ALTER TABLE `syllabus_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_sections_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `syllabus_sos`
--
ALTER TABLE `syllabus_sos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_sos_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `syllabus_submissions`
--
ALTER TABLE `syllabus_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_submissions_submitted_by_foreign` (`submitted_by`),
  ADD KEY `syllabus_submissions_action_by_foreign` (`action_by`),
  ADD KEY `syllabus_submissions_syllabus_id_action_at_index` (`syllabus_id`,`action_at`);

--
-- Indexes for table `syllabus_textbooks`
--
ALTER TABLE `syllabus_textbooks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `syllabus_textbooks_syllabus_id_foreign` (`syllabus_id`);

--
-- Indexes for table `textbook_chunks`
--
ALTER TABLE `textbook_chunks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tla`
--
ALTER TABLE `tla`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tla_syllabus_id_index` (`syllabus_id`),
  ADD KEY `tla_position_index` (`position`);

--
-- Indexes for table `tla_ilo`
--
ALTER TABLE `tla_ilo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tla_ilo_tla_id_foreign` (`tla_id`),
  ADD KEY `tla_ilo_syllabus_ilo_id_foreign` (`syllabus_ilo_id`);

--
-- Indexes for table `tla_so`
--
ALTER TABLE `tla_so`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tla_so_tla_id_foreign` (`tla_id`),
  ADD KEY `tla_so_syllabus_so_id_foreign` (`syllabus_so_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=944;

--
-- AUTO_INCREMENT for table `cdios`
--
ALTER TABLE `cdios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `chair_requests`
--
ALTER TABLE `chair_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=245;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `course_prerequisite`
--
ALTER TABLE `course_prerequisite`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `faculty_syllabus`
--
ALTER TABLE `faculty_syllabus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_information`
--
ALTER TABLE `general_information`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `igas`
--
ALTER TABLE `igas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `intended_learning_outcomes`
--
ALTER TABLE `intended_learning_outcomes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `sdgs`
--
ALTER TABLE `sdgs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `so`
--
ALTER TABLE `so`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_outcomes`
--
ALTER TABLE `student_outcomes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `superadmins`
--
ALTER TABLE `superadmins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `syllabi`
--
ALTER TABLE `syllabi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT for table `syllabus_assessment_mappings`
--
ALTER TABLE `syllabus_assessment_mappings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2154;

--
-- AUTO_INCREMENT for table `syllabus_assessment_tasks`
--
ALTER TABLE `syllabus_assessment_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2536;

--
-- AUTO_INCREMENT for table `syllabus_cdios`
--
ALTER TABLE `syllabus_cdios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2476;

--
-- AUTO_INCREMENT for table `syllabus_comments`
--
ALTER TABLE `syllabus_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `syllabus_course_infos`
--
ALTER TABLE `syllabus_course_infos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT for table `syllabus_course_policies`
--
ALTER TABLE `syllabus_course_policies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=767;

--
-- AUTO_INCREMENT for table `syllabus_criteria`
--
ALTER TABLE `syllabus_criteria`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3859;

--
-- AUTO_INCREMENT for table `syllabus_igas`
--
ALTER TABLE `syllabus_igas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=756;

--
-- AUTO_INCREMENT for table `syllabus_ilos`
--
ALTER TABLE `syllabus_ilos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=826;

--
-- AUTO_INCREMENT for table `syllabus_ilo_cdio_sdg`
--
ALTER TABLE `syllabus_ilo_cdio_sdg`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `syllabus_ilo_iga`
--
ALTER TABLE `syllabus_ilo_iga`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `syllabus_ilo_so_cpa`
--
ALTER TABLE `syllabus_ilo_so_cpa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `syllabus_mission_visions`
--
ALTER TABLE `syllabus_mission_visions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `syllabus_sdgs`
--
ALTER TABLE `syllabus_sdgs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=716;

--
-- AUTO_INCREMENT for table `syllabus_sections`
--
ALTER TABLE `syllabus_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syllabus_sos`
--
ALTER TABLE `syllabus_sos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3220;

--
-- AUTO_INCREMENT for table `syllabus_submissions`
--
ALTER TABLE `syllabus_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `syllabus_textbooks`
--
ALTER TABLE `syllabus_textbooks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `textbook_chunks`
--
ALTER TABLE `textbook_chunks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5377;

--
-- AUTO_INCREMENT for table `tla`
--
ALTER TABLE `tla`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1232;

--
-- AUTO_INCREMENT for table `tla_ilo`
--
ALTER TABLE `tla_ilo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tla_so`
--
ALTER TABLE `tla_so`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chair_requests`
--
ALTER TABLE `chair_requests`
  ADD CONSTRAINT `chair_requests_decided_by_foreign` FOREIGN KEY (`decided_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chair_requests_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chair_requests_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chair_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_prerequisite`
--
ALTER TABLE `course_prerequisite`
  ADD CONSTRAINT `course_prerequisite_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_prerequisite_prerequisite_id_foreign` FOREIGN KEY (`prerequisite_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `faculty_syllabus`
--
ALTER TABLE `faculty_syllabus`
  ADD CONSTRAINT `faculty_syllabus_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `faculty_syllabus_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `general_information`
--
ALTER TABLE `general_information`
  ADD CONSTRAINT `general_information_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `intended_learning_outcomes`
--
ALTER TABLE `intended_learning_outcomes`
  ADD CONSTRAINT `intended_learning_outcomes_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `programs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `programs_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_outcomes`
--
ALTER TABLE `student_outcomes`
  ADD CONSTRAINT `student_outcomes_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabi`
--
ALTER TABLE `syllabi`
  ADD CONSTRAINT `syllabi_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `syllabi_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `syllabi_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `syllabus_assessment_mappings`
--
ALTER TABLE `syllabus_assessment_mappings`
  ADD CONSTRAINT `syllabus_assessment_mappings_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_assessment_tasks`
--
ALTER TABLE `syllabus_assessment_tasks`
  ADD CONSTRAINT `syllabus_assessment_tasks_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_cdios`
--
ALTER TABLE `syllabus_cdios`
  ADD CONSTRAINT `syllabus_cdios_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_course_infos`
--
ALTER TABLE `syllabus_course_infos`
  ADD CONSTRAINT `syllabus_course_infos_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_course_policies`
--
ALTER TABLE `syllabus_course_policies`
  ADD CONSTRAINT `syllabus_course_policies_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_criteria`
--
ALTER TABLE `syllabus_criteria`
  ADD CONSTRAINT `syllabus_criteria_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_igas`
--
ALTER TABLE `syllabus_igas`
  ADD CONSTRAINT `syllabus_igas_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_ilos`
--
ALTER TABLE `syllabus_ilos`
  ADD CONSTRAINT `syllabus_ilos_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_ilo_cdio_sdg`
--
ALTER TABLE `syllabus_ilo_cdio_sdg`
  ADD CONSTRAINT `syllabus_ilo_cdio_sdg_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_ilo_iga`
--
ALTER TABLE `syllabus_ilo_iga`
  ADD CONSTRAINT `syllabus_ilo_iga_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_ilo_so_cpa`
--
ALTER TABLE `syllabus_ilo_so_cpa`
  ADD CONSTRAINT `syllabus_ilo_so_cpa_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_mission_visions`
--
ALTER TABLE `syllabus_mission_visions`
  ADD CONSTRAINT `syllabus_mission_visions_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_sdgs`
--
ALTER TABLE `syllabus_sdgs`
  ADD CONSTRAINT `syllabus_sdgs_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_sections`
--
ALTER TABLE `syllabus_sections`
  ADD CONSTRAINT `syllabus_sections_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_sos`
--
ALTER TABLE `syllabus_sos`
  ADD CONSTRAINT `syllabus_sos_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_submissions`
--
ALTER TABLE `syllabus_submissions`
  ADD CONSTRAINT `syllabus_submissions_action_by_foreign` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `syllabus_submissions_submitted_by_foreign` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `syllabus_submissions_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `syllabus_textbooks`
--
ALTER TABLE `syllabus_textbooks`
  ADD CONSTRAINT `syllabus_textbooks_syllabus_id_foreign` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tla_ilo`
--
ALTER TABLE `tla_ilo`
  ADD CONSTRAINT `tla_ilo_syllabus_ilo_id_foreign` FOREIGN KEY (`syllabus_ilo_id`) REFERENCES `syllabus_ilos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tla_ilo_tla_id_foreign` FOREIGN KEY (`tla_id`) REFERENCES `tla` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tla_so`
--
ALTER TABLE `tla_so`
  ADD CONSTRAINT `tla_so_syllabus_so_id_foreign` FOREIGN KEY (`syllabus_so_id`) REFERENCES `syllabus_sos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tla_so_tla_id_foreign` FOREIGN KEY (`tla_id`) REFERENCES `tla` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
