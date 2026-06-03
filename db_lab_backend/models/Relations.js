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

const LinkType = require('./LinkType.js');
const Resource = require('./Resource.js');
const Stack = require('./Stack.js');
const InteractionUserResource = require('./InteractionUserResource.js');
const InteractionUserStack = require('./InteractionUserStack.js');
const Comment = require('./Comment.js');
const ResourceStack = require('./ResourceStack.js');
const ResourceDevelopmentDirection = require('./ResourceDevelopmentDirection.js');
const Rating = require('./Rating.js');
const RatingResource = require('./RatingResource.js');

const Direction = require('./Direction.js');
const ProposalType = require('./ProposalType.js');
const Proposal = require('./Proposal.js');
const Work = require('./Work.js');
const ResultType = require('./ResultType.js');
const Magazine = require('./Magazine.js');
const Conference = require('./Conference.js');
const Competition = require('./Competition.js');
const Result = require('./Result.js');

const Project = require('./Project.js');
const DataModel = require('./DataModel.js');
const Expertise = require('./Expertise.js');
const Imbed = require('./Imbed.js');
const ExpertRequest = require('./ExpertRequest.js');
const ProjectComment = require('./ProjectComment.js');

const Stage = require('./Stage.js');
const FunctionalDependency = require('./FunctionalDependency.js');
const FdStage = require('./FdStage.js');
const Attribute = require('./Attribute.js');
const BeginingFd = require('./BeginingFd.js');
const EndingFd = require('./EndingFd.js');
const TableDb = require('./TableDb.js');
const TableAttribute = require('./TableAttribute.js');
const Dependency = require('./Dependency.js')

// --- Existing Academic Relations ---
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

