import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. CREATE PROJECT
  const addProject = async (newProject) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to post.");

      const authorName = user.user_metadata?.full_name || user.email || "Anonymous";
      const ownerEmail = newProject.contactEmail || user.email;

      const { error } = await supabase.from('projects').insert([{ 
        title: newProject.title, 
        description: newProject.description, 
        skills: newProject.skills, 
        user_id: user.id, 
        author_name: authorName, 
        owner_email: ownerEmail,
        max_members: newProject.maxMembers || 3
      }]);

      if (error) throw error;
      fetchProjects(); 
    } catch (error) {
      alert("Failed to create project: " + error.message);
    }
  };

  // 3. UPDATE PROJECT (This fixes the Edit Page!)
  const updateProject = async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          title: updatedData.title,
          description: updatedData.description,
          skills: updatedData.skills,
          owner_email: updatedData.contactEmail,
          max_members: updatedData.maxMembers
        })
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
      alert("Project updated successfully!");
    } catch (error) {
      alert("Error updating: " + error.message);
    }
  };

  // 4. DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  // 5. APPLICATION LOGIC
  const applyToProject = async (projectId, message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const applicantName = user.user_metadata?.full_name || user.email;
      
      const githubUsername = user.user_metadata?.user_name;
      const githubUrl = githubUsername ? `https://github.com/${githubUsername}` : null;

      const { data: existing } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', projectId)
        .eq('applicant_id', user.id)
        .single();

      if (existing) {
        alert("You have already applied!");
        return;
      }

      const { error } = await supabase.from('applications').insert([{
        project_id: projectId,
        applicant_id: user.id,
        applicant_name: applicantName,
        applicant_email: user.email,
        message: message,
        status: 'pending',
        applicant_github: githubUrl
      }]);

      if (error) throw error;
      alert("Application sent successfully! 🚀");
    } catch (error) {
      alert("Error applying: " + error.message);
    }
  };

  const fetchApplications = async (projectId) => {
    try {
      const { data, error } = await supabase.from('applications').select('*').eq('project_id', projectId).eq('status', 'pending');
      if (error) throw error;
      return data || [];
    } catch (error) { return []; }
  };

  const fetchMyApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('applications')
        .select(`*, projects (title, owner_email, author_name)`)
        .eq('applicant_id', user.id);
      if (error) throw error;
      return data;
    } catch (error) { return []; }
  };

  const handleApplication = async (applicationId, projectId, newStatus) => {
    try {
      const { error: appError } = await supabase.from('applications').update({ status: newStatus }).eq('id', applicationId);
      if (appError) throw appError;
      if (newStatus === 'accepted') {
        const { data: project } = await supabase.from('projects').select('current_members').eq('id', projectId).single();
        await supabase.from('projects').update({ current_members: (project.current_members || 1) + 1 }).eq('id', projectId);
        fetchProjects();
      }
    } catch (error) { alert("Error: " + error.message); }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, loading, 
      addProject, updateProject, deleteProject, 
      applyToProject, fetchApplications, handleApplication, fetchMyApplications 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);