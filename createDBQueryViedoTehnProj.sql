-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ViedoTehnProj
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ViedoTehnProj
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ViedoTehnProj` DEFAULT CHARACTER SET utf8 ;
USE `ViedoTehnProj` ;

-- -----------------------------------------------------
-- Table `ViedoTehnProj`.`Sensori`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ViedoTehnProj`.`Sensori` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `datums` DATETIME NOT NULL,
  `temperatura` FLOAT NULL,
  `apgaismojums` FLOAT NULL,
  `attalums` FLOAT NULL,
  `durvis` TINYINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ViedoTehnProj`.`Atteli`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ViedoTehnProj`.`Atteli` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `attels` LONGBLOB NOT NULL,
  `analizetais_attels` LONGBLOB NULL,
  `analizes_dati` BLOB NULL,
  `datums` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ViedoTehnProj`.`Notikumi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ViedoTehnProj`.`Notikumi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `teksts` VARCHAR(255) NOT NULL,
  `tips` VARCHAR(45) NOT NULL,
  `datums` DATETIME NOT NULL,
  `Atteli_id` INT NULL,
  `Sensori_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Notikumi_Atteli_idx` (`Atteli_id` ASC) VISIBLE,
  INDEX `fk_Notikumi_Sensori1_idx` (`Sensori_id` ASC) VISIBLE,
  CONSTRAINT `fk_Notikumi_Atteli`
    FOREIGN KEY (`Atteli_id`)
    REFERENCES `ViedoTehnProj`.`Atteli` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Notikumi_Sensori1`
    FOREIGN KEY (`Sensori_id`)
    REFERENCES `ViedoTehnProj`.`Sensori` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
