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

const getAll = async (req, res, type) => {
    try {
        const projects = await Project.findAll({
            where: type === 1 ? { isexpertise: true } : type === 0 ? { isnormalisation: true } : {},
            include: [
                {
                    model: User,
                    attributes: ['user_Id', 'nickname']
                },
                {
                    model: Expertise,
                    include: [
                        {
                            model: User,
                            attributes: ['user_Id', 'nickname']
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
            author_user_Id: p.user_Id,
            author_nickname: p.User ? p.User.nickname : null,
            reviewers: p.Expertises ? p.Expertises.map(e => ({
                user_Id: e.User ? e.User.user_Id : null,
                nickname: e.User ? e.User.nickname : null,
                status: e.end_date ? 'completed' : 'pending'
            })) : [],
            isarchived: p.isarchived,
        }));

        return res.status(200).json(formattedProjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getAll };

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id, {
            include: [
                { model: User, attributes: ['user_Id', 'nickname'] },
                { model: DataModel },
                {
                    model: Stage,
                    include: [
                        { model: Attribute },
                        {
                            model: TableDb,
                            include: [
                                { model: TableAttribute },
                                { model: FunctionalDependency, include: [BeginingFd, EndingFd] },
                                { model: Dependency, as: 'Table1Dependencies' },
                                { model: Dependency, as: 'Table2Dependencies' }
                            ]
                        }
                    ]
                },
                {
                    model: Expertise,
                    include: [
                        { model: User, attributes: ['user_Id', 'nickname'] },
                        { model: Imbed }
                    ]
                },
                {
                    model: ProjectComment,
                    include: [{ model: User, attributes: ['user_Id', 'nickname'] }, { model: ProjectComment, as: 'Replies', include: [{ model: User, attributes: ['user_Id', 'nickname'] }] }],
                    order: [['comment_id', 'ASC']]
                }
            ]
        });

        if (!project) return res.status(404).json({ message: "Project not found" });

        const getUniqueDeps = (tables) => {
            const deps = new Map();
            tables.forEach(t => {
                [...t.Table1Dependencies, ...t.Table2Dependencies].forEach(d => {
                    deps.set(d.dependency_id, d);
                });
            });
            return Array.from(deps.values());
        };

        const response = {
            project_Id: project.project_id,
            name: project.name,
            description: project.description,
            creation_date: project.creation_date,
            status: project.status,
            is_for_expertise: project.isexpertise,
            is_for_normalization: project.isnormalisation,
            is_archived: project.isarchived,
            attributePool: project.Stages.flatMap(s => s.Attributes.map(a => ({
                id: `attr-${a.attribute_id}`, name: a.name, data_type: a.data_type,
                introduced_at_stage_Id: `stage-${s.form.toLowerCase()}`, retired_at_stage_Id: null
            }))),
            author: { user_Id: project.User.user_Id, nickname: project.User.nickname },
            models: project.DataModels.map(dm => ({ data_model_Id: dm.data_model_id, type: dm.type, file_url: dm.file, upload_date: dm.upload_date })),
            stages: project.Stages.map(s => ({
                stageId: `stage-${s.form.toLowerCase()}`,
                form: s.form,
                tables: s.TableDbs.map(t => ({
                    id: `tbl-${t.table_id}`, name: t.name, color: t.colour,
                    tableAttributes: t.TableAttributes.map(ta => ({ id: `ta-${ta.table_attribute_id}`, attributeId: `attr-${ta.attribute_id}`, is_PK: !!ta.ispk, is_FK: !!ta.isfk, alias: ta.pseudonim })),
                    fds: t.FunctionalDependencies.map(fd => ({
                        id: `fd-${fd.fd_id}`, color: fd.colour, level: parseInt(fd.level), type: fd.type, tableId: `tbl-${t.table_id}`,
                        starts: fd.BeginingFds.map(bfd => ({ id: `fds-${bfd.begining_fd_id}`, attributeId: `attr-${bfd.attribute_id}` })),
                        ends: fd.EndingFds.map(efd => ({ id: `fde-${efd.ending_fd_id}`, attributeId: `attr-${efd.attribute_id}` }))
                    }))
                })),
                relationships: getUniqueDeps(s.TableDbs).map(dep => ({
                    id: `rel-${dep.dependency_id}`, type: dep.type, color: dep.colour,
                    cardinality_t1: dep.cardinal1, cardinality_t2: dep.cardinal2,
                    table1Id: `tbl-${dep.table1_id}`, table2Id: `tbl-${dep.table2_id}`
                }))
            })),
            expertises: project.Expertises.map(e => ({
                expertise_Id: e.expertise_id, review_text: e.text, score: e.mark, begin_date: e.begin_date, end_date: e.end_date,
                expert: { user_Id: e.User.user_Id, nickname: e.User.nickname },
                attachments: e.Imbeds.map(i => ({ attachment_Id: i.imbed_id, link_url: i.link }))
            })),
            comments: project.ProjectComments.filter(c => c.previous_comment_id === null).map(c => ({
                comment_Id: c.comment_id, text: c.text, creation_date: c.date, score: c.mark, reply_to_Id: c.previous_comment_id,
                expertise_Id: c.expertise_id,
                author: c.User ? { user_Id: c.User.user_Id, nickname: c.User.nickname } : null,
                replies: c.Replies.map(r => ({ comment_Id: r.comment_id, text: r.text, creation_date: r.date, score: r.mark, expertise_Id: r.expertise_id, author: r.User ? { user_Id: r.User.user_Id, nickname: r.User.nickname } : null }))
            }))
        };
        return res.status(200).json(response);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const create = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { name, description, isexpertise, isnormalisation } = req.body;

        const newProject = await Project.create({
            name,
            description,
            user_id: req.user.id,
            creation_date: new Date(),
            status: 'pending',
            isexpertise: isexpertise || false,
            isnormalisation: isnormalisation || false,
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

const updateProjectFull = async (req, res) => {
    const { id } = req.params;
    const { stages, attributePool } = req.body;
    const t = await db.sequelize.transaction();

    try {
        const project = await Project.findByPk(id);
        if (!project || project.user_id !== req.user.id) return res.status(403).json({ message: "Access denied" });
        await Stage.destroy({ where: { project_id: id }, transaction: t });

        const newStageIds = [];
        for (const stageData of stages) {
            const stage = await Stage.create({ project_id: id, form: stageData.form }, { transaction: t });
            newStageIds.push(stage.stage_id);
        }

        const attributeIdMap = {};
        for (const attr of (attributePool || [])) {
            const realStageId = newStageIds[attr.introduced_at_stage_id - 1];
            const newAttribute = await Attribute.create({
                name: attr.name, data_type: attr.data_type,
                stage_id: realStageId, project_id: id
            }, { transaction: t });

            if (attr.attribute_id) {
                attributeIdMap[attr.attribute_id] = newAttribute.attribute_id;
            }
        }

        const newTableIds = [];
        for (let i = 0; i < stages.length; i++) {
            const stageData = stages[i];
            const currentStageId = newStageIds[i];

            for (const tableData of (stageData.tables || [])) {
                const table = await TableDb.create({
                    stage_id: currentStageId, name: tableData.name, colour: tableData.colour
                }, { transaction: t });

                newTableIds.push(table.table_id);

                for (const ta of (tableData.tableAttributes || [])) {
                    const realAttributeId = attributeIdMap[ta.attribute_id] || ta.attribute_id;

                    await TableAttribute.create({
                        table_id: table.table_id,
                        attribute_id: realAttributeId,
                        ispk: ta.ispk,
                        isfk: ta.isfk,
                        pseudonim: ta.pseudonim
                    }, { transaction: t });
                }
            }
        }

        for (const stageData of stages) {

            for (const depData of (stageData.relationships || [])) {
                const realTable1Id = newTableIds[depData.table1_id - 1];
                const realTable2Id = newTableIds[depData.table2_id - 1];

                await Dependency.create({
                    type: depData.type, colour: depData.colour,
                    cardinal1: depData.cardinal1, cardinal2: depData.cardinal2,
                    table1_id: realTable1Id,
                    table2_id: realTable2Id
                }, { transaction: t });
            }

            for (const fdData of (stageData.fds || [])) {
                const jsonTableId = fdData.table_id || fdData.tableId;
                const realTableId = newTableIds[jsonTableId - 1];

                const fd = await FunctionalDependency.create({
                    table_id: realTableId, level: fdData.level,
                    colour: fdData.colour, type: fdData.type
                }, { transaction: t });

                for (const start of (fdData.starts || [])) {
                    const realStartAttrId = attributeIdMap[start.attribute_id] || start.attribute_id;
                    await BeginingFd.create({ functional_dependency_id: fd.fd_id, attribute_id: realStartAttrId }, { transaction: t });
                }

                for (const end of (fdData.ends || [])) {
                    const realEndAttrId = attributeIdMap[end.attribute_id] || end.attribute_id;
                    await EndingFd.create({ functional_dependency_id: fd.fd_id, attribute_id: realEndAttrId }, { transaction: t });
                }
            }
        }

        await t.commit();
        return res.status(200).json({ message: "Success" });
    } catch (error) {
        await t.rollback();
        console.error("Crash details:", error);
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

        if (project.isarchived && req.user.role !== "admin") {
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
    archive,
    updateProjectFull
};