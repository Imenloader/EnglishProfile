-- LinguaPlanet MySQL Schema
-- Run this in Hostinger phpMyAdmin or via MySQL CLI

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Leads table
CREATE TABLE IF NOT EXISTS `leads` (
  `id`               VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `name`             VARCHAR(255)  NOT NULL,
  `email`            VARCHAR(255)  NOT NULL,
  `phone`            VARCHAR(50)   DEFAULT NULL,
  `score`            INT           DEFAULT 0,
  `total_questions`  INT           DEFAULT 0,
  `level`            VARCHAR(20)   DEFAULT NULL,
  `writing_response` TEXT          DEFAULT NULL,
  `age_range`        VARCHAR(50)   DEFAULT NULL,
  `company`          VARCHAR(255)  DEFAULT NULL,
  `class_format`     VARCHAR(20)   DEFAULT 'online',
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lead answers table
CREATE TABLE IF NOT EXISTS `lead_answers` (
  `id`              BIGINT        NOT NULL AUTO_INCREMENT,
  `lead_id`         VARCHAR(36)   NOT NULL,
  `student_name`    VARCHAR(255)  DEFAULT NULL,
  `question_text`   TEXT          NOT NULL,
  `student_answer`  VARCHAR(500)  DEFAULT NULL,
  `correct_answer`  VARCHAR(500)  DEFAULT NULL,
  `is_correct`      TINYINT(1)    DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lead_id` (`lead_id`),
  CONSTRAINT `fk_lead_answers` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Questions table
CREATE TABLE IF NOT EXISTS `questions` (
  `id`             VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `question`       TEXT          NOT NULL,
  `options`        JSON          NOT NULL,
  `correct_answer` VARCHAR(500)  NOT NULL,
  `part`           INT           DEFAULT 1,
  `level`          VARCHAR(20)   DEFAULT 'A1',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`                    VARCHAR(10)   NOT NULL DEFAULT '1',
  `hero_headline_en`      VARCHAR(500)  DEFAULT 'Where Success Becomes a Habit',
  `hero_headline_ar`      VARCHAR(500)  DEFAULT 'حيث يصبح النجاح عادة',
  `hero_subheadline_en`   TEXT          DEFAULT NULL,
  `hero_subheadline_ar`   TEXT          DEFAULT NULL,
  `whatsapp_number`       VARCHAR(20)   DEFAULT '+201270068237',
  `contact_email`         VARCHAR(255)  DEFAULT 'hello@linguaplanet.org',
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inquiries table (contact form)
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id`         BIGINT        NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255)  NOT NULL,
  `email`      VARCHAR(255)  NOT NULL,
  `message`    TEXT          NOT NULL,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default settings row
INSERT IGNORE INTO `site_settings` (`id`) VALUES ('1');
