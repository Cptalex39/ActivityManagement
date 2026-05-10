use activity_management;

ALTER TABLE `cliente` 
	ADD COLUMN `username` VARCHAR(10) NOT NULL AFTER `cognome`, 
	ADD COLUMN `password` VARCHAR(128) NOT NULL AFTER `email`, 
    ADD COLUMN `salt_hex` VARCHAR(32) NOT NULL AFTER `password`, 
    ADD COLUMN `indirizzo` VARCHAR(100) AFTER `salt_hex`, 
    ADD COLUMN `is_active` BOOLEAN NOT NULL AFTER `salt_hex`,
    DROP COLUMN `note`; 
    
CREATE TABLE `carta` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`numero` VARCHAR(16) NOT NULL,
	`mese_scadenza` INTEGER NOT NULL, 
    `anno_scadenza` INTEGER NOT NULL,
	`cvv_cvs` VARCHAR(3) NOT NULL, 
	`nome_titolare` VARCHAR(60) NOT NULL, 
	`circuito` ENUM('Visa', 'Mastercard') NOT NULL, 
    `id_cliente` INTEGER NOT NULL,
	
	PRIMARY KEY(`id`),
    
	CONSTRAINT `fk_carta_cliente`
		FOREIGN KEY (`id_cliente`)
		REFERENCES `cliente` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

ALTER TABLE `servizio` 
	ADD COLUMN `tipo` ENUM("Servizio", "Prodotto") NOT NULL AFTER `id`, 
    ADD COLUMN `descrizione` VARCHAR(1000) NOT NULL AFTER `nome`;

CREATE TABLE `ordine` (
	`codice` VARCHAR(26) NOT NULL, 
	`data_creazione` DATETIME NOT NULL, 
    `items` TEXT NOT NULL, 
    `metodo_pagamento` ENUM("Struttura", "Spedizione", "Corriere") NOT NULL, 
    `data_prenotazione` DATE, 
    `ora_prenotazione` TIME, 
    `indirizzo` VARCHAR(100), 
    `numero_carta` VARCHAR(4), 
    `totale` DOUBLE NOT NULL, 
    `is_pagato` BOOLEAN NOT NULL DEFAULT 0, 
    `data_conferma_pagamento` DATE , 
    `id_cliente` INTEGER NOT NULL, 
	
	PRIMARY KEY(`codice`),
    
	CONSTRAINT `fk_ordine_cliente`
		FOREIGN KEY (`id_cliente`)
		REFERENCES `cliente` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

ALTER TABLE `utente` 
	DROP COLUMN `note`; 
    
DROP TABLE `collegamento`;

DROP TABLE `lavoro`;






