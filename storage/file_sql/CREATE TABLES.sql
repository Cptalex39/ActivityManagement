USE `activity_management`;

CREATE TABLE `utente` (
	`username` VARCHAR(10) NOT NULL,
	`password` VARCHAR(128) NOT NULL,
	`salt_hex` VARCHAR(32) NOT NULL,
	`ruolo` SET("Amministratore") NOT NULL,
	`note` VARCHAR(200),

	PRIMARY KEY(`username`)
);

CREATE TABLE `cliente` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(30) NOT NULL,
	`cognome` VARCHAR(30) NOT NULL,
	`contatto` VARCHAR(22) DEFAULT "Contatto non inserito." NOT NULL, 
	`email` VARCHAR(254) DEFAULT "Email non inserita." NOT NULL, 
	`note` VARCHAR(200),

	UNIQUE(`nome`, `cognome`, `contatto`, `email`), 

	PRIMARY KEY(`id`)
);

CREATE TABLE `spesa` (
	`id` INTEGER AUTO_INCREMENT NOT NULL, 
	`nome` VARCHAR(50) NOT NULL, 
	`giorno` DATE NOT NULL, 
	`descrizione` VARCHAR(1000), 
	`totale` DOUBLE NOT NULL, 
	`note` VARCHAR(200), 
    
    UNIQUE(`nome`, `giorno`), 

	PRIMARY KEY(`id`)
);

CREATE TABLE `lavoro` (
	`id` INTEGER AUTO_INCREMENT NOT NULL,
	`cliente` VARCHAR(500), 
	`giorno` DATE NOT NULL,
	`totale` DOUBLE NOT NULL, 
	`note` VARCHAR(200), 

	PRIMARY KEY(`id`)
);

CREATE TABLE `servizio` (
	`id` INTEGER AUTO_INCREMENT NOT NULL, 
	`nome` VARCHAR(100) NOT NULL, 
	`prezzo` DOUBLE NOT NULL, 
    `in_uso` BOOLEAN, 
	`note` VARCHAR(200), 
    
	PRIMARY KEY(`id`) 
);

CREATE TABLE `collegamento` (
	id_lavoro INTEGER NOT NULL, 
	id_servizio INTEGER NOT NULL, 
	quantita INTEGER NOT NULL DEFAULT 0, 
	
	PRIMARY KEY(id_lavoro, id_servizio), 
	
	CONSTRAINT `fk_collegamento_lavoro`
		FOREIGN KEY (`id_lavoro`)
		REFERENCES `lavoro` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE, 
	
	CONSTRAINT `fk_collegamento_servizio`
		FOREIGN KEY (`id_servizio`)
		REFERENCES `servizio` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

INSERT INTO `utente` (
	`username`, `password`, `salt_hex`, `ruolo`, `note`
) VALUES ( 
	"username", 
    "f9d2cb937f27244891760c87c2e22ad623194df0b21768754279fa13c0e728e1414531f59ac38b88daad4865c07e5e19ef62af414aa79d65a8deb59e85195d7f", 
    "uRWQMUQ2n9akXfegQSjEXeyba3Fkyvje", 
    "Amministratore", 
    "Password attuale: Password10!!"
);

















