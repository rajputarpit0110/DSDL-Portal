const projectRepository = require('../repositories/projectRepository');
const ApiError = require('../utils/apiError');

class ProjectService {
  async getAllProjects() {
    return await projectRepository.findAll();
  }

  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return project;
  }

  generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createProject(data, submitterId) {
    let slug = data.slug || this.generateSlug(data.title);
    
    // Check slug uniqueness
    const existing = await projectRepository.findBySlug(slug);
    if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Submitter automatically becomes the lead
    const projectData = {
      ...data,
      slug,
      leadId: submitterId,
      status: 'PROPOSED' // Enforce PROPOSED state initially
    };

    return await projectRepository.create(projectData);
  }

  async updateProject(id, data, requestingUserId, requestingUserRole) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Security Check: Only admin, lead, or the project lead can update
    const isProjectLead = project.leadId === requestingUserId;
    const isGlobalLeadOrAdmin = ['admin', 'lead'].includes(requestingUserRole);

    if (!isProjectLead && !isGlobalLeadOrAdmin) {
      throw new ApiError(403, 'You do not have permission to edit this project');
    }

    let slug = data.slug || project.slug;
    if (data.title && data.title !== project.title && !data.slug) {
       slug = this.generateSlug(data.title);
    }

    if (slug !== project.slug) {
      const existing = await projectRepository.findBySlug(slug);
      if (existing) {
          slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    return await projectRepository.update(id, { ...project, ...data, slug });
  }

  async deleteProject(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    await projectRepository.delete(id);
  }
}

module.exports = new ProjectService();
