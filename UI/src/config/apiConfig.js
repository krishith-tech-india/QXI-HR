const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5215/";

export const API_ENDPOINTS = {
    login: `${API_BASE_URL}api/Auth/login`,
    getJobPosts: `${API_BASE_URL}api/JobPosts/GetAll`,
    getJobPostById: (id) => `${API_BASE_URL}api/JobPosts/GetById/${id}`,
    getApplicationsByJobId: (jobId) =>
        `${API_BASE_URL}api/JobApplications/GetByJobPost/ByJob/${jobId}`,
    createJobPost: `${API_BASE_URL}api/JobPosts/Create`,
    updateJobPost: (id) => `${API_BASE_URL}api/JobPosts/Update/${id}`,
    deleteJobPost: (id) => `${API_BASE_URL}api/JobPosts/Delete/${id}`,
    getUploadUrl: (filename) =>
        `${API_BASE_URL}api/JobApplications/GetUploadUrl?filename=${filename}`,
    createApplication: `${API_BASE_URL}api/JobApplications/Create`,
    checkApplicationExists: `${API_BASE_URL}api/JobApplications/CheckApplicationExist`,
    sendVerificationCode: (email) =>
        `${API_BASE_URL}api/JobApplications/SendVerificationCode?email=${email}`,
    verifyEmailCode: `${API_BASE_URL}api/JobApplications/VerifyEmailCode`,
    sendContactEmail: `${API_BASE_URL}api/JobApplications/SendEMailContactMessage`,
    getUsers: `${API_BASE_URL}api/Users/GetAll`,
    createUser: `${API_BASE_URL}api/Users/Create`,
    updateUser: (id) => `${API_BASE_URL}api/Users/Update/${id}`,
    deleteUser: (id) => `${API_BASE_URL}api/Users/Delete/${id}`,
    getRoles: `${API_BASE_URL}api/Roles/GetAll`,
    // Gallery Endpoints
    getImageCategories: `${API_BASE_URL}api/ImageCategories/GetAll`,
    createImageCategory: `${API_BASE_URL}api/ImageCategories/Create`,
    updateImageCategory: (id) =>
        `${API_BASE_URL}api/ImageCategories/Update/${id}`,
    deleteImageCategory: (id) =>
        `${API_BASE_URL}api/ImageCategories/Delete/${id}`,
    getGalleryImages: `${API_BASE_URL}api/GallaryImages/GetAll`,
    getGalleryImagesByCategory: (id) =>
        `${API_BASE_URL}api/GallaryImages/GetByCategory/${id}`,
    createGalleryImage: `${API_BASE_URL}api/GallaryImages/Create`,
    updateGalleryImage: (id) => `${API_BASE_URL}api/GallaryImages/Update/${id}`,
    deleteGalleryImage: (id) => `${API_BASE_URL}api/GallaryImages/Delete/${id}`,
    // Clients
    getClients: `${API_BASE_URL}api/Clients/GetAll`,
    createClient: `${API_BASE_URL}api/Clients/Create`,
    deleteClient: (id) => `${API_BASE_URL}api/Clients/Delete/${id}`,
    getClientUploadUrl: (filename) =>
        `${API_BASE_URL}api/Clients/GetUploadUrl?filename=${filename}`,
};

export const JOB_PAGE_SIZE = 10;
