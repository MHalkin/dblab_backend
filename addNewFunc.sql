SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- BLOCK: EXPERTISE
-- =====================================================

CREATE TABLE project (
    project_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    creation_date DATETIME NULL,
    status VARCHAR(100) NULL,
    isexpertise BOOLEAN NOT NULL,
    isnormalisation BOOLEAN NOT NULL,
    isarchived BOOLEAN NOT NULL,
    PRIMARY KEY (project_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

CREATE TABLE data_model (
    data_model_id INT NOT NULL AUTO_INCREMENT,
    project_id INT NULL,
    file VARCHAR(255) NULL,
    type VARCHAR(100) NULL,
    upload_date DATETIME NULL,
    PRIMARY KEY (data_model_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE expertise (
    expertise_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    text VARCHAR(255) NULL,
    mark INT NULL,
    begin_date DATETIME NULL,
    end_date DATETIME NULL,
    PRIMARY KEY (expertise_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE imbed (
    imbed_id INT NOT NULL AUTO_INCREMENT,
    expertise_id INT NULL,
    link VARCHAR(255) NULL,
    PRIMARY KEY (imbed_id),
    FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE expert_request (
    request_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    status VARCHAR(100) NULL,
    message VARCHAR(255) NULL,
    creation_date DATETIME NULL,
    PRIMARY KEY (request_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

CREATE TABLE project_comment (
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_id INT NULL,
    previous_comment_id INT NULL,
    expertise_id INT NULL,
    text VARCHAR(255) NULL,
    date DATETIME NULL,
    mark INT NULL,
    PRIMARY KEY (comment_id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user(user_id),
    CONSTRAINT fk_comment_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_prev FOREIGN KEY (previous_comment_id) REFERENCES project_comment(comment_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_expertise FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- BLOCK: NORMALIZATION
-- =====================================================

CREATE TABLE stage (
    stage_id INT NOT NULL AUTO_INCREMENT,
    project_id INT NOT NULL,
    form VARCHAR(255) NULL,
    PRIMARY KEY (stage_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE functional_dependency (
    fd_id INT NOT NULL AUTO_INCREMENT,
    level VARCHAR(100) NULL,
    colour VARCHAR(50) NULL,
    PRIMARY KEY (fd_id)
) ENGINE=InnoDB;

CREATE TABLE fd_stage (
    fd_stage_id INT NOT NULL AUTO_INCREMENT,
    stage_id INT NOT NULL,
    functional_dependency_id INT NOT NULL,
    type VARCHAR(100) NULL,
    PRIMARY KEY (fd_stage_id),
    FOREIGN KEY (stage_id) REFERENCES stage(stage_id) ON DELETE CASCADE,
    FOREIGN KEY (functional_dependency_id) REFERENCES functional_dependency(fd_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attribute (
    attribute_id INT NOT NULL AUTO_INCREMENT,
    stage_id INT NOT NULL,
    name VARCHAR(255) NULL,
    data_type VARCHAR(100) NULL,
    PRIMARY KEY (attribute_id),
    FOREIGN KEY (stage_id) REFERENCES stage(stage_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE begining_fd (
    begining_fd_id INT NOT NULL AUTO_INCREMENT,
    attribute_id INT NOT NULL,
    functional_dependency_id INT NOT NULL,
    PRIMARY KEY (begining_fd_id),
    FOREIGN KEY (attribute_id) REFERENCES attribute(attribute_id) ON DELETE CASCADE,
    FOREIGN KEY (functional_dependency_id) REFERENCES functional_dependency(fd_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ending_fd (
    ending_fd_id INT NOT NULL AUTO_INCREMENT,
    attribute_id INT NOT NULL,
    functional_dependency_id INT NOT NULL,
    PRIMARY KEY (ending_fd_id),
    FOREIGN KEY (attribute_id) REFERENCES attribute(attribute_id) ON DELETE CASCADE,
    FOREIGN KEY (functional_dependency_id) REFERENCES functional_dependency(fd_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `table` (
    table_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    colour VARCHAR(50) NULL,
    PRIMARY KEY (table_id)
) ENGINE=InnoDB;

CREATE TABLE table_attribute (
    table_attribute_id INT NOT NULL AUTO_INCREMENT,
    table_id INT NOT NULL,
    attribute_id INT NOT NULL,
    ispk BOOLEAN NULL,
    isfk BOOLEAN NULL,
    pseudonim VARCHAR(255) NULL,
    PRIMARY KEY (table_attribute_id),
    FOREIGN KEY (table_id) REFERENCES `table`(table_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES attribute(attribute_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE dependency (
    dependency_id INT NOT NULL AUTO_INCREMENT,
    table1_id INT NOT NULL,
    table2_id INT NOT NULL,
    type VARCHAR(100) NULL,
    colour VARCHAR(50) NULL,
    cardinal1 VARCHAR(50) NULL,
    cardinal2 VARCHAR(50) NULL,
    PRIMARY KEY (dependency_id),
    FOREIGN KEY (table1_id) REFERENCES `table`(table_id) ON DELETE CASCADE,
    FOREIGN KEY (table2_id) REFERENCES `table`(table_id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;