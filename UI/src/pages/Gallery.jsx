import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Filter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Save,
    Image,
    Tag,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import GalleryModal from "@/components/GalleryModal";
import { API_ENDPOINTS, JOB_PAGE_SIZE } from "@/config/apiConfig";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CategoryManagement = ({ onCategoryUpdate }) => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const fetchInternalCategories = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.getImageCategories, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ page: 1, pageSize: 100 }),
            });
            const result = await response.json();
            if (result.isSuccess) setCategories(result.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch categories.",
                variant: "destructive",
            });
        }
    }, [toast]);

    useEffect(() => {
        if (isExpanded) {
            fetchInternalCategories();
        }
    }, [isExpanded, fetchInternalCategories]);

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return;
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.createImageCategory, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name: newCategoryName }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Category created successfully!",
                });
                setNewCategoryName("");
                await fetchInternalCategories();
                onCategoryUpdate();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to create category.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            toast({
                title: "Error",
                description: "An error occurred.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const handleUpdate = async (id) => {
        if (!editingCategoryName.trim()) return;
        showLoader();
        try {
            const response = await fetch(
                API_ENDPOINTS.updateImageCategory(id),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ id, name: editingCategoryName }),
                }
            );
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Category updated successfully!",
                });
                setEditingCategoryId(null);
                setEditingCategoryName("");
                await fetchInternalCategories();
                onCategoryUpdate();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to update category.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            toast({
                title: "Error",
                description: "An error occurred.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const handleDelete = async (id) => {
        showLoader();
        try {
            const response = await fetch(
                API_ENDPOINTS.deleteImageCategory(id),
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Category deleted successfully!",
                });
                await fetchInternalCategories();
                onCategoryUpdate();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete category.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            toast({
                title: "Error",
                description: "An error occurred.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center text-left"
            >
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Tag className="mr-2" />
                    Category Management
                </h2>
                {isExpanded ? (
                    <ChevronUp className="h-6 w-6" />
                ) : (
                    <ChevronDown className="h-6 w-6" />
                )}
            </button>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4"
                >
                    <div className="flex gap-4 mb-6">
                        <Input
                            placeholder="New category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="corporate-gradient text-white"
                                    disabled={!newCategoryName.trim()}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Create Category?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to create this
                                        category?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCreate}>
                                        Create
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                            >
                                {editingCategoryId === cat.id ? (
                                    <Input
                                        value={editingCategoryName}
                                        onChange={(e) =>
                                            setEditingCategoryName(
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className="font-medium text-gray-700">
                                        {cat.name}
                                    </span>
                                )}
                                <div className="flex gap-2">
                                    {editingCategoryId === cat.id ? (
                                        <>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        disabled={
                                                            !editingCategoryName.trim()
                                                        }
                                                    >
                                                        <Save className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Update Category?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to update this
                                                            category?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    cat.id
                                                                )
                                                            }
                                                        >
                                                            Update
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    setEditingCategoryId(null)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingCategoryId(cat.id);
                                                setEditingCategoryName(
                                                    cat.name
                                                );
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete Category?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will delete "{cat.name}
                                                    ". Are you sure?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(cat.id)
                                                    }
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [userRole, setUserRole] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.getImageCategories, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ page: 1, pageSize: 100 }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                setCategories([{ id: "all", name: "All" }, ...result.data]);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch categories.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to fetch categories.",
                variant: "destructive",
            });
        }
    }, [toast]);

    const fetchGalleryImages = useCallback(
        async (page, categoryId) => {
            setIsLoading(true);
            showLoader();
            try {
                let response;
                if (categoryId === "all") {
                    response = await fetch(API_ENDPOINTS.getGalleryImages, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({ page, pageSize: JOB_PAGE_SIZE }),
                    });
                } else {
                    response = await fetch(
                        API_ENDPOINTS.getGalleryImagesByCategory(categoryId),
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem(
                                    "token"
                                )}`,
                            },
                        }
                    );
                }

                const result = await response.json();
                if (result.isSuccess) {
                    setGalleryItems(result.data);
                    setTotalItems(result.total || result.data.length);
                    setCurrentPage(page);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to fetch gallery images.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Network Error",
                    description: "Could not connect to fetch images.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
                hideLoader();
            }
        },
        [toast, showLoader, hideLoader]
    );

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        setUserRole(role);
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchGalleryImages(1, activeFilter);
    }, [activeFilter, fetchGalleryImages]);

    const handleFilterChange = (categoryId) => {
        setActiveFilter(categoryId);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalItems / JOB_PAGE_SIZE)) {
            fetchGalleryImages(newPage, activeFilter);
        }
    };

    const handleFormSubmit = async (itemData) => {
        showLoader();
        try {
            const isEditing = !!editingItem;
            let imageUrl = isEditing ? editingItem.imageUrl : "";

            if (itemData.imageFile) {
                const getUrlResponse = await fetch(
                    API_ENDPOINTS.getUploadUrl(itemData.imageFile.name),
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                const urlResult = await getUrlResponse.json();
                if (!urlResult.isSuccess)
                    throw new Error("Failed to get upload URL.");

                await fetch(urlResult.data.uploadUrl, {
                    method: "PUT",
                    body: itemData.imageFile,
                    headers: { "Content-Type": itemData.imageFile.type },
                });
                imageUrl = urlResult.data.fileUrl;
            } else if (!isEditing) {
                throw new Error("Image file is required for new items.");
            }

            const endpoint = isEditing
                ? API_ENDPOINTS.updateGalleryImage(editingItem.id)
                : API_ENDPOINTS.createGalleryImage;
            const method = isEditing ? "PUT" : "POST";

            const payload = {
                title: itemData.title,
                description: itemData.description,
                imageUrl: imageUrl,
                categoryId: parseInt(itemData.category, 10),
            };
            if (isEditing) payload.id = editingItem.id;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: `Gallery item ${
                        isEditing ? "updated" : "created"
                    }.`,
                });
                setIsModalOpen(false);
                fetchGalleryImages(currentPage, activeFilter);
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to save item.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Submission Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const resolveImage = (url) => {
        if (!url) return null;
        if (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("data:") ||
            url.startsWith("blob:")
        ) {
            return url;
        }
        return `https://${url}`;
    };

    const handleDeleteItem = async (id) => {
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.deleteGalleryImage(id), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Gallery item deleted.",
                });
                fetchGalleryImages(currentPage, activeFilter);
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete item.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to server.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };
    const openEditModal = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    const totalPages = Math.ceil(totalItems / JOB_PAGE_SIZE);

    return (
        <>
            <Helmet>
                <title>Gallery - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Explore our gallery of achievements, team moments, and professional milestones."
                />
            </Helmet>

            <section className="relative py-20 corporate-gradient text-white">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                                Our Gallery
                            </h1>
                            <p className="text-xl md:text-2xl max-w-3xl opacity-90">
                                Showcasing achievements, team, and memorable
                                moments
                            </p>
                        </motion.div>
                        {(userRole === "Admin" || userRole === "Staff") && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Button
                                    onClick={openAddModal}
                                    size="lg"
                                    className="bg-white text-gray-900 hover:bg-gray-100"
                                >
                                    <Image className="w-5 h-5 mr-2" />
                                    Add Image
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-8 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {(userRole === "Admin" || userRole === "Staff") && (
                        <CategoryManagement
                            onCategoryUpdate={fetchCategories}
                        />
                    )}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={
                                    activeFilter === category.id
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => handleFilterChange(category.id)}
                                className={`${
                                    activeFilter === category.id
                                        ? "corporate-gradient text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                        </div>
                    ) : galleryItems.length === 0 ? (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No Images Found
                            </h3>
                            <p className="text-gray-600 mb-8">
                                There are no images in this category yet.
                            </p>
                            {(userRole === "Admin" || userRole === "Staff") && (
                                <Button
                                    onClick={openAddModal}
                                    size="lg"
                                    className="corporate-gradient text-white"
                                >
                                    <Image className="w-5 h-5 mr-2" />
                                    Add Image
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {galleryItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden group"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={resolveImage(item.imageUrl)}
                                            alt={item.title}
                                            className="w-full h-64 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                                            onClick={() =>
                                                setSelectedImage(item)
                                            }
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {(userRole === "Admin" ||
                                            userRole === "Staff") && (
                                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                    className="w-8 h-8 bg-white/90 hover:bg-white"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="w-8 h-8"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will
                                                                permanently
                                                                delete the
                                                                gallery image.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDeleteItem(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p
                                            className="text-gray-600 text-sm leading-relaxed"
                                            style={{ whiteSpace: "pre-line" }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && activeFilter === "all" && (
                        <div className="mt-8 flex justify-center items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative max-w-4xl max-h-[90vh] w-full"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:bg-white/20"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <img
                            src={resolveImage(selectedImage.imageUrl)}
                            alt={selectedImage.title}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                            <h3 className="text-xl font-bold mb-2">
                                {selectedImage.title}
                            </h3>
                            <p
                                className="text-sm opacity-90"
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {selectedImage.description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}

            <GalleryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                item={editingItem}
                categories={categories.filter((c) => c.id !== "all")}
            />
        </>
    );
};

export default Gallery;
