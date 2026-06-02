const {
    Project,
    Stage,
    Attribute,
    TableDb,
    TableAttribute,
    Dependency,
    FunctionalDependency,
    BeginingFd,
    EndingFd,
    ProjectComment,
    User,
    DataModel,
    Expertise,
    Imbed
} = require('../models/Relations.js');
const db = require('../config/db.config.js');

const getAll = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'nickname']
                },
                {
                    model: Expertise,
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'nickname']
                        }
                    ]
                }
            ]
        });

        const formattedProjects = projects.map(p => ({
            project_Id: p.project_id,
            name: p.name,
            description: p.description,
            creation_date: p.creation_date,
            status: p.status,
            is_for_expertise: p.isexpertise,
            is_for_normalization: p.isnormalisation,
            author_user_Id: p.user_id,
            author_nickname: p.User ? p.User.nickname : null,
            reviewers: p.Expertises.map(e => ({
                user_Id: e.User.user_id,
                nickname: e.User.nickname,
                status: p.status
            })),
            isarchived: p.isarchived,
        }));

        return res.status(200).json(formattedProjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id, {
            include: [
                { model: User, attributes: ['user_id', 'nickname'] },
                { model: DataModel },
                {
                    model: Stage,
                    include: [
                        { model: Attribute },
                        { model: TableDb, include: [TableAttribute] },
                        { model: Dependency },
                        { model: FunctionalDependency, include: [BeginingFd, EndingFd] }
                    ]
                },
                {
                    model: Expertise,
                    include: [
                        { model: User, attributes: ['user_id', 'nickname'] },
                        { model: Imbed }
                    ]
                },
                {
                    model: ProjectComment,
                    include: [{ model: User, attributes: ['user_id', 'nickname'] }, { model: ProjectComment, as: 'Replies' }],
                    order: [['comment_id', 'ASC']]
                }
            ]
        });

        if (!project) return res.status(404).json({ message: "Project not found" });

        const response = {
            project_Id: project.project_id,
            name: project.name,
            description: project.description,
            creation_date: project.creation_date,
            status: project.status,
            is_for_expertise: project.isexpertise,
            is_for_normalization: project.isnormalisation,

            attributePool: project.Stages.flatMap(stage =>
                stage.Attributes.map(attr => ({
                    id: `attr-${attr.attribute_id}`,
                    name: attr.name,
                    data_type: attr.data_type,
                    introduced_at_stage_Id: `stage-${stage.form.toLowerCase()}`,
                    retired_at_stage_Id: null
                }))
            ),

            author: {
                user_Id: project.User.user_id,
                nickname: project.User.nickname
            },
            models: project.DataModels.map(dm => ({
                data_model_Id: dm.data_model_id,
                type: dm.type,
                file_url: dm.file,
                upload_date: dm.upload_date
            })),

            // Expanded Stages with nested Tables, Dependencies, and FDs
            stages: project.Stages.map(s => ({
                stageId: `stage-${s.form.toLowerCase()}`,
                form: s.form,
                tables: s.TableDbs.map(t => ({
                    id: `tbl-${t.table_id}`,
                    name: t.name,
                    color: t.colour,
                    tableAttributes: t.TableAttributes.map(ta => ({
                        id: `ta-${ta.table_attribute_id}`,
                        attributeId: `attr-${ta.attribute_id}`,
                        is_PK: !!ta.ispk,
                        is_FK: !!ta.isfk,
                        alias: ta.pseudonim
                    }))
                })),
                relationships: s.Dependencies.map(dep => ({
                    id: `rel-${dep.dependency_id}`,
                    type: dep.type,
                    color: dep.colour,
                    cardinality_t1: dep.cardinal1,
                    cardinality_t2: dep.cardinal2,
                    table1Id: `tbl-${dep.table1_id}`,
                    table2Id: `tbl-${dep.table2_id}`
                })),
                fds: s.FunctionalDependencies.map(fd => ({
                    id: `fd-${fd.fd_id}`,
                    color: fd.colour,
                    level: parseInt(fd.level),
                    type: fd.type,
                    tableId: fd.table_id ? `tbl-${fd.table_id}` : null,
                    starts: fd.BeginingFds.map(bfd => ({ id: `fds-${bfd.begining_fd_id}`, attributeId: `attr-${bfd.attribute_id}` })),
                    ends: fd.EndingFds.map(efd => ({ id: `fde-${efd.ending_fd_id}`, attributeId: `attr-${efd.attribute_id}` }))
                }))
            })),

            expertises: project.Expertises.map(e => ({
                expertise_Id: e.expertise_id,
                review_text: e.text,
                score: e.mark,
                begin_date: e.begin_date,
                end_date: e.end_date,
                expert: {
                    user_Id: e.User.user_id,
                    nickname: e.User.nickname
                },
                attachments: e.Imbeds.map(i => ({
                    attachment_Id: i.imbed_id,
                    link_url: i.link
                }))
            })),
            comments: project.ProjectComments
                .filter(c => c.previous_comment_id === null)
                .map(c => ({
                    comment_Id: c.comment_id,
                    text: c.text,
                    creation_date: c.date,
                    score: c.mark,
                    reply_to_Id: c.previous_comment_id,
                    author: c.User ? { user_Id: c.User.user_id, nickname: c.User.nickname } : null,
                    replies: c.Replies.map(r => ({
                        comment_Id: r.comment_id,
                        text: r.text,
                        creation_date: r.date,
                        score: r.mark,
                        author: r.User ? { user_Id: r.User.user_id, nickname: r.User.nickname } : null
                    }))
                }))
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { name, description } = req.body;

        const newProject = await Project.create({
            name,
            description,
            user_id: req.user.id,
            creation_date: new Date(),
            status: 'pending',
            isexpertise: false,
            isnormalisation: false,
            isarchived: false
        }, { transaction: t });

        const stageNames = ['1NF', 'FDs', '2NF', '3NF'];
        const stageData = stageNames.map(name => ({
            project_id: newProject.project_id,
            form: name
        }));

        await Stage.bulkCreate(stageData, { transaction: t });

        const projectWithStages = await Project.findByPk(newProject.project_id, {
            include: [{ model: Stage }],
            transaction: t
        });

        await t.commit();

        return res.status(201).json(projectWithStages);
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findByPk(id);

        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.isarchived) {
            return res.status(403).json({ message: "Cannot delete an archived project." });
        }

        if (project.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied." });
        }

        await project.update({ name, description });

        return res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.isarchived) {
            return res.status(403).json({ message: "Cannot delete an archived project." });
        }

        if (project.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied." });
        }

        await project.destroy();

        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const archive = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByPk(id);

        if (!project) return res.status(404).json({ message: "Project not found" });
        const newArchiveStatus = !project.isarchived;

        await project.update({ isarchived: newArchiveStatus });

        return res.status(200).json({
            message: `Project ${newArchiveStatus ? 'archived' : 'unarchived'} successfully`,
            isarchived: newArchiveStatus
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    update,
    deleter,
    create,
    archive
};