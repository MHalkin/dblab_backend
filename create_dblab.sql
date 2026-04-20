CREATE TABLE user (
    user_Id INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    login VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    student_group VARCHAR(50) DEFAULT NULL 
);

CREATE TABLE teacher (
    teacher_Id INT PRIMARY KEY AUTO_INCREMENT,
    user_Id INT,
    full_name VARCHAR(255),
    place_of_Employment VARCHAR(255),
    position VARCHAR(255),
    text VARCHAR(500) DEFAULT NULL,
    level VARCHAR(100),
    teacher_role VARCHAR(255),
    photo MEDIUMBLOB DEFAULT NULL,
    FOREIGN KEY (user_Id) REFERENCES user(user_Id)
);

CREATE TABLE language (
    language_Id INT PRIMARY KEY AUTO_INCREMENT,
    language_name VARCHAR(255)
);

CREATE TABLE discipline (
    discipline_Id INT PRIMARY KEY AUTO_INCREMENT,
    discipline_name VARCHAR(255),
    discipline_Description VARCHAR(500) DEFAULT NULL, 
    discipline_type VARCHAR(255),
    volume INT,
    syllabus_link VARCHAR(255)
);

CREATE TABLE disciplineTeacher (
    disciplineTeacher_Id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_Id INT NOT NULL,
    discipline_Id INT NOT NULL,
    language_Id INT,
    beginning_Year INT,
    FOREIGN KEY (teacher_Id) REFERENCES teacher(teacher_Id),
    FOREIGN KEY (discipline_Id) REFERENCES discipline(discipline_Id),
    FOREIGN KEY (language_Id) REFERENCES language(language_Id)
);

CREATE TABLE lesson (
    lesson_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    lesson_date DATE,
    lesson_time TIME,
    link VARCHAR(255)
);

CREATE TABLE event (
    event_Id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_Id INT,
    lesson_Id INT,
    event_name VARCHAR(255),
    type VARCHAR(100),
    format VARCHAR(100),
    begin_date TIME, 
    status VARCHAR(50),
    FOREIGN KEY (teacher_Id) REFERENCES teacher(teacher_Id),
    FOREIGN KEY (lesson_Id) REFERENCES lesson(lesson_Id)
);

CREATE TABLE material (
    material_Id INT PRIMARY KEY AUTO_INCREMENT,
    event_Id INT,
    material_name VARCHAR(255),
    file VARCHAR(255) DEFAULT NULL,
    material_type VARCHAR(100),
    FOREIGN KEY (event_Id) REFERENCES event(event_Id)
);

CREATE TABLE development_direction (
    development_direction_Id INT PRIMARY KEY AUTO_INCREMENT,
    development_direction_name VARCHAR(255),
    development_direction_Description VARCHAR(500) DEFAULT NULL
);

CREATE TABLE level (
    level_Id INT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(255)
);

CREATE TABLE chapter (
    chapter_Id INT PRIMARY KEY AUTO_INCREMENT,
    level_Id INT,
    development_direction_Id INT,
    chapter_name VARCHAR(255),
    FOREIGN KEY (level_Id) REFERENCES level(level_Id),
    FOREIGN KEY (development_direction_Id) REFERENCES development_direction(development_direction_Id)
);

CREATE TABLE skill (
    skill_Id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(255)
);

CREATE TABLE skillChapter (
    skillChapter_Id INT PRIMARY KEY AUTO_INCREMENT,
    skill_Id INT NOT NULL,
    chapter_Id INT NOT NULL,
    FOREIGN KEY (skill_Id) REFERENCES skill(skill_Id),
    FOREIGN KEY (chapter_Id) REFERENCES chapter(chapter_Id)
);

CREATE TABLE disciplineSkill (
    disciplineSkill_Id INT PRIMARY KEY AUTO_INCREMENT,
    discipline_Id INT NOT NULL,
    skill_Id INT NOT NULL,
    level_Id INT,
    learning_type VARCHAR(255),
    FOREIGN KEY (discipline_Id) REFERENCES discipline(discipline_Id),
    FOREIGN KEY (skill_Id) REFERENCES skill(skill_Id),
    FOREIGN KEY (level_Id) REFERENCES level(level_Id)
);

CREATE TABLE direction (
    direction_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(500)
);

