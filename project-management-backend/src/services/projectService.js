const Boom = require('@hapi/boom');

const Project = require('../models/project.js');
const { resolve } = require('path');

/**
 * Get all projects.
 *
 * @returns {Promise}
 */
function getAllProjects() {
  return Project.fetchAll({ withRelated: ['users', 'projectManager'] });
}

/**
 * Get related projects.
 *
 * @returns {Promise}
 */
function getRelatedProjects(currentUser) {
  return new Promise((resolve, reject) => {
    Project.fetchAll({ withRelated: ['users', 'projectManager'] })
      .then((data) => {
        data.models = data.models.filter((project) => {
          let filter = false;
          project.relations.users.models.map((user) => {
            if (user.attributes.id === currentUser.id) {
              filter = true;
            }
          });
          return filter;
        });
        return data;
      })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Get a project.
 *
 * @param   {String}  id
 * @returns {Promise}
 */
function getProject(id) {
  return new Project({ id })
    .fetch({ withRelated: ['projectManager', 'users', 'tasks'] })
    .then((project) => project)
    .catch(Project.NotFoundError, () => {
      throw Boom.notFound('Project not found');
    });
}

/**
 * Get a project by title.
 *
 * @param   {String}  id
 * @returns {Promise}
 */
function getProjectByTitle(title) {
  return new Project({ title })
    .fetch()
    .then((project) => project)
    .catch(Project.NotFoundError, () => {
      throw Boom.notFound('Project not found');
    });
}

/**
 * Create new project.
 *
 * @param   {Object}  project
 * @returns {Promise}
 */
function createProject(project) {
  return new Promise((resolve, reject) => {
    new Project({
      id: project.id,
      title: project.title,
      description: project.description,
      project_manager: project.project_manager,
    })
      .save(null, { method: 'insert' })
      .then((data) => {
        data
          .users()
          .attach(project.users)
          .then((result) => resolve(data))
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => reject(Boom.notAcceptable('Invalid data for creating project')));
  });
}

/**
 * Update a project.
 *
 * @param   {String}  id
 * @param   {Object}  project
 * @returns {Promise}
 */
function updateProject(id, project) {
  return new Project({ id }).save({
    title: project.title,
    description: project.description,
    project_manager: project.project_manager,
  });
}

/**
 * Delete a project.
 *
 * @param   {String}  id
 * @returns {Promise}
 */
function deleteProject(id) {
  return new Project({ id }).fetch().then((project) => project.destroy());
}

module.exports = {
  getAllProjects,
  getProject,
  getRelatedProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectByTitle,
};