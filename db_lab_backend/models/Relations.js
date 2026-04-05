const { Sequelize, DataTypes } = require('sequelize');

const User = require('./User.js');
const Teacher = require('./Teacher.js');
const Language = require('./Language.js');
const Discipline = require('./Discipline.js');
const DisciplineTeacher = require('./DisciplineTeacher.js');
const Lesson = require('./Lesson.js');
const Event = require('./Event.js');
const Material = require('./Material.js');
const DevelopmentDirection = require('./DevelopmentDirection.js');
const Level = require('./Level.js');
const Chapter = require('./Chapter.js');
const Skill = require('./Skill.js');
const SkillChapter = require('./SkillChapter.js');
const DisciplineSkill = require('./DisciplineSkill.js');
const Direction = require('./Direction.js');
const ProposalType = require('./ProposalType.js');
const Proposal = require('./Proposal.js');
const Work = require('./Work.js');
const ResultType = require('./ResultType.js');
const Magazine = require('./Magazine.js');
const Conference = require('./Conference.js');
const Competition = require('./Competition.js');
const Result = require('./Result.js');

User.hasOne(Teacher, { foreignKey: 'user_Id' });
Teacher.belongsTo(User, { foreignKey: 'user_Id' });

Teacher.belongsToMany(Discipline, { through: DisciplineTeacher, foreignKey: 'teacher_Id' });
Discipline.belongsToMany(Teacher, { through: DisciplineTeacher, foreignKey: 'discipline_Id' });

Teacher.hasMany(DisciplineTeacher, { foreignKey: 'teacher_Id' });
DisciplineTeacher.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

Discipline.hasMany(DisciplineTeacher, { foreignKey: 'discipline_Id' });
DisciplineTeacher.belongsTo(Discipline, { foreignKey: 'discipline_Id' });

Language.hasMany(DisciplineTeacher, { foreignKey: 'language_Id' });
DisciplineTeacher.belongsTo(Language, { foreignKey: 'language_Id' });

Teacher.hasMany(Event, { foreignKey: 'teacher_Id' });
Event.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

Lesson.hasMany(Event, { foreignKey: 'lesson_Id' });
Event.belongsTo(Lesson, { foreignKey: 'lesson_Id' });

Event.hasMany(Material, { foreignKey: 'event_Id' });
Material.belongsTo(Event, { foreignKey: 'event_Id' });

DevelopmentDirection.hasMany(Chapter, { foreignKey: 'development_direction_Id' });
Chapter.belongsTo(DevelopmentDirection, { foreignKey: 'development_direction_Id' });

Level.hasMany(Chapter, { foreignKey: 'level_Id' });
Chapter.belongsTo(Level, { foreignKey: 'level_Id' });

Chapter.belongsToMany(Skill, { through: SkillChapter, foreignKey: 'chapter_Id' });
Skill.belongsToMany(Chapter, { through: SkillChapter, foreignKey: 'skill_Id' });

Chapter.hasMany(SkillChapter, { foreignKey: 'chapter_Id' });
SkillChapter.belongsTo(Chapter, { foreignKey: 'chapter_Id' });

Skill.hasMany(SkillChapter, { foreignKey: 'skill_Id' });
SkillChapter.belongsTo(Skill, { foreignKey: 'skill_Id' });

Discipline.hasMany(DisciplineSkill, { foreignKey: 'discipline_Id' });
DisciplineSkill.belongsTo(Discipline, { foreignKey: 'discipline_Id' });

Skill.hasMany(DisciplineSkill, { foreignKey: 'skill_Id' });
DisciplineSkill.belongsTo(Skill, { foreignKey: 'skill_Id' });

Discipline.belongsToMany(Skill, { through: DisciplineSkill, foreignKey: 'discipline_Id' });
Skill.belongsToMany(Discipline, { through: DisciplineSkill, foreignKey: 'skill_Id' });

Level.hasMany(DisciplineSkill, { foreignKey: 'level_Id' });
DisciplineSkill.belongsTo(Level, { foreignKey: 'level_Id' });

// ProposalType relations
ProposalType.hasMany(Proposal, { foreignKey: 'proposal_type_Id' });
Proposal.belongsTo(ProposalType, { foreignKey: 'proposal_type_Id' });

// Direction relations
Direction.hasMany(Proposal, { foreignKey: 'direction_Id' });
Proposal.belongsTo(Direction, { foreignKey: 'direction_Id' });

// Teacher relations
Teacher.hasMany(Proposal, { foreignKey: 'teacher_Id' });
Proposal.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

// Proposal relations
Proposal.hasMany(Work, { foreignKey: 'proposal_Id' });
Work.belongsTo(Proposal, { foreignKey: 'proposal_Id' });

// User relations
User.hasMany(Work, { foreignKey: 'user_Id' });
Work.belongsTo(User, { foreignKey: 'user_Id' });

// Work relations
Work.hasMany(Result, { foreignKey: 'work_Id' });
Result.belongsTo(Work, { foreignKey: 'work_Id' });

// ResultType relations
ResultType.hasMany(Result, { foreignKey: 'result_type_Id' });
Result.belongsTo(ResultType, { foreignKey: 'result_type_Id' });

// Magazine relations
Magazine.hasMany(Result, { foreignKey: 'magazine_Id' });
Result.belongsTo(Magazine, { foreignKey: 'magazine_Id' });

// Conference relations
Conference.hasMany(Result, { foreignKey: 'conference_Id' });
Result.belongsTo(Conference, { foreignKey: 'conference_Id' });

Conference.hasMany(Competition, { foreignKey: 'conference_Id' });
Competition.belongsTo(Conference, { foreignKey: 'conference_Id' });

// Competition relations
Competition.hasMany(Result, { foreignKey: 'competition_Id' });
Result.belongsTo(Competition, { foreignKey: 'competition_Id' });

module.exports = {
    User,
    Teacher,
    Language,
    Discipline,
    DisciplineTeacher,
    Lesson,
    Event,
    Material,
    DevelopmentDirection,
    Level,
    Chapter,
    Skill,
    SkillChapter,
    DisciplineSkill,
    Direction,
    ProposalType,
    Proposal,
    Work,
    ResultType,
    Magazine,
    Conference,
    Competition,
    Result
};