// --- Resources Relations ---
User.hasMany(Resource, { foreignKey: 'author_user_Id' });
Resource.belongsTo(User, { foreignKey: 'author_user_Id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

User.hasMany(Stack, { foreignKey: 'author_user_Id' });
Stack.belongsTo(User, { foreignKey: 'author_user_Id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

LinkType.hasMany(Resource, { foreignKey: 'link_type_Id' });
Resource.belongsTo(LinkType, { foreignKey: 'link_type_Id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

User.hasMany(InteractionUserResource, { foreignKey: 'user_Id' });
InteractionUserResource.belongsTo(User, { foreignKey: 'user_Id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

Resource.hasMany(InteractionUserResource, { foreignKey: 'resource_Id' });
InteractionUserResource.belongsTo(Resource, { foreignKey: 'resource_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(InteractionUserStack, { foreignKey: 'user_Id' });
InteractionUserStack.belongsTo(User, { foreignKey: 'user_Id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

Stack.hasMany(InteractionUserStack, { foreignKey: 'stack_Id' });
InteractionUserStack.belongsTo(Stack, { foreignKey: 'stack_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

InteractionUserResource.hasMany(Comment, { foreignKey: 'interaction_user_resource_Id' });
Comment.belongsTo(InteractionUserResource, { foreignKey: 'interaction_user_resource_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

InteractionUserStack.hasMany(Comment, { foreignKey: 'interaction_user_stack_Id' });
Comment.belongsTo(InteractionUserStack, { foreignKey: 'interaction_user_stack_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Resource.belongsToMany(Stack, { through: ResourceStack, foreignKey: 'resource_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Stack.belongsToMany(Resource, { through: ResourceStack, foreignKey: 'stack_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Resource.belongsToMany(DevelopmentDirection, { through: ResourceDevelopmentDirection, foreignKey: 'resource_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DevelopmentDirection.belongsToMany(Resource, { through: ResourceDevelopmentDirection, foreignKey: 'development_direction_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Rating.belongsToMany(Resource, { through: RatingResource, foreignKey: 'rating_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Resource.belongsToMany(Rating, { through: RatingResource, foreignKey: 'resource_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// --- Proposal/Work Relations ---
ProposalType.hasMany(Proposal, { foreignKey: 'proposal_type_Id' });
Proposal.belongsTo(ProposalType, { foreignKey: 'proposal_type_Id' });

Direction.hasMany(Proposal, { foreignKey: 'direction_Id' });
Proposal.belongsTo(Direction, { foreignKey: 'direction_Id' });

Teacher.hasMany(Proposal, { foreignKey: 'teacher_Id' });
Proposal.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

Proposal.hasMany(Work, { foreignKey: 'proposal_Id' });
Work.belongsTo(Proposal, { foreignKey: 'proposal_Id' });

User.hasMany(Work, { foreignKey: 'user_Id' });
Work.belongsTo(User, { foreignKey: 'user_Id' });

Work.hasMany(Result, { foreignKey: 'work_Id' });
Result.belongsTo(Work, { foreignKey: 'work_Id' });

ResultType.hasMany(Result, { foreignKey: 'result_type_Id' });
Result.belongsTo(ResultType, { foreignKey: 'result_type_Id' });

Magazine.hasMany(Result, { foreignKey: 'magazine_Id' });
Result.belongsTo(Magazine, { foreignKey: 'magazine_Id' });

Conference.hasMany(Result, { foreignKey: 'conference_Id' });
Result.belongsTo(Conference, { foreignKey: 'conference_Id' });

Conference.hasMany(Competition, { foreignKey: 'conference_Id' });
Competition.belongsTo(Conference, { foreignKey: 'conference_Id' });

Competition.hasMany(Result, { foreignKey: 'competition_Id' });
Result.belongsTo(Competition, { foreignKey: 'competition_Id' });

// --- Project & Normalization Relations (With Cascades) ---
User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(DataModel, { foreignKey: 'project_id', onDelete: 'CASCADE' });
DataModel.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Expertise, { foreignKey: 'user_id' });
Expertise.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Expertise, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Expertise.belongsTo(Project, { foreignKey: 'project_id' });

Expertise.hasMany(Imbed, { foreignKey: 'expertise_id', onDelete: 'CASCADE' });
Imbed.belongsTo(Expertise, { foreignKey: 'expertise_id' });

User.hasMany(ExpertRequest, { foreignKey: 'user_id' });
ExpertRequest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ProjectComment, { foreignKey: 'user_id' });
ProjectComment.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(ProjectComment, { foreignKey: 'project_id', onDelete: 'CASCADE' });
ProjectComment.belongsTo(Project, { foreignKey: 'project_id' });

Expertise.hasMany(ProjectComment, { foreignKey: 'expertise_id', onDelete: 'CASCADE' });
ProjectComment.belongsTo(Expertise, { foreignKey: 'expertise_id' });

ProjectComment.hasMany(ProjectComment, { as: 'Replies', foreignKey: 'previous_comment_id', onDelete: 'CASCADE' });
ProjectComment.belongsTo(ProjectComment, { as: 'PreviousComment', foreignKey: 'previous_comment_id' });

Project.hasMany(Stage, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Stage.belongsTo(Project, { foreignKey: 'project_id' });

Stage.hasMany(FdStage, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
FdStage.belongsTo(Stage, { foreignKey: 'stage_id' });

FunctionalDependency.hasMany(FdStage, { foreignKey: 'functional_dependency_id', onDelete: 'CASCADE' });
FdStage.belongsTo(FunctionalDependency, { foreignKey: 'functional_dependency_id' });

Stage.hasMany(Attribute, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Attribute.belongsTo(Stage, { foreignKey: 'stage_id' });

Attribute.hasMany(BeginingFd, { foreignKey: 'attribute_id', onDelete: 'CASCADE' });
BeginingFd.belongsTo(Attribute, { foreignKey: 'attribute_id' });

FunctionalDependency.hasMany(BeginingFd, { foreignKey: 'functional_dependency_id', onDelete: 'CASCADE' });
BeginingFd.belongsTo(FunctionalDependency, { foreignKey: 'functional_dependency_id' });

Attribute.hasMany(EndingFd, { foreignKey: 'attribute_id', onDelete: 'CASCADE' });
EndingFd.belongsTo(Attribute, { foreignKey: 'attribute_id' });

FunctionalDependency.hasMany(EndingFd, { foreignKey: 'functional_dependency_id', onDelete: 'CASCADE' });
EndingFd.belongsTo(FunctionalDependency, { foreignKey: 'functional_dependency_id' });

TableDb.hasMany(TableAttribute, { foreignKey: 'table_id', onDelete: 'CASCADE' });
TableAttribute.belongsTo(TableDb, { foreignKey: 'table_id' });

Attribute.hasMany(TableAttribute, { foreignKey: 'attribute_id', onDelete: 'CASCADE' });
TableAttribute.belongsTo(Attribute, { foreignKey: 'attribute_id' });

TableDb.hasMany(Dependency, { as: 'Table1Dependencies', foreignKey: 'table1_id', onDelete: 'CASCADE' });
Dependency.belongsTo(TableDb, { as: 'Table1', foreignKey: 'table1_id' });

TableDb.hasMany(Dependency, { as: 'Table2Dependencies', foreignKey: 'table2_id', onDelete: 'CASCADE' });
Dependency.belongsTo(TableDb, { as: 'Table2', foreignKey: 'table2_id' });

Stage.hasMany(TableDb, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
TableDb.belongsTo(Stage, { foreignKey: 'stage_id' });

TableDb.hasMany(FunctionalDependency, { foreignKey: 'table_id', onDelete: 'CASCADE' });
FunctionalDependency.belongsTo(TableDb, { foreignKey: 'table_id' });

module.exports = {
  User, Teacher, Language, Discipline, DisciplineTeacher, Lesson, Event, Material,
  DevelopmentDirection, Level, Chapter, Skill, SkillChapter, DisciplineSkill,
  LinkType, Resource, Stack, InteractionUserResource, InteractionUserStack,
  Comment, ResourceStack, ResourceDevelopmentDirection, Rating, RatingResource,
  Direction, ProposalType, Proposal, Work, ResultType, Magazine, Conference,
  Competition, Result,

  Project, DataModel, Expertise, Imbed, ExpertRequest, ProjectComment,
  Stage, FunctionalDependency, FdStage, Attribute, BeginingFd, EndingFd,
  TableDb, TableAttribute, Dependency
};