CREATE TABLE proposal_type (
    proposal_type_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE proposal (
    proposal_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description VARCHAR(2000), 
    status ENUM(
        'Запропоновано', 
        'Підтвердено', 
        'Відкладено', 
        'Завершено',
        'Є записи'
    ) DEFAULT 'Запропоновано',
    complexity ENUM(
        'Низька',
        'Середня',
        'Висока'
    ),
    teacher_Id INT,
    proposal_type_Id INT,
    direction_Id INT,
    FOREIGN KEY (teacher_Id) REFERENCES teacher(teacher_Id),
    FOREIGN KEY (proposal_type_Id) REFERENCES proposal_type(proposal_type_Id),
    FOREIGN KEY (direction_Id) REFERENCES direction(direction_Id)
);

CREATE TABLE work (
    work_Id INT PRIMARY KEY AUTO_INCREMENT,
    begining_date DATE,
    changes_date DATE DEFAULT (CURRENT_DATE),
    review VARCHAR(500),
    comment VARCHAR(500),
    name VARCHAR(255),
    status ENUM('В обробці', 'Активна', 'Завершена', 'Відхилена') NOT NULL DEFAULT 'В обробці',
    file VARCHAR(255),
    proposal_Id INT,
    user_Id INT,
    FOREIGN KEY (proposal_Id) REFERENCES proposal(proposal_Id),
    FOREIGN KEY (user_Id) REFERENCES user(user_Id)
);

CREATE TABLE result_type (
    result_type_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE magazine (
    magazine_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    publisher VARCHAR(255),
    city VARCHAR(255),
    release_frequency VARCHAR(100),
    link VARCHAR(255)
);

CREATE TABLE conference (
    conference_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    approximate_date DATE,
    host VARCHAR(255),
    city VARCHAR(255),
    link VARCHAR(255),
    online BOOLEAN,
    offline BOOLEAN
);

CREATE TABLE competition (
    competition_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    approximate_date DATE,
    host VARCHAR(255),
    link VARCHAR(255),
    conference_Id INT,
    FOREIGN KEY (conference_Id) REFERENCES conference(conference_Id)
);

CREATE TABLE result (
    result_Id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    year INT,
    pages INT,
    full_name VARCHAR(255),
    status ENUM('В обробці', 'Підтверджено', 'Відхилено') NOT NULL DEFAULT 'В обробці',
    moderation_comment VARCHAR(500) DEFAULT NULL,
    work_Id INT,
    result_type_Id INT,
    magazine_Id INT,
    conference_Id INT,
    competition_Id INT,
    FOREIGN KEY (work_Id) REFERENCES work(work_Id),
    FOREIGN KEY (result_type_Id) REFERENCES result_type(result_type_Id),
    FOREIGN KEY (magazine_Id) REFERENCES magazine(magazine_Id),
    FOREIGN KEY (conference_Id) REFERENCES conference(conference_Id),
    FOREIGN KEY (competition_Id) REFERENCES competition(competition_Id)
);

CREATE TABLE link_type (
    link_type_Id INT PRIMARY KEY AUTO_INCREMENT,
    link_type_name VARCHAR(255) NOT NULL CHECK(CHAR_LENGTH(TRIM(link_type_name)) > 0),
    UNIQUE(link_type_name)
);

CREATE TABLE resource (
    resource_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    link_to_resource VARCHAR(2083) NOT NULL,
    likes_cache INT NOT NULL DEFAULT 0,
    views_cache INT NOT NULL DEFAULT 0,
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origination_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    producer VARCHAR(255),
    author_user_Id INT,
    link_type_Id INT,

    FOREIGN KEY (author_user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (link_type_Id) REFERENCES link_type(link_type_Id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE stack (
    stack_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    likes_cache INT NOT NULL DEFAULT 0,
    views_cache INT NOT NULL DEFAULT 0,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    author_user_Id INT,

    FOREIGN KEY (author_user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE interaction_user_resource (
    interaction_user_resource_Id INT PRIMARY KEY AUTO_INCREMENT,
    is_liked BIT(1) NOT NULL DEFAULT b'0',
    is_viewed BIT(1) NOT NULL DEFAULT b'0',
    is_in_view_later BIT(1) NOT NULL DEFAULT b'0',
    is_in_favourites BIT(1) NOT NULL DEFAULT b'0',
    user_Id INT,
    resource_Id INT NOT NULL,

    UNIQUE(user_Id, resource_Id),
    FOREIGN KEY (user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE interaction_user_stack (
    interaction_user_stack_Id INT PRIMARY KEY AUTO_INCREMENT,
    is_liked BIT(1) NOT NULL DEFAULT b'0',
    is_viewed BIT(1) NOT NULL DEFAULT b'0',
    is_in_view_later BIT(1) NOT NULL DEFAULT b'0',
    is_in_favourites BIT(1) NOT NULL DEFAULT b'0',
    user_Id INT,
    stack_Id INT NOT NULL,

    UNIQUE(user_Id, stack_Id),
    FOREIGN KEY (user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (stack_Id) REFERENCES stack(stack_Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment (
    comment_Id INT PRIMARY KEY AUTO_INCREMENT,
    `text` VARCHAR(800) NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    interaction_user_resource_Id INT,
    interaction_user_stack_Id INT,

    FOREIGN KEY (interaction_user_resource_Id) REFERENCES interaction_user_resource(interaction_user_resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (interaction_user_stack_Id) REFERENCES interaction_user_stack(interaction_user_stack_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE resourceStack (
    resource_Id INT NOT NULL,
    stack_Id INT NOT NULL,

    PRIMARY KEY (resource_Id, stack_Id),
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (stack_Id) REFERENCES stack(stack_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE resourceDevelopment_direction (
    resource_Id INT NOT NULL,
    development_direction_Id INT NOT NULL,

    PRIMARY KEY (resource_Id, development_direction_Id),
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (development_direction_Id) REFERENCES development_direction(development_direction_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE rating (
    rating_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    rating_authority_link VARCHAR(2083) NOT NULL,
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    forming_date DATE NOT NULL
);

CREATE TABLE ratingResource (
    rating_position INT NOT NULL CHECK(rating_position > 0),
    rating_Id INT NOT NULL,
    resource_Id INT NOT NULL,

    UNIQUE(rating_Id, rating_position),
    PRIMARY KEY (rating_Id, resource_Id),
    FOREIGN KEY (rating_Id) REFERENCES rating(rating_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);
